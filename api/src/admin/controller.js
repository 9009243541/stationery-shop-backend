const adminService = require("./service");
const adminController = {};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
adminController.create = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let existingadmin = await adminService.isAlredyExist(email);
    if (existingadmin) {
      return res
        .status(400)
        .send({ message: "admin with this email already exists" });
    }
    const admin = await adminService.create({
      name,
      mobile,
      email,
      password: hashedPassword,
      role: "admin",
    });
    if (!admin) {
      return res
        .status(400)
        .send({ status: false, message: "Failed to create admin" });
    } else {
      return res.status(201).send({
        status: true,
        message: " Admin created successfully",
        data: admin,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};
adminController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "Email and password are required" });
    }

    const admin = await adminService.findByEmail(email);
    if (!admin) {
      return res
        .status(404)
        .send({ status: false, message: "Admin not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .send({ status: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).send({
      status: true,
      message: "Admin logged in successfully",
      data: admin,
      token,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

module.exports = adminController;
