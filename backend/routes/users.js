var express = require("express");
const {
  createUserController,
  loginHandleController,
  getProfileController,
  updateProfileController,
  updateProfilePhotoController,
  getPublicProfileController,
  submitVerificationController,
} = require("../controller/userController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const {
  uploadProfile,
  uploadVerification,
} = require("../middleware/uploadMiddleware");

var router = express.Router();

router.get("/", (req, res) =>
  res.json({ message: "User Controller is working" }),
);

router.post("/create", createUserController);
router.post("/login", loginHandleController);
router.get("/:id/public", getPublicProfileController);

router.get("/profile", validateTokenMiddleware, getProfileController);
router.put("/profile", validateTokenMiddleware, updateProfileController);
router.put(
  "/profile/photo",
  validateTokenMiddleware,
  uploadProfile.single("profilePhoto"),
  updateProfilePhotoController,
);

router.post(
  "/verify/submit",
  validateTokenMiddleware,
  uploadVerification.array("documents", 5),
  submitVerificationController,
);

module.exports = router;
