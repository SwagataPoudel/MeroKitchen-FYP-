const express = require("express");
const router = express.Router();
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { adminOnlyMiddleware } = require("../middleware/RoleMiddleware");
const {
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  updateUserRoleController,
  updateUserProfileController,
  toggleUserAvailabilityController,
  getAllOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  updateOrderPaymentStatusController,
  deleteOrderController,
  bulkUpdateOrderStatusController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  toggleProductAvailabilityController,
  getAllReviewsController,
  deleteReviewController,
  getVerificationRequestsController,
  updateVerificationStatusController,
  getDashboardStatsController,
   expireSellerSubscriptionController,
} = require("../controller/adminController");

router.use(validateTokenMiddleware, adminOnlyMiddleware);

// ── Dashboard
router.get("/stats", getDashboardStatsController);

// ── Users
router.get("/users", getAllUsersController);
router.get("/users/:id", getUserByIdController);
router.delete("/users/:id", deleteUserController);
router.patch("/users/:id/role", updateUserRoleController);
router.patch("/users/:id/profile", updateUserProfileController);
router.patch("/users/:id/availability", toggleUserAvailabilityController);

// ── Orders
router.get("/orders", getAllOrdersController);
router.get("/orders/:id", getOrderByIdController);
router.patch("/orders/:id/status", updateOrderStatusController);
router.patch("/orders/:id/payment-status", updateOrderPaymentStatusController);
router.delete("/orders/:id", deleteOrderController);
router.patch("/orders/bulk/status", bulkUpdateOrderStatusController);

// ── Products
router.get("/products", getAllProductsController);
router.get("/products/:id", getProductByIdController);
router.patch("/products/:id", updateProductController);
router.delete("/products/:id", deleteProductController);
router.patch("/products/:id/availability", toggleProductAvailabilityController);

// ── Reviews
router.get("/reviews", getAllReviewsController);
router.delete("/reviews/:id", deleteReviewController);

// ── Verifications
router.get("/verifications", getVerificationRequestsController);
router.patch("/verifications/:id", updateVerificationStatusController);
router.patch("/users/:id/expire-subscription", expireSellerSubscriptionController);

module.exports = router;
