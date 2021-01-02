exports.authorization = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        status: "error",
        message: "you're not authorized",
      });
    }
    next();
  };
};
