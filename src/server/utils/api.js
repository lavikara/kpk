const axios = require("axios");

const PAYMENT_URL = process.env.FLUTTERWAVE_PAYMENT_URL;
const VERIFY_URL = process.env.FLUTTERWAVE_VERIFY_URL;
const BANK_LIST = process.env.FLUTTERWAVE_BANK_LIST;
const SUB_ACCOUNT = process.env.FLUTTERWAVE_SUB_ACCOUNT;
const VERIFY_ACCOUNT_NUMBER = process.env.FLUTTERWAVE_VERIFY_ACCOUNT_NUMBER;

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
  verifyPayment(data) {
    return axios.get(`${VERIFY_URL}/${data}/verify`, {
      headers: this.getHeader(),
    });
  },
  getBankList(data) {
    return axios.get(`${BANK_LIST}/${data}`, {
      headers: this.getHeader(),
    });
  },
  verifyAccountNumber() {
    return axios.get(`${VERIFY_ACCOUNT_NUMBER}`, {
      headers: this.getHeader(),
    });
  },
  createSubAccount(data) {
    return axios.post(`${SUB_ACCOUNT}`, data, {
      headers: this.getHeader(),
    });
  },
};
