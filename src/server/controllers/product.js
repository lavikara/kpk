const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const productmodel = require("../../db/models/productModel.js");

exports.create_product = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokendata = jwt.verify(token, env.config.JWT_SECRET);
      req.body.vendor_id = tokendata.id;
      req.body.quantity = 0;
      req.body.sub_total = 0;
      const product = await productmodel.create(req.body);

      res.status(200).send({
        status: "success",
        message: "product was successfully created",
        data: product,
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while creating your product",
      });
    }
  };
};

// used in add to cart method
exports.get_single_product = async (id) => {
  try {
    return await productmodel.findById(id);
  } catch (err) {
    console.log(err);
  }
};

exports.get_all_product = () => {
  return async (req, res, next) => {
    try {
      const product = await productmodel.find();

      res.status(200).send({
        status: "success",
        data: product,
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while geting all product",
      });
    }
  };
};
