const OrderModel = require("./model");

const orderService = {};

orderService.placeOrder = async (orderData) => {
  return await OrderModel.create(orderData);
};

module.exports = orderService;
