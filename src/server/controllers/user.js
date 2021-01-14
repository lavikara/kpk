const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const usermodel = require("../../db/models/userModel.js");
const cart = require("../controllers/cart.js");

exports.signup_user = () => {
  return async (req, res, next) => {
    try {
      if (req.body.business_name) {
        req.body.role = "vendor";
        req.body.asigned_riders = [];
        req.body.account_details = { country: "" };
        req.body.vendor_status = false;
        req.body.is_registered = false;
      } else if (req.body.company_name) {
        req.body.role = "rider";
        req.body.asigned_stores = [];
        req.body.account_details = { country: "" };
        req.body.rider_status = false;
      } else {
        req.body.role = "customer";
      }
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = await usermodel.create(req.body);

      const userobj = user.toJSON();
      delete userobj.password;

      if (userobj.role === "customer") {
        cart.create_cart(userobj.id);
      }

      const token = jwt.sign({ id: userobj.id }, env.config.JWT_SECRET, {
        expiresIn: "8760h",
      });

      res.status(201).send({
        status: "success",
        data: { user: userobj, token },
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while creating your account",
      });
    }
  };
};

exports.login_user = () => {
  return async (req, res, next) => {
    try {
      const user = await usermodel.findOne(
        { email: req.body.email },
        "+password"
      );

      if (!user) {
        return res.status(403).send({
          status: "error",
          message: "invalid account",
        });
      }

      const ispasswordvalid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!ispasswordvalid) {
        return res.status(403).send({
          status: "error",
          message: "invalid account",
        });
      }

      const userobj = user.toJSON();
      userobj["_id"] = userobj["id"];
      delete userobj.password;
      delete userobj._id;

      const token = jwt.sign({ id: userobj.id }, env.config.JWT_SECRET);
      res.status(200).send({
        status: "success",
        data: { user: userobj, token },
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while trying to login",
      });
    }
  };
};

exports.get_all_riders = () => {
  return async (req, res, next) => {
    try {
      const user = await usermodel.find({ role: "rider", rider_status: true });

      res.status(200).send({
        status: "success",
        data: user,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while getting all riders",
      });
    }
  };
};

exports.get_vendor_by_id = () => {
  return async (req, res, next) => {
    try {
      const user = await usermodel.findById(req.query.id);

      res.status(200).send({
        status: "success",
        data: user,
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while geting vendor",
      });
    }
  };
};

exports.assign_riders = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokendata = jwt.verify(token, env.config.JWT_SECRET);
      const rider = await usermodel.findById(req.body.rider_id);
      const vendor = await usermodel.findById(tokendata.id);
      if (vendor.asigned_riders.length === 1) {
        return res.status(200).send({
          status: "success",
          message: "you can't have more than 1 riders",
          data: vendor,
        });
      }
      vendor.asigned_riders.push(rider);
      vendor.vendor_status = true;
      const updatedVendor = await usermodel.findOneAndUpdate(
        { _id: tokendata.id },
        vendor,
        { new: true }
      );
      res.status(200).send({
        status: "success",
        data: updatedVendor,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while assigning rider",
      });
    }
  };
};

exports.unassign_riders = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokendata = jwt.verify(token, env.config.JWT_SECRET);
      const vendor = await usermodel.findById(tokendata.id);
      vendor.asigned_riders.find((rider, index) => {
        if (rider._id == req.body.rider_id) {
          vendor.asigned_riders.splice(index, 1);
          vendor.vendor_status = false;
        }
      });
      const updatedVendor = await usermodel.findOneAndUpdate(
        { _id: tokendata.id },
        vendor,
        { new: true }
      );
      res.status(200).send({
        status: "success",
        data: updatedVendor,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "An error occured while unassigning rider",
      });
    }
  };
};
