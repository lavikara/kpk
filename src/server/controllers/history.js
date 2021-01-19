const historyModal = require("../../db/models/historyModal.js");

exports.order_history = async (id) => {
  try {
    await historyModal.create({
      _id: id,
      order_history: [],
    });
  } catch (err) {
    console.log(err);
  }
};
