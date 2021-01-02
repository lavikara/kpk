const mongoose = require("mongoose");

/* mongoose user schema */

const productschema = new mongoose.Schema({
  vendor_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sub_total: {
    type: Number,
    required: true,
  },
});

const productmodel = mongoose.model("products", productschema);

module.exports = productmodel;
