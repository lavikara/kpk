const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const cartmodel = require("../../db/models/cartModel.js");
const { get_single_product } = require("../controllers/product.js");
const vendor = require("../controllers/user.js");

exports.create_cart = async (id) => {
  try {
    await cartmodel.create({
      _id: id,
      items: [],
      total_price: 0,
      total_quantity: 0,
      dispatch: 0,
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

exports.checkout = () => {
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
      const updatedCart = await cartmodel.findOneAndUpdate(
        { _id: tokendata.id },
        {
          items: [],
          total_price: 0,
          total_quantity: 0,
          dispatch: 0,
        },
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
      const singleVendor = await vendor.single_vendor(product.vendor_id);
      const dispatch_id =
        singleVendor.asigned_riders[0].account_details.subaccount_id;
      let item = cart.items.find((product) => {
        return product.id == req.body.product_id;
      });
      if (item) {
        item.quantity++;
        item.sub_total = item.price * item.quantity;
        item.dispatch_price += 5;
      } else {
        const productobj = product.toJSON();
        productobj["_id"] = productobj["id"];
        delete productobj._id;
        productobj.dispatch_account_id = dispatch_id;
        productobj.dispatch_price += 5;
        productobj.quantity = 1;
        productobj.sub_total = productobj.price;
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
      cart.dispatch = cart.items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.dispatch_price,
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
            cart.items.splice(index, 1);
          }
        });
      } else {
        item.quantity--;
        item.sub_total = item.price * item.quantity;
        item.dispatch_price -= 5;
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
      cart.dispatch = cart.items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.dispatch_price,
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

exports.delete_item = () => {
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
      cart.items.map((product, index) => {
        if (product.id == req.body.product_id) {
          cart.items.splice(index, 1);
        }
      });
      let initialValue = 0;
      cart.total_price = cart.items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.sub_total,
        initialValue
      );
      cart.total_quantity = cart.items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.quantity,
        initialValue
      );
      cart.dispatch = cart.items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.dispatch_price,
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
        message: "an error occured while getting customer cart",
      });
    }
  };
};
