const Category = require("./model");

const categoryService = {};

categoryService.createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};
categoryService.getAllCategory = async (page, limit) => {
  return await Category.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};
categoryService.getSingleCategory = async (id, updateData) => {
  return await Category.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    updateData,
    {
      new: true,
    }
  );
};
categoryService.getCategoryById = async (id) => {
  const store = await Category.findById(id);
  return store;
};

categoryService.getExistCategory = async (categoryName) => {
  return await Category.findOne({
    categoryname: { $regex: new RegExp(`^${categoryName}$`, "i") },
    isDeleted: { $ne: true },
  });
};
categoryService.deleteCategory = async (id, updateFeild) => {
  return await Category.findByIdAndUpdate(
    { _id: id },
    { ...updateFeild },
    { new: true }
  );
};
// categoryService.getExistCategory = async (categoryName) => {
//   return await Category.findOne({ categoryname: categoryName });
// };
module.exports = categoryService;
