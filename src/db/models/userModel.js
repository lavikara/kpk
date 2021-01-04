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
  business_name: {
    type: String,
  },
  cac_number: {
    type: String,
  },
  role: {
    type: String,
    enum: ["customer", "vendor"],
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
