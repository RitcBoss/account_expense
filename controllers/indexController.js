module.exports = (req, res) => {
    const user = req.user || null;
    const username = user ? user.username : null;

    res.render('index', { user, username });
}
