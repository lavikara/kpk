const express = require("express");
const router = express.Router();
const user = require("../controllers/user.js");
const validator = require("../middlewares/validators/validate.js");
const joischema = require("../middlewares/validators/user.js");
const { authorization } = require("../middlewares/authorization.js");

router.post("/login", validator(joischema.login), user.login_user());
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
router.post(
  "/signup-rider",
  validator(joischema.riderSignup),
  user.signup_user()
);
router.get("/get-all-riders", user.get_all_riders());
router.post("/assign-rider", authorization(), user.assign_riders());

module.exports = router;
