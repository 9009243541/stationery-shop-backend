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

    if (filters.productName) {
      query.productName = new RegExp(filters.productName, "i");
    }

    if (filters.brand) {
      query.brand = new RegExp(filters.brand, "i");
    }

    if (filters.categoryId) {
      query.category = filters.categoryId; // direct ObjectId match
    }

    if (filters.mrp !== undefined) {
      query.mrp = filters.mrp;
    }

    if (filters.discount !== undefined) {
      query.discount = filters.discount;
    }

    if (filters.availability !== undefined) {
      query.availability = filters.availability;
    }

    const skip = (page - 1) * limit;

    let productsQuery = Product.find(query)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .populate("category", "categoryname");

    let products = await productsQuery;

    // Category name filter (after populate)
    if (filters.categoryName) {
      products = products.filter((p) =>
        p.category?.categoryname?.toLowerCase().includes(filters.categoryName.toLowerCase())
      );
    }

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
