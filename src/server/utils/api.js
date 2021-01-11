const axios = require("axios");

const PAYMENT_URL = process.env.FLUTTERWAVE_PAYMENT_URL;

module.exports = {
  getHeader() {
    let header = {
      Authorization: "Bearer " + process.env.FLUTTERWAVE_SECRET_KEY,
    };
    return header;
  },
  payWithFlutter(data) {
    return axios.post(`${PAYMENT_URL}`, data, {
      headers: this.getHeader(),
    });
  },
};
