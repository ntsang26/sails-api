const randomstring = require('randomstring')

module.exports = (options) => {
    return randomstring.generate(options)
}