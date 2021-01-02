const express = require("express");
const router = express.Router();
const cart = require("../controllers/cart.js");
const validator = require("../middlewares/validators/validate.js");
const joischema = require("../middlewares/validators/cart.js");
const { authorization } = require("../middlewares/authorization.js");

router.get("/get-cart", authorization(), cart.get_cart());
router.post(
  "/add-to-cart",
  authorization(),
  validator(joischema.cart),
  cart.add_to_cart()
);
router.post(
  "/remove-from-cart",
  authorization(),
  validator(joischema.cart),
  cart.remove_from_cart()
);

module.exports = router;
