let express = require("express");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
let router = express.Router();
const usercontroller = require("../controller/user.js");

router
  .route("/signup")
  .get(usercontroller.renderSignUpForm)
  .post(usercontroller.signup);

router
  .route("/login")
  .get(usercontroller.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usercontroller.login
  );

router.get("/logout", usercontroller.logout);

module.exports = router;
