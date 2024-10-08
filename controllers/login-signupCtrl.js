const User = require("../Schema/userSchema");

const renderPage = async (req, res) => {
  res.render("login-signup");
};

const handleLoginorSignup = async (req, res) => {
  const formType = req.body.form_type_inp;
  if (formType === "Login") {
    handleLogin(req, res);
  } else if (formType === "Signup") {
    handleSignup(req, res);
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid form type provided",
    });
  }
};

const handleSignup = async (req, res) => {
    const { username_inp, email_inp, pass_inp, birthdate_inp } = req.body;
  
    try {
      const existingUser = await User.findOne({ email: email_inp });
      if (existingUser) {
        return res.json({
          success: false,
          message: "Email already in use",
        });
      }
  
      const [day, month, year] = birthdate_inp.split("/");
      const birthdate = new Date(`${year}-${month}-${day}`);
  
      if (isNaN(birthdate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid birthdate format. Use DD/MM/YYYY.",
        });
      }
  

      const today = new Date();
      let age = today.getFullYear() - birthdate.getFullYear();
      const monthDiff = today.getMonth() - birthdate.getMonth();
      const dayDiff = today.getDate() - birthdate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }
  
      if (age < 18) {
        return res.status(400).json({
          success: false,
          message: "You must be at least 18 years old to sign up.",
        });
      }
  
      const newUser = new User({
        name: username_inp,
        password: pass_inp,
        email: email_inp,
        birthdate: birthdate,
      });
  
      req.session.user = newUser;
      req.session.save();
  
      newUser
        .save()
        .then((user) =>
          res.json({
            success: true,
            statusType: "success",
            user: newUser,
          })
        )
        .catch((error) => {
          console.error("Save error:", error);
          res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.errors,
          });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
  

const handleLogin = async (req, res) => {
  const { email_inp, pass_inp } = req.body;
  try {
    const existingUser = await User.findOne({ email: email_inp });
    if (!existingUser) {
      return res.json({
        success: false,
        message: "Can't find user with this email",
      });
    }

    if (existingUser.password === pass_inp) {
      req.session.user = existingUser;

      console.log(req.session.user);

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Failed to save session." });
        }
        return res.json({
          success: true,
          statusType: "success",
          user: req.session.user,
        });
      });
    } else {
      return res.json({
        success: false,
        message: "Wrong Password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

module.exports = {
  renderPage,
  handleLoginorSignup,
};
