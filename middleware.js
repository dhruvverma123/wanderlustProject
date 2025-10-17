const ExpressError = require("./utils/ExpressError.js");
const reviewSchema = require("./joiChecker/reviewChecker.js");
const testSchema = require("./joiChecker/listingchecker");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

//after passport.authenticate() - middleware
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.url = req.originalUrl;
    req.flash("error", "you must logged in");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.url) {
    res.locals.url = req.session.url;
  }
  next();
};

//to check real user of listing or not
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;

  let listingData = await Listing.findById(id);
  if (listingData.owner._id.equals(res.locals.currentUser._id)) {
    next();
  } else {
    req.flash("error", "you can only show this listing");
    res.redirect(`/listings/${id}`);
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (req.user._id.equals(review.author._id)) {
    next();
  } else {
    req.flash("error", "you are not a author of this listing");
    res.redirect(`/listings/${id}`);
  }
};

//joi requirement fulfil middleware (schema me sabkuch required hai, sab aana chahiye)
module.exports.validateListing = (req, res, next) => {
  let { error } = testSchema.validate(req.body);
  if (error) {
    let errMess = error.details[0].message;
    throw new ExpressError(400, errMess);
  } else {
    next();
  }
};

//for review collection middleware
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMess = error.details[0].message;
    throw new ExpressError(400, errMess);
  } else {
    next();
  }
};
