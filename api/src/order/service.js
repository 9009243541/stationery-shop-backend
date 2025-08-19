const OrderModel = require("./model");

const orderService = {};

orderService.placeOrder = async (orderData) => {
  return await OrderModel.create(orderData);
};

orderService.getOrdersByUserId = async (userId) => {
  return await OrderModel.find({ userId }).populate("products.productId", "productName image price") .sort({ createdAt: -1 }); // latest order first
};
orderService.getSingleOrderById=async () => {
  return await OrderModel.findOne()
}
module.exports = orderService;
