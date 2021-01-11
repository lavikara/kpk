exports.flutter_hook = () => {
  return (req, res, next) => {
    try {
      console.log(req);
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while making payment",
      });
    }
  };
};