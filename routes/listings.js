const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//new route
router.get("/new", isLoggedIn, listingController.listingNewForm);

router.get("/search", wrapAsync(listingController.roomType));

router
  .route("/:id")
  .get(isLoggedIn, wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListng));

//edit route
router.get(
  "/:id/new",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
