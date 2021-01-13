const usermodel = require("../../db/models/userModel.js");
const { verify_payment } = require("../controllers/payment.js");

exports.flutter_hook = () => {
  return async (req, res, next) => {
    try {
      var hash = req.headers["verif-hash"];
      if (!hash) {
        return;
      }
      const secret_hash = process.env.HOOK_HASH;

      if (hash !== secret_hash) {
        return;
      }
      console.log(req.body);
      const id = req.body.txRef.slice(10);
      const transId = req.body.id;
      res.status(200).send();
      verify_payment(transId);
      // await usermodel.findOneAndUpdate({ _id: id }, { vendor_status: true });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while making payment",
      });
    }
  };
};
