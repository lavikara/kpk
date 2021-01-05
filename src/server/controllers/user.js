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
      userobj["id"] = userobj["_id"];
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
