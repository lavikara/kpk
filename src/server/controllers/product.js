const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const productmodel = require("../../db/models/productModel.js");
const usermodel = require("../../db/models/userModel.js");

exports.create_product = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokendata = jwt.verify(token, env.config.JWT_SECRET);
      const vendor = await usermodel.findById(tokendata.id);
      if (vendor.vendor_status === false) {
        req.body.active = false;
      } else {
        req.body.active = true;
      }
      req.body.vendor_id = tokendata.id;
      req.body.quantity = 0;
      req.body.sub_total = 0;
      req.body.dispatch_price = 0;
      req.body.account_id = {
        bankCode: vendor.account_details.account_bank,
        accountNumber: vendor.account_details.account_number,
      };
      const product = await productmodel.create(req.body);

      res.status(201).send({
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
      const product = await productmodel.find({
        active: true,
      });

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

exports.get_product_by_id = () => {
  return async (req, res, next) => {
    try {
      const product = await productmodel.findById(req.query.id);

      res.status(200).send({
        status: "success",
        data: product,
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while geting product",
      });
    }
  };
};
