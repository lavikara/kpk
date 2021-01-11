const api = require("../utils/api.js");
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
      let id = req.body.meta.user_id;
      res.status(200).send();
      await usermodel.findOneAndUpdate({ _id: id }, { vendor_status: true });
      // await api
      //   .verifyPayment(transaction.id)
      //   .then(({ data }) => {
      //     if (
      //       data.data.status === "successful" &&
      //       data.data.meta.type === "vendor registration"
      //     ) {
      //       const id = data.data.meta.user_id;
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while making payment",
      });
    }
  };
};
