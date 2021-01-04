const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const cartmodel = require("../../db/models/cartModel.js");
const { get_single_product } = require("../controllers/product.js");

exports.create_cart = async (id) => {
  try {
    await cartmodel.create({
      _id: id,
      items: [],
      total_price: 0,
      total_quantity: 0,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_cart = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokendata = jwt.verify(token, env.config.JWT_SECRET);
      const cart = await cartmodel.findById(tokendata.id);
      if (!cart) {
        return res.status(404).send({
          status: "error",
          message: "cart not found",
        });
      }

      res.status(200).send({
        status: "success",
        data: { cart: cart },
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while getting customer cart",
      });
    }
  };
};

exports.add_to_cart = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokendata = jwt.verify(token, env.config.JWT_SECRET);
      const cart = await cartmodel.findById(tokendata.id);
      const product = await get_single_product(req.body.product_id);
      if (!cart || !product) {
        return res.status(404).send({
          status: "error",
          message: "cart or product not found",
        });
      }
      let item = cart.items.find((product) => {
        return product.id == req.body.product_id;
      });
      if (item) {
        item.quantity++;
        item.sub_total = item.price * item.quantity;
        item.stock.quantity_available--;
      } else {
        const productobj = product.toJSON();
        productobj["_id"] = productobj["id"];
        delete productobj._id;
        productobj.quantity = 1;
        productobj.sub_total = productobj.price;
        productobj.stock.quantity_available--;
        cart.items.push(productobj);
      }
      let initialValue = 0;
      cart.total_price = cart.items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.sub_total,
        initialValue
      );
      cart.total_quantity = cart.items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.quantity,
        initialValue
      );

      const updatedCart = await cartmodel.findOneAndUpdate(
        { _id: tokendata.id },
        cart,
        { new: true }
      );
      res.status(200).send({
        status: "success",
        data: { cart: updatedCart },
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while adding product to cart",
      });
    }
  };
};

exports.remove_from_cart = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokendata = jwt.verify(token, env.config.JWT_SECRET);
      const cart = await cartmodel.findById(tokendata.id);
      const product = await get_single_product(req.body.product_id);
      if (!cart || !product) {
        return res.status(404).send({
          status: "error",
          message: "cart or product not found",
        });
      }
      let item = cart.items.find((product) => {
        return product.id == req.body.product_id;
      });
      if (item.quantity === 1) {
        cart.items.map((product, index) => {
          if (product.id == req.body.product_id) {
            product.stock.quantity_available++;
            cart.items.splice(index, 1);
          }
        });
      } else {
        item.stock.quantity_available++;
        item.quantity--;
        item.sub_total = item.price * item.quantity;
      }
      let initialValue = 0;
      cart.total_price = cart.items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.sub_total,
        initialValue
      );
      cart.total_quantity = cart.items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.quantity,
        initialValue
      );

      const updatedCart = await cartmodel.findOneAndUpdate(
        { _id: tokendata.id },
        cart,
        { new: true }
      );
      res.status(200).send({
        status: "success",
        data: { cart: updatedCart },
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while adding product to cart",
      });
    }
  };
};
