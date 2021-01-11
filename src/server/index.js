const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const env = require("./config/env.js");
const cors = require("cors");
const connectDB = require("../db/connection.js");
const logger = require("./middlewares/logger.js");
const bodyparser = require("body-parser");

const app = express();

const userRouter = require("./routes/user.js");
const productRouter = require("./routes/product.js");
const cartRouter = require("./routes/cart.js");
const paymentRouter = require("./routes/payment.js");
const hookRouter = require("./routes/hook.js");

connectDB();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(logger);
app.use(cors());

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/payment", paymentRouter);
app.use("/hook", hookRouter);

app.listen(env.config.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(` 🛒 KPK 🛒  I'm alive on ${env.config.PORT} 🗼 🗼 `);
  }
});
