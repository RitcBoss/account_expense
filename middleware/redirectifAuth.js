module.exports = (req, res, next) => {
    const user = req.user || null;
    if (user) {
        return res.redirect('/login')
    }
    next()
}