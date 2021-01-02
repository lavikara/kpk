const express = require("express");
const router = express.Router();
const user = require("../controllers/user.js");
const validator = require("../middlewares/validators/validate.js");
const joischema = require("../middlewares/validators/user.js");

router.post(
  "/signup-customer",
  validator(joischema.customerSignup),
  user.signup_user()
);
router.post(
  "/signup-vendor",
  validator(joischema.vendorSignup),
  user.signup_user()
);
router.post("/login", validator(joischema.login), user.login_user());

module.exports = router;
