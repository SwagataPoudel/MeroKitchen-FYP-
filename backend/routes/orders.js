const express = require("express");
const router = express.Router();
const {
  placeOrderController,
  getMyOrdersController,
  getSellerOrdersController,
  updateOrderStatusController,
  getOrderByIdController,
} = require("../controller/OrderController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const {
  customerOnlyMiddleware,
  sellerOnlyMiddleware,
} = require("../middleware/RoleMiddleware");

// Customer routes
router.post(
  "/",
  validateTokenMiddleware,
  customerOnlyMiddleware,
  placeOrderController,
);
router.get(
  "/my",
  validateTokenMiddleware,
  customerOnlyMiddleware,
  getMyOrdersController,
);

// Seller routes
router.get(
  "/seller",
  validateTokenMiddleware,
  sellerOnlyMiddleware,
  getSellerOrdersController,
);
router.put(
  "/:id/status",
  validateTokenMiddleware,
  sellerOnlyMiddleware,
  updateOrderStatusController,
);

// Shared (customer or seller)
router.get("/:id", validateTokenMiddleware, getOrderByIdController);

module.exports = router;
