const mongoose = require("mongoose");

/* mongoose user schema */

const userschema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: Object,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  vendor_status: {
    type: Boolean,
  },
  business_name: {
    type: String,
  },
  account_number: {
    type: Number,
  },
  rider_license: {
    type: String,
  },
  rider_picture: {
    type: String,
  },
  role: {
    type: String,
    enum: ["customer", "vendor", "rider"],
    required: true,
  },
});

userschema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const usermodel = mongoose.model("users", userschema);

module.exports = usermodel;
