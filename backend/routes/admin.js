var express = require("express");
var router = express.Router();

const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { adminOnlyMiddleware } = require("../middleware/RoleMiddleware");
const {
  getAllUsersController,
  deleteUserController,
  updateUserRoleController,
  getAllOrdersController,
  updateOrderStatusController,
  getAllProductsController,
  deleteProductController,
  toggleProductAvailabilityController,
  getAllReviewsController,
  deleteReviewController,
  getDashboardStatsController,
  getVerificationRequestsController,
  updateVerificationStatusController,
} = require("../controller/adminController");

router.use(validateTokenMiddleware, adminOnlyMiddleware);

// Dashboard
router.get("/stats", getDashboardStatsController);

// Users
router.get("/users", getAllUsersController);
router.delete("/users/:id", deleteUserController);
router.patch("/users/:id/role", updateUserRoleController);

// Orders
router.get("/orders", getAllOrdersController);
router.patch("/orders/:id/status", updateOrderStatusController);

// Products
router.get("/products", getAllProductsController);
router.delete("/products/:id", deleteProductController);
router.patch("/products/:id/availability", toggleProductAvailabilityController);

// Reviews
router.get("/reviews", getAllReviewsController);
router.delete("/reviews/:id", deleteReviewController);

// ── NEW: Verification ───────────────────────────────────────
router.get("/verifications", getVerificationRequestsController);
router.patch("/verifications/:id", updateVerificationStatusController);

module.exports = router;
