const route = require("express").Router();
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");
const galleryController = require("./controller");
// const galleryValidationSchema = require("../validations/gallery-validation");

route.post(
  "/add",
  upload.single("image"),
//   validate(galleryValidationSchema),
  galleryController.create
);

route.get("/get-all", galleryController.getAll);
route.get("/get-single-image/:id", galleryController.getById);
route.delete("/delete-image/:id", galleryController.delete);

module.exports = route;
