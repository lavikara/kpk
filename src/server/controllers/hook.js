const usermodel = require("../../db/models/userModel.js");

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
      let id = req.body.txRef.slice(10);
      res.status(200).send();
      await usermodel.findOneAndUpdate({ _id: id }, { vendor_status: true });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while making payment",
      });
    }
  };
};
