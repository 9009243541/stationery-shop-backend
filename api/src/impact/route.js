const route = require("express").Router();
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");
const impactValidationSchema = require("./impact-validation");
const impactController = require("./controller");

route.post(
  "/add",
  upload.single("document"),
  validate(impactValidationSchema),
  impactController.create
);

route.get("/get-all", impactController.getAll);
route.get("/get-single-impact-report/:id", impactController.getById);
route.delete("/delete-report/:id", impactController.delete);

module.exports = route;
