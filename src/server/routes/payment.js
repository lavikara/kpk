const express = require("express");
const router = express.Router();
const payment = require("../controllers/payment.js");
const validator = require("../middlewares/validators/validate.js");
const joischema = require("../middlewares/validators/product.js");
const { authorization } = require("../middlewares/authorization.js");

router.post(
  "/generate",
  authorization(),
  // validator(joischema.createProduct),
  payment.pay_with_flutter()
);
router.get(
  "/verify",
  authorization(),
  // validator(joischema.createProduct),
  payment.verify_payment()
);

module.exports = router;
