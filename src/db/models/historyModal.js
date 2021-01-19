const mongoose = require("mongoose");

/* mongoose user schema */

const historyschema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  order_history: {
    type: Array,
  },
});

historyschema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const historymodel = mongoose.model("history", historyschema);

module.exports = historymodel;
