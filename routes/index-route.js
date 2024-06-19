const express = require('express');
const router = express.Router();

// Example of setting loggedIn based on session or authentication status
router.get('/', (req, res) => {
    // Example logic to determine if user is logged in
    const loggedIn = req.session.user ? true : false;
    res.render('index', { loggedIn }); // Pass loggedIn to the view
});

module.exports = router;
