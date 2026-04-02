const User = require("../model/UserModel");
const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");
const Review = require("../model/ReviewModel");

// ─── USERS ───────────────────────────────────────────────
async function getAllUsersController(req, res) {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteUserController(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateUserRoleController(req, res) {
  try {
    const { role } = req.body;
    if (!["customer", "seller", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Role updated", user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

// ─── ORDERS ──────────────────────────────────────────────
async function getAllOrdersController(req, res) {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")   // ✅ field is "customer" not "userId"
      .populate("seller", "name email")     // ✅ populate seller too
      .populate("items.product", "name price") // ✅ nested: items[].product
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateOrderStatusController(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "accepted", "preparing", "completed", "declined", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

// ─── PRODUCTS ─────────────────────────────────────────────
async function getAllProductsController(req, res) {
  try {
    const products = await Product.find()
      .populate("seller", "name email")  // ✅ field is "seller" not "sellerId"
      .sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteProductController(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function toggleProductAvailabilityController(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.availability = !product.availability;
    await product.save();
    res.status(200).json({ message: "Availability toggled", product });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

// ─── REVIEWS ──────────────────────────────────────────────
async function getAllReviewsController(req, res) {
  try {
    const reviews = await Review.find()
      .populate("customer", "name email")  // ✅ field is "customer" not "userId"
      .populate("product", "name")         // ✅ field is "product" not "productId"
      .populate("order", "totalAmount status")
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function getVerificationRequestsController(req, res) {
  try {
    const requests = await User.find({ verificationStatus: "pending" }).select(
      "name email kitchenName city verificationDocuments verificationStatus createdAt"
    );
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

// ── NEW: Approve or reject a verification request ──────────
async function updateVerificationStatusController(req, res) {
  try {
    const { status, note } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "Status must be approved or rejected" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verificationStatus !== "pending")
      return res.status(400).json({ message: "No pending verification for this user" });

    const updates = {
      verificationStatus: status,
      isVerifiedSeller: status === "approved",
      verificationNote: note || "",
    };

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: `Verification ${status}`,
      user: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}


async function deleteReviewController(req, res) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

// ─── DASHBOARD STATS ──────────────────────────────────────
async function getDashboardStatsController(req, res) {
  try {
    const [totalUsers, totalOrders, totalProducts, totalReviews] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Review.countDocuments(),
    ]);

    // Revenue = sum of all completed/delivered order totalAmounts
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ["completed", "delivered"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Orders grouped by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name email")
      .populate("seller", "name email");

    res.status(200).json({
      stats: { totalUsers, totalOrders, totalProducts, totalReviews, totalRevenue },
      ordersByStatus,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
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
};