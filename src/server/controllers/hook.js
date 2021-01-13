const usermodel = require("../../db/models/userModel.js");
const api = require("../utils/api.js");

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
      res.status(200).send();
      const userId = req.body.txRef.slice(10);
      const transId = req.body.id;
      const verified = await api
        .verifyPayment(transId)
        .then(({ data }) => {
          return {
            txRef: data.data.tx_ref,
            amount: data.data.amount,
            currency: data.data.currency,
            status: data.data.status,
            meta: data.data.meta.type,
          };
        })
        .catch((error) => {
          console.log(error);
        });
      switch (verified.meta) {
        case "vendor registration":
          if (
            verified.txRef == req.body.txRef &&
            verified.amount == req.body.amount &&
            verified.currency == req.body.currency &&
            verified.status == "successful"
          ) {
            await usermodel.findOneAndUpdate(
              { _id: userId },
              { vendor_status: true }
            );
          }
          break;

        default:
          break;
      }
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while making payment",
      });
    }
  };
};
