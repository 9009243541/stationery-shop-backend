const userService = require("./service");
const userController = {};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
userController.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, age, email, mobile, address, password } =
      req.body;
    const image = req.file ? req.file.filename : null;
    const isAlreadyExist = await userService.isExist(email);
    if (isAlreadyExist) {
      return res.status(400).send({
        status: false,
        message: "User already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userService.createUser({
      firstName,
      lastName,
      age,
      email,
      mobile,
      address,
      password: hashPassword,
      image,
    });
    return res.status(201).send({
      status: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};
userController.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findByemail(email);
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        status: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "2d",
    });
    user.password = undefined;
    user.__v = undefined;
    return res.status(200).send({
      status: true,
      message: "Login successfully",
      data: user,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};
userController.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getSingle(userId);
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return res.status(200).send({
      status: true,
      message: "User found successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};
// userController.update = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { firstName, lastName, age, email, mobile, address, password } =
//       req.body;
//     const isAlredayExist = await userService.isExist(email, {
//       _id: { $ne: userId },
//     });
//     if (isAlredayExist && isAlredayExist.email !== email) {
//       return res.status(400).send({ message: "Mobile number already exist" });
//     }

//     const user = await userService.update(
//       { _id: userId },
//       {
//         firstName,
//         lastName,
//         age,
//         email,
//         mobile,
//         address,
//         password,
//       }
//     );
//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }
//     return res.status(200).send({
//       status: true,
//       message: "User updated successfully",
//       data: user,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       status: false,
//       message: "Internal Server Error",
//     });
//   }
// };

userController.update = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, age, email, mobile, address, password } =
      req.body;

    const image = req.file ? req.file.filename : null;

    const isAlredayExist = await userService.isExist(email, {
      _id: { $ne: userId },
    });

    // Check if the email already exists for another user
    if (isAlredayExist) {
      return res.status(400).send({ message: "This Email is already exist" });
    }
    const updatePayload = {
      firstName,
      lastName,
      age,
      email,
      mobile,
      address,
    };

    // Optional fields
    if (password) updatePayload.password = password;
    if (image) updatePayload.image = image;

    const user = await userService.update({ _id: userId }, updatePayload);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send({
      status: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

userController.getAll = async (req, res) => {
  try {
    const { fullname, mobile } = req?.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filters = {};
    if (fullname) filters.fullname = fullname;
    if (mobile) filters.mobile = mobile;
    // const totalUsers = await userService.getTotalUsers(filters);
    const users = await userService.getAll(filters, skip, limit);
    if (!users) {
      return res.status(404).send({ message: "No users found" });
    }
    return res.status(200).send({
      length: users.length,
      status: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = userController;
