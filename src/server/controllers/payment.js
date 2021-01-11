const api = require("../utils/api.js");

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
