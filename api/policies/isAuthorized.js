
const moment = require('moment')

module.exports = async (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    // 'Bearer [token]'
    const token = authorizationHeader.split(' ')[1]
    const accessToken = await Token.findOne({ token: token })
    const now = moment().format()

    if (accessToken) {
        if (now > accessToken.expire_time) {
            await Token.destroyOne({ token: token })
            return res.view('pages/login')
        }
        return next()
    }
    return res.view('pages/login')

}
