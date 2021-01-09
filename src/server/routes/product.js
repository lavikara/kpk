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

router.get("/get-all-product", product.get_all_product());

router.get("/id", validator(joischema.productId), product.get_product_by_id());

module.exports = router;
