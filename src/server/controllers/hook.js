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
          if (
            data.data.status === "successful" &&
            data.data.meta.type === "vendor registration"
          ) {
            usermodel.findOne({ id: data.data.meta.user_id }, (err, doc) => {
              doc.vendor_status = true;
            });
            productmodel.find(
              { vendor_id: data.data.meta.user_id },
              (err, doc) => {
                doc.active = true;
              }
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
