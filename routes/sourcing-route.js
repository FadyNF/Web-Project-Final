const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('sourcing', { user: req.session.user });
});

module.exports = router;