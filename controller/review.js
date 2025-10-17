const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let { rating, comment } = req.body;

  let listing = await Listing.findById(id);

  let review = new Review({
    rating: rating,
    comment: comment,
  });
  review.author = req.user._id;

  listing.reviews.push(review);

  review.save();
  listing.save();
  req.flash("success", "Added successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Deleted successfully");
  res.redirect(`/listings/${id}`);
};
