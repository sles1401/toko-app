const express = require('express');
const router = express.Router();

// Middleware for authentication check (if needed)
const authenticate = (req, res, next) => {
    // Implement your authentication check logic here
    // If authenticated, call next()
    // Otherwise, send a 401 Unauthorized response
    if (req.isAuthenticated()) { // Example condition
        return next();
    }
    res.status(401).send('Unauthorized');
};

// Define the logout route
router.post('/', authenticate, (req, res) => {
    // For session-based authentication
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Failed to logout');
            }
            res.status(200).send('Logged out successfully');
        });
    } else {
        // For token-based authentication
        // In a token-based approach, you typically don't need server-side handling
        res.status(200).send('Logged out successfully');
    }
});

module.exports = router;
