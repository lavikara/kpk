const joi = require("joi");

exports.createProduct = joi.object({
  name: joi.string().trim().required(),
  description: joi.string().trim().required(),
  price: joi.number().greater(0).required(),
  image: joi.string().trim().required(),
  category: joi.string().required(),
  stock: joi
    .object({
      quantity_available: joi.number().integer().greater(0),
    })
    .required(),
});

exports.productId = joi.object({
  product_id: joi.string().trim().required(),
});
