const sendMail = require('./sendMail')
const bcrypt = require('bcrypt')
const moment = require('moment')

require('dotenv').config()

module.exports = {
    sendOTPVetification: async (user, res) => {
        try {
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`

            let options = {
                from: process.env.AUTHOR_EMAIL,
                to: user.email,
                subject: 'BOG App - Xác Minh Tài Khoản',
                html: `
                    <h2>Xin chào ${user.email}, Cảm ơn bạn đã đăng kí tài khoản tại website của chúng tôi !</h2>
                    <h3>Vui lòng Xác Minh tài khoản của bạn để tiếp tục...</h3>
                    <p>Mã OTP: <b>${otp}</b></p>
                    <p>Mã OTP có hiệu lực trong 5 phút.</p>
                    `
            }
            const hashedOTP = await bcrypt.hash(otp, 10)
            await UserOtp.create({
                user_id: user.id,
                otp: hashedOTP,
                expireAt: moment().add(5, 'm').format()
            })

            sendMail(options)

            res.json({
                status: 'PENDING',
                message: 'Verification Email OTP Sent',
                data: {
                    user_id: user.id,
                    email: email
                }
            })
        } catch (error) {
            console.log(error)
        }
    },
    sendOTPVetificationDevice: async (user,res) => {
        try {
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`

            let options = {
                from: process.env.AUTHOR_EMAIL,
                to: user.email,
                subject: 'BOG App - Xác Minh Thiết Bị',
                html: `
                    <h2>Xin chào ${user.email}, bạn đã đăng nhập bằng thiết bị mới!</h2>
                    <h3>Vui lòng xác minh thiết bị của bạn của bạn để tiếp tục...</h3>
                    <p>Mã OTP: <b>${otp}</b></p>
                    <p>Mã OTP có hiệu lực trong 5 phút.</p>
                    `
            }
            const hashedOTP = await bcrypt.hash(otp, 10)
            await UserOtp.create({
                user_id: user.id,
                otp: hashedOTP,
                expireAt: moment().add(5, 'm').format()
            })

            sendMail(options)

            res.json({
                status: 'PENDING',
                message: 'Verification Email OTP Sent',
                data: {
                    user_id: user.id,
                    email: user.email
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}