const mongoose = require("mongoose");

/* mongoose user schema */

const cartschema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
  },
  total_price: {
    type: Number,
    required: true,
  },
  total_quantity: {
    type: Number,
    required: true,
  },
});

const cartmodel = mongoose.model("carts", cartschema);

module.exports = cartmodel;
