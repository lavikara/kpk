const joi = require("joi");

exports.cart = joi.object({
  product_id: joi.string().trim().required(),
});
