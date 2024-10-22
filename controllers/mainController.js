const connection = require('../db');

module.exports = (req, res) => {
    const user = req.user || null;
    const userId = user.userId;
    const username = user.username;
    
    if (!user) {
        return res.redirect('/login'); 
    }
    connection.query('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, accounts) => {
        if (err) {
            console.error('Error fetching accounts:', err);
            return res.status(500).send('Error fetching accounts');
        }
        res.render('main', { user, accounts, username }); 
    });
}
