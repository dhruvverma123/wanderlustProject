require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
// process.env.ATLAS_DB
const dbUrl = "mongodb://127.0.0.1:27017/wonderlust";
const port = 8080;

app.set("view engine", "ejs"); // for ejs extension
app.set("views", path.join(__dirname, "views")); //for running ejs files from outside the folder
app.use(express.static(path.join(__dirname, "/public"))); //for css and js files
app.use(express.urlencoded({ extended: true })); //for post,put,patch
app.use(express.json());
app.use(methodOverride("_method")); //for method-override

app.engine("ejs", ejsMate); // for ejsMate

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET_KEY,
  },
  touchAfter: 24 * 3600,
});

app.use(
  session({
    store: store,
    secret: process.env.SECRET_KEY, //session middleware
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(flash()); //flash middleware

app.use(passport.initialize()); //for passport
app.use(passport.session()); //for passport
passport.use(new LocalStrategy(User.authenticate())); //for passport local

passport.serializeUser(User.serializeUser()); //for passport
passport.deserializeUser(User.deserializeUser()); //for passport

//for database connection
main()
  .then(() => {
    console.log("conected to DB");
  })
  .catch((err) => {
    console.log("error ", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter); //for listing routes
app.use("/listings/:id/reviews", reviewRouter); //for review routes
app.use("/", userRouter); //for user routes

app.get(
  "/search",
  wrapAsync(async (req, res) => {
    let { search } = req.query;
    let listings = await Listing.find({ roomType: search });
    if (listings.length > 0) {
      res.render("listings/roomType.ejs", { listings });
    } else {
      req.flash("error", "This type of room is not available");
      res.redirect("/listings");
    }
  })
);

//when all above routes does not match then this middleware will work
app.use((req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

//error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message } = err;
  res.status(status).render("listings/error.ejs", { message });
});

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
