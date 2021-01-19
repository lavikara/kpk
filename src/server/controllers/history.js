const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const historyModal = require("../../db/models/historyModal.js");

exports.order_history = async (id) => {
  try {
    await historyModal.create({
      _id: id,
      order_history: [],
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_customer_history = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokendata = jwt.verify(token, env.config.JWT_SECRET);
      const history = await historyModal.findById(tokendata.id);

      res.status(200).send({
        status: "success",
        data: { history },
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while getting customer cart",
      });
    }
  };
};
