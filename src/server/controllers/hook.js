const api = require("../utils/api.js");

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
