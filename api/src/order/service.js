// const OrderModel = require("./model");

// const orderService = {};

// orderService.placeOrder = async (orderData) => {
//   return await OrderModel.create(orderData);
// };

// orderService.getOrdersByUserId = async (userId) => {
//   return await OrderModel.find({ userId }).populate("products.productId", "productName image price") .sort({ createdAt: -1 }); // latest order first
// };
// orderService.getSingleOrderById=async () => {
//   return await OrderModel.findOne()
// }
// module.exports = orderService;
const OrderModel = require("./model");
const Product = require("../products/model"); // make sure path correct ho

const orderService = {};

// Place Order with product details and total amount
orderService.placeOrder = async (orderData) => {
  const { products, ...rest } = orderData;

  // Populate product details
  const populatedProducts = await Promise.all(
    products.map(async (p) => {
      const product = await Product.findById(p.productId);
      if (!product) throw new Error("Product not found");
      const price = product.mrp - (product.mrp * product.discount) / 100;
      return {
        productId: product._id,
        name: product.productName,
        price,
        quantity: p.quantity,
        total: parseFloat((price * p.quantity).toFixed(2)),
      };
    })
  );

  // Calculate total amount
  const totalAmount = populatedProducts.reduce((sum, p) => sum + p.total, 0);

  // Create order
  const order = await OrderModel.create({
    ...rest,
    items: populatedProducts,
    totalAmount,
  });

  return order;
};

// Get all orders of a user
orderService.getOrdersByUserId = async (userId) => {
  return await OrderModel.find({ userId })
    .populate("items.productId", "productName image price")
    .sort({ createdAt: -1 }); // latest first
};

// Get single order by ID
orderService.getSingleOrderById = async (orderId) => {
  return await OrderModel.findOne({ _id: orderId })
    .populate("items.productId", "productName image price");
};

module.exports = orderService;
