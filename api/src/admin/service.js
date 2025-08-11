const AdminModel = require("./model");
const adminService = {};
adminService.create = async ({ name, mobile, email, password, role }) => {
  return await AdminModel.create({
    name,
    mobile,
    email,
    password,
    role,
  });
};
adminService.isAlredyExist = async (email) => {
  return await AdminModel.findOne({ email, isDeleted: false });
};
adminService.findByEmail = async (email) => {
  return await AdminModel.findOne({ email, isDeleted: false });
};

module.exports = adminService;
