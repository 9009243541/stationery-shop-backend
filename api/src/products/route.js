const productController = require("./controller");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authToken");
const { productSchema ,updateProductSchema} = require("./productValidation");
const router = require("express").Router();
const upload = require("../middleware/upload");

router.post(
  "/add-product",
  authenticate(["admin"]),
  validate(productSchema),
  upload.single("image"),
  productController.addProduct
);

router.put(
  "/update-product/:productId",
  authenticate(["admin"]),
  validate(updateProductSchema),
  upload.single("image"),
  productController.updateProductDetails
);
router.get("/getproducts", productController.getproduct);
router.get(
  "/get-single-product/:productId",
  authenticate(["admin"]),
  productController.getSingleProductById
);

router.delete(
  "/delete-product/:productId",
  authenticate(["admin"]),
  productController.deleteProduct
);
module.exports = router;
