const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connection to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}
async function initDB() {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "68e0ff6f34832b378783b87d",
      geometry: {
        type: "Point",
        coordinates: [
          (Math.random() * 180 - 90).toFixed(6), // longitude (-90 to +90)
          (Math.random() * 180 - 90).toFixed(6), // latitude (-90 to +90)
        ],
      },
    }));
    await Listing.insertMany(initData.data);
    console.log("ho gya");
  } catch (err) {
    console.log(err);
  }
}

initDB();
