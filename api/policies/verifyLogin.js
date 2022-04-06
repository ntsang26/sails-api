
module.exports = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (user.isVerified) {
            return next()
        } else {
            console.log("Please check the email to verify!!!")
        }
    } catch (error) {
        console.log(error)
    }
}