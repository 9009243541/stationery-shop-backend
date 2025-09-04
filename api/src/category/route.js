const categoryController = require("./controller");
const validate = require("../middleware/validate");
const categorySchema = require("./categoryValidation");
const router = require("express").Router();
const authenticate = require("../middleware/authToken");
router.post(
  "/addcategory",
  authenticate(["admin"]),
  validate(categorySchema),
  categoryController.createCategory
);
router.get(
  "/getAllCategory",
  // authenticate(["admin"]),
  categoryController.getAllCategory
);
router.get(
  "/getSingleCategory/:id",
  authenticate(["admin"]),

  categoryController.getSingleCategory
);
router.put(
  "/editCategory/:id",
  authenticate(["admin"]),

  validate(categorySchema),
  categoryController.updatecategory
);
router.delete(
  "/deleteCategory/:id",
  authenticate(["admin"]),

  categoryController.deleteCategory
);
module.exports = router;
