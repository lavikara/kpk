const usermodel = require("../../db/models/userModel.js");
const cartmodel = require("../../db/models/cartModel.js");
const payment = require("../controllers/payment.js");
const api = require("../utils/api.js");
const { verify } = require("jsonwebtoken");

exports.flutter_hook = () => {
  return async (req, res, next) => {
    try {
      var hash = req.headers["verif-hash"];
      if (!hash) {
        return;
      }
      const secret_hash = process.env.HOOK_HASH;

      if (hash !== secret_hash) {
        return;
      }
      const userId = req.body.txRef.slice(10);
      const transId = req.body.id;
      let bulkData;
      res.status(200).send();
      const verified = await api
        .verifyPayment(transId)
        .then(({ data }) => {
          return {
            txRef: data.data.tx_ref,
            amount: data.data.amount,
            currency: data.data.currency,
            status: data.data.status,
            meta: data.data.meta.type,
          };
        })
        .catch((error) => {
          console.log(error);
        });
      switch (verified.meta) {
        case "vendor registration":
          if (
            verified.txRef == req.body.txRef &&
            verified.amount >= 20 &&
            verified.currency == "USD" &&
            verified.status == "successful"
          ) {
            await usermodel.findOneAndUpdate(
              { _id: userId },
              { is_registered: true }
            );
          }
          break;
        case "customer payment":
          const cart = await cartmodel.findById(userId);
          const vendorData = cart.items.map((item) => {
            return {
              bank_code: "044",
              account_numberr: "0690000032",
              amount: item.sub_total,
              currency: "USD",
              narration: `Payment for ${item.name}`,
              reference: item.vendor_id,
            };
          });
          const dispatchData = cart.items.map((item) => {
            return {
              bank_code: "044",
              account_numberr: "0690000032",
              amount: item.dispatch_price,
              currency: "USD",
              narration: `delivery of ${item.name}`,
              reference: item.vendor_id,
            };
          });
          bulkData = vendorData.concat(dispatchData);
          if (
            verified.txRef == req.body.txRef &&
            verified.amount >= cart.total_price + cart.dispatch &&
            verified.currency == "USD" &&
            verified.status == "successful"
          ) {
            await cartmodel.findOneAndUpdate(
              { _id: userId },
              { items: [], total_price: 0, total_quantity: 0, dispatch: 0 },
              { new: true }
            );
          }
          break;

        default:
          break;
      }
      if (verified.meta == "customer payment") {
        // payment.bulk_transfer(bulkData);
        console.log(api.bulkTransfer());
        //  await api
        //     .bulkTransfer(bulkData)
        //     .then(({ data }) => {
        //       console.log(data);
        //       return;
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });
      }
    } catch (err) {
      console.log(err);

      res.status(500).send({
        status: "error",
        message: "an error occured while making payment",
      });
    }
  };
};
