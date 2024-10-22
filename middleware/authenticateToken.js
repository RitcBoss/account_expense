const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; 
    if (!token) {
        req.user = null;
        return next(); 
    } 

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null; 
            console.error("JWT verification failed:", err);
            return next(); 
        }
        req.user = user; 
        
        next();
    });
};

module.exports = authenticateToken;
