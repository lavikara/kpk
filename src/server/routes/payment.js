const express = require("express");
const router = express.Router();
const payment = require("../controllers/payment.js");
const { authorization } = require("../middlewares/authorization.js");

router.post("/generate", authorization(), payment.pay_with_flutter());
router.get("/verify", authorization(), payment.verify_payment());
router.post("/bank-list", payment.get_bank_list());
router.post(
  "/rider-sub-account",
  authorization(),
  payment.create_rider_sub_account()
);
router.post(
  "/vendor-sub-account",
  authorization(),
  payment.create_vendor_sub_account()
);

module.exports = router;
