const express = require("express");
const router = express.Router();
const product = require("../controllers/product.js");
const validator = require("../middlewares/validators/validate.js");
const joischema = require("../middlewares/validators/product.js");
const { authorization } = require("../middlewares/authorization.js");

router.post(
  "/create",
  authorization(),
  validator(joischema.createProduct),
  product.create_product()
);

module.exports = router;
