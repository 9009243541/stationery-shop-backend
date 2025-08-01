const productService = {};
const Product = require("./model");

// Add Product
productService.addProduct = async (productData) => {
  return await Product.create(productData);
};

// Get All Products with Filters
productService.getProduct = async (
  filters,
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = -1
) => {
  try {
    const query = { isDeleted: false };

    if (filters.productName)
      query.productName = new RegExp(filters.productName, "i");

    if (filters.category) query.category = filters.category;

    if (filters.brand) query.brand = new RegExp(filters.brand, "i");

    if (filters.unit) query.unit = filters.unit;

    if (filters.hsn) query.hsn = filters.hsn;

    if (filters.isFeatured !== undefined)
      query.isFeatured = filters.isFeatured;

    if (filters.mrp) query.mrp = filters.mrp;

    if (filters.rate) query.rate = filters.rate;

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .populate("category", "categoryname");

    const totalProducts = await Product.countDocuments(query);

    return {
      products,
      total: totalProducts,
      page,
      pages: Math.ceil(totalProducts / limit),
    };
  } catch (error) {
    console.error("Product Fetch Error:", error);
    throw new Error("Error fetching products");
  }
};

// Get Single Product by ID
productService.getSingleProductById = async (productId) => {
  return await Product.findOne({
    _id: productId,
    isDeleted: false,
  }).populate("category", "categoryname");
};

// Update Product Details
productService.updateProductDetails = async (id, updateData) => {
  return await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { new: true }
  ).populate("category", "categoryname");
};

// Soft Delete Product
productService.deleteProduct = async (productId) => {
  return await Product.findOneAndUpdate(
    { _id: productId },
    { isDeleted: true },
    { new: true }
  );
};

module.exports = productService;
