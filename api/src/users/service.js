const UserModel = require("./model");

const userService = {};

userService.createUser = async ({
  firstName,
  lastName,
  age,
  email,
  mobile,
  address,
  password,
  image,
}) => {
  return await UserModel.create({
    firstName,
    lastName,
    age,
    email,
    mobile,
    address,
    password,
    image,
  });
};
// userService.isExist = async (email) => {
//   return await UserModel.findOne({ email, isDeleted: false });
// };
userService.isExist = async (email, extraFilter = {}) => {
  return await UserModel.findOne({
    email,
    isDeleted: false,
    ...extraFilter,
  });
};

userService.findByemail = async (email) => {
  return await UserModel.findOne({ email, isDeleted: false });
};

userService.getSingle = async (userId) => {
  return await UserModel.findOne({
    _id: userId,
    isDeleted: { $ne: true },
  });
};
userService.getAll = async (filters, skip, limit) => {
  const query = { isDeleted: { $ne: true } };
  if (filters.fullname) {
    query.fullname = new RegExp(filters.fullname, "i");
  }
  if (filters.mobile) {
    query.mobile = new RegExp(filters.mobile, "i");
  }
  return await UserModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// userService.update = async (
//   { _id: userId },
//   { firstName, lastName, age, email, mobile, address, password, image }
// ) => {
//   return await UserModel.findOneAndUpdate(
//     { _id: userId, isDeleted: false },
//     { firstName, lastName, age, email, mobile, address, password, image },
//     { new: true }
//   );
// };

userService.update = async ({ _id: userId }, updateData) => {
  return await UserModel.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    updateData,
    { new: true }
  );
};

module.exports = userService;
