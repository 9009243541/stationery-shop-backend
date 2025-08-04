const categoryService = require("./service");
const CategoryModel = require("./model");
const categoryController = {};
categoryController.createCategory = async (req, res) => {
  try {
    const { categoryname } = req?.body;
    const check = await categoryService.getExistCategory(categoryname);
    if (check && !check.isDeleted) {
      return res.send({
        status: "Error",
        message: "Category already exists",
        data: null,
      });
    } else {
      const categorydata = await categoryService.createCategory({
        categoryname,
      });
      return res.send({
        status: "OK",
        message: "Category created successfully ",
        data: categorydata,
      });
    }
  } catch (error) {
    return res.send({
      status: "Error",
      message: "Something went wrong",
      data: null,
    });
  }
};

categoryController.getAllCategory = async (req, res) => {
  try {
    const page = parseInt(req?.query.page) || 1;
    const limit = 10;
    const totalCategories = await CategoryModel.countDocuments();
    const totalpages = Math.ceil(totalCategories / limit);
    const nextPage = page < totalpages ? page + 1 : null;
    // const Category = await CategoryModel.find()
    //   .skip((page - 1) * limit)
    //   .limit(limit);
    const categories = await categoryService.getAllCategory(page, limit);
    if (!categories.length) {
      return res.send({
        status: "Error",
        message: "No data found",
        data: null,
      });
    } else {
      return res.send({
        length: categories.length,
        status: "OK",
        message: "Categories retrieved sucessfully",
        data: categories,
        page,
        nextPage,
        totalpages,
        totalCategories,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      status: "Error",
      message: "Something went wrong",
      data: null,
    });
  }
};
categoryController.getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const getSingleData = await categoryService.getSingleCategory(id);
    if (!getSingleData) {
      return res.send({
        status: "Error",
        message: "No data found",
        data: null,
      });
    } else {
      return res.send({
        status: "OK",
        message: "Category retrived sucessfully",
        data: getSingleData,
      });
    }
  } catch (error) {
    return res.send({
      status: "Error",
      message: "Something went wrong",
      data: null,
    });
  }
};
categoryController.updatecategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryname } = req.body;

    // Convert categoryname to uppercase before checking for existence
    const upperCaseCategoryName =
      categoryname.charAt(0).toUpperCase() + categoryname.slice(1);

    const check = await categoryService.getExistCategory(upperCaseCategoryName);
    if (check && !check.isDeleted) {
      return res.send({
        status: "Error",
        message: "Category already exists",
        data: null,
      });
    } else {
      // Update the category with the uppercase name
      const updateData = await categoryService.getSingleCategory(
        { _id: id },
        { categoryname: upperCaseCategoryName }, // Update with uppercase name
        { new: true }
      );

      if (!updateData) {
        return res.send({
          status: "Error",
          message: "Category not found",
          data: null,
        });
      } else {
        return res.send({
          status: "Ok",
          message: "Category data updated successfully",
          data: updateData,
        });
      }
    }
  } catch (error) {
    console.log(error); // Log the error for debugging
    return res.send({
      status: "Error",
      message: "Something went wrong",
      data: null,
    });
  }
};

categoryController.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryDataDelete = await categoryService.deleteCategory(id, {
      $set: { isDeleted: true },
    });
    if (!categoryDataDelete) {
      return res.send({
        status: "Erorr",
        message: "Category not found",
        data: null,
      });
    }
    return res.send({
      status: "Ok",
      message: "Category delete successfully",
      // data: categoryDataDelete,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: "Error",
      message: "Something went wrong",
      data: null,
    });
  }
};
module.exports = categoryController;
