const { render } = require("ejs");
let mongoose = require("mongoose");

async function main() {
  await mongoose.connect(`mongodb://127.0.0.1:27017/oneToMany`);
}

main()
  .then(() => {
    console.log("connection success");
  })
  .catch((err) => {
    console.log(err);
  });

const orderSchema = new mongoose.Schema({
  item: String,
  city: String,
});

const custSchema = new mongoose.Schema({
  name: String,
  Orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

custSchema.post("findOneAndDelete", async (req) => {
  console.log("mongoose Middleware");
  if (req.Orders.length) {
    let result = await Order.deleteMany({ _id: { $in: req.Orders } });
    console.log(result);
  }
});

const Order = mongoose.model("Order", orderSchema);

const Customer = mongoose.model("Customer", custSchema);

let addUser = async () => {
  let customer1 = new Customer({
    name: "karan ",
  });

  let data1 = await Order.findOne({ item: "chai" });

  customer1.Orders.push(data1);
  customer1.save();
};

let delUser = async () => {
  let result = await Customer.findByIdAndDelete("68d768cd004b89c01a275dc8");
  console.log(result);
};

// addUser();

delUser();
