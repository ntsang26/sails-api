require('dotenv').config()
const nodemailer = require('nodemailer')

module.exports = {
    transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTHOR_EMAIL,
            pass: process.env.AUTHOR_PASSWORD
        }
    })
}