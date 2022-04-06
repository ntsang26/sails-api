const { transporter } = require('./nodemailer')

module.exports = (options) => {
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err)
        }
        console.log('Sent!!!')
    })
}