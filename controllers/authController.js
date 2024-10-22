const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).redirect('/register');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create(username, hashedPassword);  
        res.status(201).redirect('/');
        console.log('Register is Success!');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await User.findByUsername(username);  

        if (users.length === 0) {
            req.flash('error', 'User not found');
            return res.redirect('/login');
        }
        const user = users[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            req.flash('error', 'Incorrect password');
            return res.redirect('/login');
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Internal server error');
        res.status(500).redirect('/login');
    }
};
