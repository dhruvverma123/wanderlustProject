const User = require("../models/User.js");

module.exports.renderSignUpForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({
      username: username,
      email: email,
    });

    let addUser = await User.register(newUser, password);

    // automatically login karne ke liye
    req.login(addUser, (err) => {
      if (err) {
        next(err);
      } else {
        req.flash("success", "registered successfully");
        res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome to wonderlust!");
  let redirectUrl = res.locals.url || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "you logged out");
      res.redirect("/listings");
    }
  });
};
