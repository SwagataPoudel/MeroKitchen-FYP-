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

// Public
router.post("/create", createUserController);
router.post("/login", loginHandleController);
router.get("/:id/public", getPublicProfileController);

// Protected
router.get("/profile", validateTokenMiddleware, getProfileController);
router.put("/profile", validateTokenMiddleware, updateProfileController);
router.put(
  "/profile/photo",
  validateTokenMiddleware,
  uploadProfile.single("profilePhoto"),
  updateProfilePhotoController,
);

// ── NEW: Seller submits verification docs ───────────────────
router.post(
  "/verify/submit",
  validateTokenMiddleware,
  uploadVerification.array("documents", 5),
  submitVerificationController,
);

module.exports = router;
