const api = require("../utils/api.js");
const productmodel = require("../../db/models/productModel.js");
const usermodel = require("../../db/models/userModel.js");

exports.flutter_hook = () => {
  return async (req, res, next) => {
    try {
      var hash = req.headers["verif-hash"];
      if (!hash) {
        process.exit(1);
      }
      const secret_hash = process.env.HOOK_HASH;

      if (hash !== secret_hash) {
        process.exit(1);
      }
      let transaction = req.body;
      res.status(200).send();
      await api
        .verifyPayment(transaction.id)
        .then(({ data }) => {
          console.log("verify: ", data);
          if (data.data.status === "successful") {
            console.log(data.data.meta.user_id);
            usermodel.updateOne(
              { id: data.data.meta.user_id },
              { $set: { vendor_status: true } }
            );
            productmodel.updateMany(
              {
                vendor_id: data.data.meta.user_id,
              },
              { $set: { active: true } },
              { multi: true }
            );
          }
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
