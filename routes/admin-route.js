const express = require("express");
const router = express.Router();
const {checkAdminAuth} = require("../middleware/userAuthenticator");

function checkAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login-signup');
    }
  }
  
  // Admin route (protected)
  router.get('/', checkAuth, (req, res) => {
    res.render('admin', { email: req.session.user.email });
  });
module.exports = router;
// Admin route (protected)
router.get("/", checkAdminAuth, (req, res) => {
    res.render("admin", { email: req.session.user.email });
});
module.exports = router;
