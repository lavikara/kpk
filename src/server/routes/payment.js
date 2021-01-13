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
router.post(
  "/bank-list",
  // validator(joischema.createProduct),
  payment.get_bank_list()
);
router.post(
  "/rider-sub-account",
  authorization(),
  // validator(joischema.createProduct),
  payment.create_rider_sub_account()
);
router.post(
  "/vendor-sub-account",
  authorization(),
  // validator(joischema.createProduct),
  payment.create_vendor_sub_account()
);

module.exports = router;
