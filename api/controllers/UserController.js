/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

require('browser-env')()
const getToken = require('../utils/getToken')
const moment = require('moment')
const DeviceDetector = require('device-detector-js')
const sendMail = require('../utils/sendMail')
const bcrypt = require('bcrypt')
const { sendOTPVetification, sendOTPVetificationDevice } = require('../utils/otpVerify')

module.exports = {
    postLogin: async (req, res) => {
        try {
            const data = req.body
            let user = await User.findOne({ username: data.username })
            if (user) {
                const match = await bcrypt.compare(data.password, user.password)
                if (match) {
                    const deviceDetector = new DeviceDetector()
                    const device = deviceDetector.parse(navigator.userAgent)

                    const userDevice = await Device.findOne({
                        user_id: user.id,
                        device: device.device.type
                    })
                    if (!userDevice) {
                        // send mail
                        sendOTPVetificationDevice(user, res)
                    } else {
                        const accessToken = getToken(128)
                        // const refreshToken = getToken()
                        await Token.create({
                            token: accessToken,
                            // refreshToken: refreshToken,
                            owner: user.id,
                            expire_time: moment().add(3, 'm').format()
                        })

                        return res.json({
                            username: user.username,
                            accessToken,
                            // refreshToken
                        })
                    }
                } else {
                    console.log("Mật khẩu không chính xác !!!")
                    res.view("pages/login")
                }
            } else {
                console.log("Không tìm thấy tài khoản !!!")
                res.view("pages/login")
            }
        } catch (error) {
            sails.log.error(error)
            res.serverError("Something went wrong")
        }
    },

    postSignUp: async (req, res) => {
        try {
            const { username, password, email, confirm_password } = req.body
            if (username != "" && password != "") {
                if (password === confirm_password) {
                    const user = {
                        username: username,
                        password: password,
                        email: email,
                    }

                    const hashPassword = await bcrypt.hash(password, 10)
                    user.password = hashPassword

                    const createdUser = await User.create(user).fetch()
                    sendOTPVetification({ user_id: createdUser.id, email: createdUser.email }, res)
                } else {
                    req.session.messageSignUp = "Mật khẩu không trùng khớp !!!"
                    res.view("pages/signup")
                }
            } else {
                req.session.messageSignUp = "Vui lòng điền thông tin !!!"
                res.view("pages/signup")
            }
        } catch (error) {
            sails.log.error(error)
            res.serverError("Something went wrong")
        }
    },

    verifyOTP: async (req, res) => {
        try {
            let { user_id, otp } = req.body
            if (!user_id || !otp) {
                console.log('Empty otp')
            } else {
                const UserOTPRecords = await UserOtp.find({ user_id: user_id })
                if (UserOTPRecords.length <= 0) {
                    console.log('Tài khoản không tồn tại hoặc đã được xác minh')
                } else {
                    const { expireAt } = UserOTPRecords[0]
                    const hashedOTP = UserOTPRecords[0].otp

                    if (expireAt < moment().format()) {
                        await UserOtp.destroy({ user_id: user_id })
                        console.log('Mã OTP đã hết hiệu lực. Vui lòng yêu cầu lại.')
                    } else {
                        const validOTP = await bcrypt.compare(otp, hashedOTP)

                        if (!validOTP) {
                            console.log('Mã không đúng. Vui lòng nhập lại.')
                        } else {
                            await User.updateOne({ id: user_id }).set({ isVerified: true })
                            await UserOtp.destroy({ user_id: user_id })
                            res.json({
                                status: "VERIFIED",
                                message: "User email verified successfully!"
                            })
                        }
                    }
                }
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }
    },

    verifyOTPDevice: async (req, res) => {
        try {
            let { user_id, otp } = req.body
            if (!user_id || !otp) {
                console.log('Empty otp')
            } else {
                const UserOTPRecords = await UserOtp.find({ user_id: user_id })
                if (UserOTPRecords.length <= 0) {
                    console.log('Tài khoản không tồn tại hoặc đã được xác minh')
                } else {
                    const { expireAt } = UserOTPRecords[0]
                    const hashedOTP = UserOTPRecords[0].otp

                    if (expireAt < moment().format()) {
                        await UserOtp.destroy({ user_id: user_id })
                        console.log('Mã OTP đã hết hiệu lực. Vui lòng yêu cầu lại.')
                    } else {
                        const validOTP = await bcrypt.compare(otp, hashedOTP)

                        if (!validOTP) {
                            console.log('Mã không đúng. Vui lòng nhập lại.')
                        } else {
                            const deviceDetector = new DeviceDetector()
                            const device = deviceDetector.parse(navigator.userAgent)

                            await UserOtp.destroy({ user_id: user_id })
                            await Device.create({
                                device: device.device.type,
                                user_id: user_id
                            })
                            
                            res.json({
                                status: "VERIFIED",
                                message: "User device verified successfully!"
                            })
                        }
                    }
                }
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }
    },

    refreshVerifyOTP: async (req, res) => {
        try {
            let { user_id, email } = req.body

            if (!user_id || !email) {
                console.log("Không tìm thấy tài khoản")
            } else {
                await UserOtp.destroy({ user_id: user_id })
                sendOTPVetification({ user_id, email }, res)
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }
    },

    verifyUserDevice: async (req, res) => {
        try {
            const token = req.query.token
            const user = await User.findOne({ deviceToken: token })
            if (user) {
                await User.update({ deviceToken: token }).set({ deviceToken: '' })
                res.redirect('/login')
            } else {
                res.redirect('/signup')
                console.log('Device is not verified')
            }
        } catch (error) {
            console.log(error)
        }
    },

    refreshToken: async (req, res) => {
        const refreshToken = req.body.token
        if (!refreshToken) res.status(401)
        const token = await Token.findOne({ refreshToken: refreshToken })
        if (!token) res.forbidden()

        const accessToken = getToken()
        await Token.updateOne({ token: token.token }).set({ token: accessToken })
        res.json({
            accessToken
        })
    },

    logout: async (req, res) => {
        try {
            const token = req.body.token
            await Token.destroyOne({ token: token })
            res.status(200).json("You're logged out!!")
        } catch (error) {
            sails.log.error(error)
            res.serverError("Something went wrong")
        }
    },


}
