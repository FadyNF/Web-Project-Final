const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login-signup');
});

const staticAdminEmail = 'yomna@gmail.com';
const staticAdminPassword = 'password123';
const staticUserEmail = 'sarah@gmail.com';
const staticUserPassword = '1234';

// User login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check against static credentials for admin
  if (email === staticAdminEmail && password === staticAdminPassword) {
    req.session.user = { email: staticAdminEmail, role: 'admin' };
    res.redirect('/admin'); // Redirect to the admin page after login
  } 
  // Check against static credentials for user
  else if (email === staticUserEmail && password === staticUserPassword) {
    req.session.user = { email: staticUserEmail, role: 'user' };
    res.redirect('/user'); // Redirect to the user page after login
  } 
  else {
    res.status(401).send('Invalid email or password');
  }
});

module.exports = router;