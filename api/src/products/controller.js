const productService = require("./service");
const categoryService = require("../category/service");

const productController = {};

// Add Product
productController.addProduct = async (req, res) => {
  try {
    const {
      productTitle,
      productName,
      category,
      brand,
      mrp,
      discount,
      availability,
      description,
      rating,
      review,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const categoryData = await categoryService.getCategoryById(category);
    const categoryName = categoryData.categoryname;

    const productData = await productService.addProduct({
      image,
      productTitle,
      productName,
      category,
      brand,
      mrp,
      discount,
      availability,
      description,
      rating,
      review,
    });

    const responseData = {
      ...productData.toObject(),
      category: {
        _id: category,
        categoryname: categoryName,
      },
    };

    return res.send({
      status: "OK",
      message: "Product added successfully",
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.send({
      status: "Error",
      message: "Something went wrong",
      data: null,
    });
  }
};

// Get Products
productController.getproduct = async (req, res) => {
  try {
    const {
      productName,
      categoryId,
      categoryName,
      brand,
      mrp,
      discount,
      availability,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = -1,
    } = req.query;

    const filters = {};

    if (productName) filters.productName = productName;
    if (categoryId) filters.categoryId = categoryId;
    if (categoryName) filters.categoryName = categoryName;
    if (brand) filters.brand = brand;
    if (mrp) filters.mrp = parseFloat(mrp);
    if (discount) filters.discount = parseFloat(discount);
    if (availability !== undefined) filters.availability = availability === "true";

    const { products, total, pages } = await productService.getProduct(
      filters,
      parseInt(page, 10),
      parseInt(limit, 10),
      sortBy,
      parseInt(order, 10)
    );

    const formattedProducts = products.map((product) => {
      const obj = product.toObject();
      obj.createdAt = convertDateTime(product.createdAt);
      obj.updatedAt = convertDateTime(product.updatedAt);
      return obj;
    });

    return res.send({
      status: "OK",
      message: "Product details retrieved successfully",
      length: formattedProducts.length,
      data: formattedProducts,
      pagination: { total, page: parseInt(page, 10), pages },
    });
  } catch (error) {
    console.error(error);
    return res.send({
      status: "Error",
      message: "Something went wrong",
      data: null,
    });
  }
};

// Get Single Product by ID
productController.getSingleProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const getSingleProductData = await productService.getSingleProductById(
      productId
    );

    if (!getSingleProductData) {
      return res.send({
        status: "Error",
        message: "Product not found",
        data: null,
      });
    }

    const formattedProductData = {
      ...getSingleProductData.toObject(),
      category: getSingleProductData.category.categoryname,
    };

    return res.send({
      status: "OK",
      message: "Product retrieved successfully",
      data: formattedProductData,
    });
  } catch (error) {
    console.error(error);
    return res.send({
      status: "Error",
      message: "Something went wrong",
      data: null,
    });
  }
};

// Update Product
productController.updateProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      productTitle,
      productName,
      category,
      brand,
      mrp,
      discount,
      availability,
      description,
      rating,
      review,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    // const updateData = {
    //   productTitle,
    //   productName,
    //   category,
    //   brand,
    //   mrp,
    //   discount,
    //   availability,
    //   description,
    //   rating,
    //   review,
    // };

    // if (image) updateData.image = image;
    const updateData = {};

    if (productTitle !== undefined) updateData.productTitle = productTitle;
    if (productName !== undefined) updateData.productName = productName;
    if (category !== undefined) updateData.category = category;
    if (brand !== undefined) updateData.brand = brand;
    if (mrp !== undefined) updateData.mrp = mrp;
    if (discount !== undefined) updateData.discount = discount;
    if (availability !== undefined) updateData.availability = availability;
    if (description !== undefined) updateData.description = description;
    if (rating !== undefined) updateData.rating = rating;
    if (review !== undefined) updateData.review = review;
    if (image !== null) updateData.image = image; // only if image is uploaded

    const updatedProduct = await productService.updateProductDetails(
      productId,
      updateData
    );

    if (!updatedProduct) {
      return res.send({
        status: "Error",
        message: "Product not found",
        data: null,
      });
    }

    return res.send({
      status: "OK",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.send({
      status: "Error",
      message: "Something went wrong",
      data: null,
    });
  }
};

// Delete Product
productController.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await productService.deleteProduct(productId);

    if (!deletedProduct) {
      return res.send({
        status: "Error",
        message: "Product not found",
      });
    }

    return res.send({
      status: "OK",
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.send({
      status: "Error",
      message: "Something went wrong",
    });
  }
};

// Helper: Format Date & Time
const convertDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day}-${month}-${year} ${String(hours).padStart(
    2,
    "0"
  )}:${minutes}:${seconds}${ampm}`;
};

module.exports = productController;
