const express = require("express");
const router = express.Router();
const history = require("../controllers/history.js");
const validator = require("../middlewares/validators/validate.js");
const joischema = require("../middlewares/validators/cart.js");
const { authorization } = require("../middlewares/authorization.js");

router.get(
  "/customer-history",
  authorization(),
  history.get_customer_history()
);

module.exports = router;
