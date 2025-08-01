const categoryController = require("./controller");
const validate = require("../middleware/validate");
const categorySchema = require("./categoryValidation");
const router = require("express").Router();
// const middleWare=require('../../middleWare/authToken')
router.post(
  "/addcategory",
  //   middleWare,
  validate(categorySchema),
  categoryController.createCategory
);
router.get(
  "/getAllCategory",
  // middleWare,
  categoryController.getAllCategory
);
router.get(
  "/getSingleCategory/:id",
  // middleWare,
  categoryController.getSingleCategory
);
router.put(
  "/editCategory/:id",
  //   middleWare,
  validate(categorySchema),
  categoryController.updatecategory
);
router.delete(
  "/deleteCategory/:id",
  // middleWare,
  categoryController.deleteCategory
);
module.exports = router;
