const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];  // Format: Bearer <token>

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error('JWT verification failed:', err);
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.user = user;  // Save user information to req for access in other routes
            next();
        });
    } else {
        console.warn('No authorization header found');
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authenticateJWT;
