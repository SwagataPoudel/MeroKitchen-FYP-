const express = require("express");
const router = express.Router();
const axios = require("axios");
const Order = require("../model/OrderModel");
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

// ✅ MUST be before /:id and no auth middleware
router.post("/verify-payment", async (req, res) => {
  console.log("🔍 verify-payment hit, body:", req.body);
  try {
    const { pidx } = req.body;
    if (!pidx) return res.status(400).json({ message: "pidx is required" });

    const khaltiRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("🔍 Khalti response:", khaltiRes.data);

    const { status, purchase_order_id } = khaltiRes.data;

    if (status === "Completed") {
      // Find by khaltiPidx since purchase_order_id is not in lookup response
      const order = await Order.findOne({ khaltiPidx: pidx });
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.paymentStatus = "paid";
      await order.save();

      return res.status(200).json({ message: "Payment verified", order });
    } else {
      return res.status(400).json({ message: "Payment not completed", status });
    }
  } catch (error) {
    console.error(
      "❌ Khalti verify error:",
      error.response?.data || error.message,
    );
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
});

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
router.get(
  "/seller",
  validateTokenMiddleware,
  sellerOnlyMiddleware,
  getSellerOrdersController,
);
router.put("/:id/status", validateTokenMiddleware, updateOrderStatusController);
router.get("/:id", validateTokenMiddleware, getOrderByIdController);

module.exports = router;
