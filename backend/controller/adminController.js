const User = require("../model/UserModel");
const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");
const Review = require("../model/ReviewModel");
const Subscription = require("../model/SubscriptionModel");

async function getAllUsersController(req, res) {
  try {
    const { role, verificationStatus, subscriptionStatus, search } = req.query;
    const filter = {};
    if (role && role !== "all") filter.role = role;
    if (verificationStatus && verificationStatus !== "all")
      filter.verificationStatus = verificationStatus;
    if (subscriptionStatus && subscriptionStatus !== "all")
      filter.subscriptionStatus = subscriptionStatus;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { kitchenName: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function expireSellerSubscriptionController(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "seller")
      return res.status(400).json({ message: "User is not a seller" });

    if (user.subscription) {
      await Subscription.findByIdAndUpdate(user.subscription, {
        status: "expired",
      });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          subscriptionStatus: "expired",
          isVerifiedSeller: false, 
        },
      },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "Subscription expired and verified badge removed.",
      user: updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getUserByIdController(req, res) {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("subscription");
    if (!user) return res.status(404).json({ message: "User not found" });
    const [orderCount, spentResult, reviewCount] = await Promise.all([
      Order.countDocuments({ customer: req.params.id }),
      Order.aggregate([
        {
          $match: {
            customer: user._id,
            status: { $in: ["completed", "delivered"] },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Review.countDocuments({ customer: req.params.id }),
    ]);
    res.status(200).json({
      user,
      meta: { orderCount, totalSpent: spentResult[0]?.total || 0, reviewCount },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteUserController(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateUserRoleController(req, res) {
  try {
    const { role } = req.body;
    if (!["customer", "seller", "admin"].includes(role))
      return res.status(400).json({ message: "Invalid role" });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Role updated", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateUserProfileController(req, res) {
  try {
    const allowed = [
      "name",
      "phone",
      "city",
      "kitchenName",
      "kitchenDescription",
      "openingHours",
      "defaultDeliveryAddress",
      "cuisineTypes",
    ];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function toggleUserAvailabilityController(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isAvailable = !user.isAvailable;
    await user.save();
    res.status(200).json({
      message: `Seller marked as ${user.isAvailable ? "available" : "unavailable"}`,
      user: { _id: user._id, isAvailable: user.isAvailable },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}


async function getAllOrdersController(req, res) {
  try {
    const { status, paymentStatus, paymentMethod, from, to, search } =
      req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (paymentStatus && paymentStatus !== "all")
      filter.paymentStatus = paymentStatus;
    if (paymentMethod && paymentMethod !== "all")
      filter.paymentMethod = paymentMethod;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to)
        filter.createdAt.$lte = new Date(
          new Date(to).setHours(23, 59, 59, 999),
        );
    }
    let orders = await Order.find(filter)
      .populate("customer", "name email phone city")
      .populate("seller", "name email kitchenName city")
      .populate("items.product", "name price photos category")
      .sort({ createdAt: -1 });
    if (search) {
      orders = orders.filter(
        (o) =>
          o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
          o._id.toString().includes(search),
      );
    }
    res.status(200).json({ orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getOrderByIdController(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone city defaultDeliveryAddress")
      .populate("seller", "name email kitchenName city")
      .populate("items.product", "name price photos category preparationTime");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateOrderStatusController(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "accepted",
      "preparing",
      "completed",
      "declined",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateOrderPaymentStatusController(req, res) {
  try {
    const { paymentStatus } = req.body;
    if (!["paid", "unpaid"].includes(paymentStatus))
      return res.status(400).json({ message: "Invalid paymentStatus" });
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Payment status updated", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteOrderController(req, res) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function bulkUpdateOrderStatusController(req, res) {
  try {
    const { ids, status } = req.body;
    const validStatuses = [
      "pending",
      "accepted",
      "preparing",
      "completed",
      "declined",
      "delivered",
      "cancelled",
    ];
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ message: "ids array required" });
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const result = await Order.updateMany(
      { _id: { $in: ids } },
      { $set: { status } },
    );
    res.status(200).json({
      message: `${result.modifiedCount} orders updated`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getAllProductsController(req, res) {
  try {
    const { category, availability, search } = req.query;
    const filter = {};
    if (category && category !== "all") filter.category = category;
    if (availability === "true") filter.availability = true;
    if (availability === "false") filter.availability = false;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const products = await Product.find(filter)
      .populate("seller", "name email kitchenName city")
      .sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getProductByIdController(req, res) {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email kitchenName city",
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    const [reviewCount, avgResult, orderCount] = await Promise.all([
      Review.countDocuments({ product: req.params.id }),
      Review.aggregate([
        { $match: { product: product._id } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
      Order.countDocuments({ "items.product": req.params.id }),
    ]);
    res.status(200).json({
      product,
      meta: {
        reviewCount,
        avgRating: avgResult[0]?.avg ? Number(avgResult[0].avg.toFixed(1)) : 0,
        orderCount,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateProductController(req, res) {
  try {
    const allowed = [
      "name",
      "price",
      "category",
      "description",
      "preparationTime",
      "ingredients",
      "cuisineTypes",
      "availability",
    ];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    if (
      updates.price !== undefined &&
      (isNaN(updates.price) || Number(updates.price) < 0)
    )
      return res.status(400).json({ message: "Invalid price" });
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    ).populate("seller", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteProductController(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getAllReviewsController(req, res) {
  try {
    const { rating, search } = req.query;
    const filter = {};
    if (rating && rating !== "all") filter.rating = Number(rating);
    const reviews = await Review.find(filter)
      .populate("customer", "name email")
      .populate("product", "name category")
      .populate("order", "totalAmount status paymentStatus")
      .sort({ createdAt: -1 });
    const filtered = search
      ? reviews.filter(
          (r) =>
            r.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
            r.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
            r.comment?.toLowerCase().includes(search.toLowerCase()),
        )
      : reviews;
    res.status(200).json({ reviews: filtered });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function deleteReviewController(req, res) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
  
    const avgResult = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    await Product.findByIdAndUpdate(review.product, {
      "ratings.average": avgResult[0]?.avg
        ? Number(avgResult[0].avg.toFixed(1))
        : 0,
      "ratings.count": avgResult[0]?.count || 0,
    });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getVerificationRequestsController(req, res) {
  try {
    const requests = await User.find({ verificationStatus: "pending" }).select(
      "name email kitchenName city verificationDocuments verificationStatus subscriptionStatus createdAt",
    );
    res.status(200).json({ requests });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function updateVerificationStatusController(req, res) {
  try {
    const { status, note } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res
        .status(400)
        .json({ message: "Status must be approved or rejected" });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verificationStatus !== "pending")
      return res
        .status(400)
        .json({ message: "No pending verification for this user" });
    const isFullyVerified =
      status === "approved" && user.subscriptionStatus === "active";
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          verificationStatus: status,
          isVerifiedSeller: isFullyVerified,
          verificationNote: note || "",
        },
      },
      { new: true },
    ).select("-password");
    res.status(200).json({
      message: isFullyVerified
        ? "Approved. Seller is now fully verified with badge."
        : status === "approved"
          ? "Documents approved, but seller has no active subscription. Badge withheld."
          : `Verification ${status}`,
      user: updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getDashboardStatsController(req, res) {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalReviews,
      totalSellers,
      totalCustomers,
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Review.countDocuments(),
      User.countDocuments({ role: "seller" }),
      User.countDocuments({ role: "customer" }),
    ]);

    const [orderRevenueResult, subscriptionRevenueResult] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $in: ["completed", "delivered"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Subscription.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const orderRevenue = orderRevenueResult[0]?.total || 0;
    const subscriptionRevenue = Math.round(
      (subscriptionRevenueResult[0]?.total || 0) / 100,
    );
    const totalRevenue = orderRevenue + subscriptionRevenue;

    const [ordersByStatus, ordersByPaymentMethod, ordersByPaymentStatus] =
      await Promise.all([
        Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Order.aggregate([
          { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
        ]),
        Order.aggregate([
          { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
        ]),
      ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name email")
      .populate("seller", "name email kitchenName");

    const topProducts = await Review.aggregate([
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          "product.name": 1,
          "product.category": 1,
          "product.price": 1,
          avgRating: 1,
          reviewCount: 1,
        },
      },
    ]);

    res.status(200).json({
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalReviews,
        totalSellers,
        totalCustomers,
        totalRevenue,
        orderRevenue,
        subscriptionRevenue,
      },
      ordersByStatus,
      ordersByPaymentMethod,
      ordersByPaymentStatus,
      recentOrders,
      topProducts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  
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
};
