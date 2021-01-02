const mongoose = require("mongoose");
const env = require("../server/config/env.js");

const db = async () => {
  try {
    const connect = await mongoose.connect(env.config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`🍃  connected to mongodb: ${connect.connection.host} 🍃`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = db;
