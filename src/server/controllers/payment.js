const api = require("../utils/api.js");
const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const usermodel = require("../../db/models/userModel.js");

exports.pay_with_flutter = () => {
  return async (req, res, next) => {
    try {
      await api
        .payWithFlutter(req.body)
        .then(({ data }) => {
          res.status(200).send({
            status: "success",
            message: "Payment request made",
            data,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while making payment",
      });
    }
  };
};

exports.verify_payment = (id) => {
  return async (req, res, next) => {
    try {
      await api
        .verifyPayment(id)
        .then(({ data }) => {
          console.log("verify: ", data);
          res.status(200).send({
            status: "success",
            message: "Payment verified",
            data,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while making payment",
      });
    }
  };
};

exports.get_bank_list = () => {
  return async (req, res, next) => {
    try {
      await api
        .getBankList(req.body.country)
        .then(({ data }) => {
          res.status(200).send({
            status: "success",
            message: "Fetched bank list",
            data,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while getting bank list",
      });
    }
  };
};

exports.create_rider_sub_account = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokendata = jwt.verify(token, env.config.JWT_SECRET);
      req.body.split_type = "percentage";
      req.body.split_value = 0.8;
      const accountDetails = await api
        .createSubAccount(req.body)
        .then(({ data }) => {
          return data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      await usermodel.findOneAndUpdate(
        { _id: tokendata.id },
        { account_details: accountDetails, rider_status: true },
        { new: true }
      );
      res.status(200).send({
        status: "success",
        message: "Account created",
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while creating sub-account",
      });
    }
  };
};

exports.create_vendor_sub_account = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokendata = jwt.verify(token, env.config.JWT_SECRET);
      req.body.split_type = "percentage";
      req.body.split_value = 0.975;
      const accountDetails = await api
        .createSubAccount(req.body)
        .then(({ data }) => {
          return data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      await usermodel.findOneAndUpdate(
        { _id: tokendata.id },
        { account_details: accountDetails },
        { new: true }
      );
      res.status(200).send({
        status: "success",
        message: "Account created",
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while creating sub-account",
      });
    }
  };
};
