const router = require("express").Router();
const userController = require("./controller");
const authenticate = require("../middleware/authToken");
const {
  registerUserValidation,
  loginUserValidation,
} = require("./userValidatin");
const validate = require("../middleware/validate");
const upload = require("../middleware/upload");

router.post(
  "/register",
  validate(registerUserValidation),
  upload.single("image"),
  userController.registerUser
);
router.post("/login", validate(loginUserValidation), userController.loginUser);
router.get("/profile/:userId", authenticate(), userController.getUserProfile);
router.put(
  "/update-user/:userId",
  authenticate(),
  validate(registerUserValidation),
  upload.single("image"),
  userController.update
);
router.get("/get-users", userController.getAll);

module.exports = router;
