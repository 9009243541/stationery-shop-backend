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

/////2nd logi abhi yhi chaloo he

// const OrderModel = require("./model");
// const Product = require("../products/model"); // make sure path correct ho

// const orderService = {};

// // Place Order with product details and total amount
// orderService.placeOrder = async (orderData) => {
//   const { products, ...rest } = orderData;

//   // Populate product details
//   const populatedProducts = await Promise.all(
//     products.map(async (p) => {
//       const product = await Product.findById(p.productId);
//       if (!product) throw new Error("Product not found");
//       const price = product.mrp - (product.mrp * product.discount) / 100;
//       return {
//         productId: product._id,
//         name: product.productName,
//         price,
//         quantity: p.quantity,
//         total: parseFloat((price * p.quantity).toFixed(2)),
//       };
//     })
//   );

//   // Calculate total amount
//   const totalAmount = populatedProducts.reduce((sum, p) => sum + p.total, 0);

//   // Create order
//   const order = await OrderModel.create({
//     ...rest,
//     items: populatedProducts,
//     totalAmount,
//   });

//   return order;
// };

// // Get all orders of a user
// orderService.getOrdersByUserId = async (userId) => {
//   return await OrderModel.find({ userId })
//     .populate("products.productId", "productName image price")
//     .sort({ createdAt: -1 }); // latest first
// };

// // Get single order by ID
// orderService.getSingleOrderById = async (orderId) => {
//   return await OrderModel.findOne({ _id: orderId })
//     .populate("items.productId", "productName image price");
// };

// module.exports = orderService;

//////////////////////3rd logic latest abhi chaloo he
// const OrderModel = require("./model");

// const orderService = {};

// // Place Order
// orderService.placeOrder = async (orderData) => {
//   const { products, ...rest } = orderData;

//   // Calculate total amount from snapshot products
//   const totalAmount = products.reduce((sum, p) => sum + p.total, 0);

//   // Create order
//   const order = await OrderModel.create({
//     ...rest,
//     products,      // ✅ snapshot with { productId, name, price, quantity, total }
//     totalAmount,   // ✅ stored separately
//   });

//   return order;
// };

// // Get all orders of a user
// orderService.getOrdersByUserId = async (userId) => {
//   return await OrderModel.find({ userId })
//     .populate("products.productId", "productName image finalPrice") // ✅ correct path
//     .sort({ createdAt: -1 });
// };

// // Get single order by ID
// orderService.getSingleOrderById = async (orderId) => {
//   return await OrderModel.findOne({ _id: orderId }).populate(
//     "products.productId",
//     "productName image finalPrice"
//   );
// };

// module.exports = orderService;




//////////////////////////////
const OrderModel = require("./model");

const orderService = {};

orderService.placeOrder = async (orderData) => {
  const { products, ...rest } = orderData;

  // Calculate total amount from snapshot products
  const totalAmount = products.reduce((sum, p) => sum + p.total, 0);

  // Create order
  const order = await OrderModel.create({
    ...rest,
    products,
    totalAmount,
  });

  return order;
};

orderService.getOrdersByUserId = async (userId) => {
  return await OrderModel.find({ userId })
    .populate({
      path: "products.productId",
      select: "productName image mrp discount",
      options: { toJSON: { virtuals: true }, toObject: { virtuals: true } }, // Include virtuals
    })
    .sort({ createdAt: -1 });
};

orderService.getSingleOrderById = async (orderId) => {
  return await OrderModel.findOne({ _id: orderId }).populate({
    path: "products.productId",
    select: "productName image mrp discount",
    options: { toJSON: { virtuals: true }, toObject: { virtuals: true } }, // Include virtuals
  });
};

module.exports = orderService;