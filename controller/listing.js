const Listing = require("../models/listing.js");
const axios = require("axios");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.listingNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  //
  let loc = req.body.location;
  let apiKey = process.env.MAPTILER_API_KEY;

  const response = await axios.get(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(
      loc
    )}.json?key=${apiKey}`
  );
  console.log(req.body);
  //
  let path = req.file.path;
  let filename = req.file.filename;
  let { title, description, price, location, country, roomType } = req.body;
  let newListing = new Listing({
    title: title,
    description: description,
    price: price,
    location: location,
    country: country,
    roomType: roomType,
  });
  newListing.image.url = path;
  newListing.image.filename = filename;

  newListing.owner = req.user._id;
  newListing.geometry = response.data.features[0].geometry;
  await newListing.save();

  req.flash("success", "New Listing Added");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", {
      listing,
      mapKey: process.env.MAPTILER_API_KEY,
    });
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  } else {
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250,e_blur:200");
    res.render("listings/update.ejs", { listing, originalUrl });
  }
};

module.exports.updateListing = async (req, res) => {
  let { title, description, price, location, country } = req.body;
  let { id } = req.params;

  let updateListing = await Listing.findByIdAndUpdate(
    id,
    {
      title: title,
      description: description,
      price: price,
      location: location,
      country: country,
    },
    { runValidators: true }
  );
  console.log(req.file);

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    updateListing.image.url = url;
    updateListing.image.filename = filename;
    await updateListing.save();
  }

  req.flash("success", "Updated successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListng = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted successfully");
  res.redirect("/listings");
};
