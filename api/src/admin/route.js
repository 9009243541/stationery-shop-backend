const route = require("express").Router();
const validate = require("../middleware/validate");
const upload = require("../middleware/upload");
const adminController = require("./controller");
const adminValidationSchema = require("./admin-validation");
const adminLoginValidationSchema = require("./admin-login-validation");
route.post(
  "/create-admin",
  validate(adminValidationSchema),
  adminController.create
);
route.post(
  "/login-admin",
  validate(adminLoginValidationSchema),
  adminController.login
);
module.exports = route;
