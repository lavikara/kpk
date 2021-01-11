exports.flutter_hook = () => {
  return (req, res, next) => {
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
      console.log(transaction);
      res.status(200).send();
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while making payment",
      });
    }
  };
};
