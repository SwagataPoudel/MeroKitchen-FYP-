const Order = require("../model/OrderModel");
const Cart = require("../model/CartModel");
const Product = require("../model/ProductModel");
const ChatRequest = require("../model/ChatRequest");
const Review = require("../model/ReviewModel");
const axios = require("axios");

async function placeOrderController(req, res) {
  try {
    const { deliveryAddress, specialRequest, paymentMethod = "cod" } = req.body;
    if (!deliveryAddress)
      return res.status(400).json({ message: "Delivery address is required" });

    const cart = await Cart.findOne({ customer: req.user.id }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Your cart is empty" });

    const sellerMap = {};
    for (const item of cart.items) {
      const product = item.product;
      if (!product.availability)
        return res
          .status(400)
          .json({ message: `${product.name} is no longer available` });

      const sellerId = product.seller.toString();
      if (!sellerMap[sellerId]) sellerMap[sellerId] = [];
      sellerMap[sellerId].push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const orders = [];
    for (const [sellerId, items] of Object.entries(sellerMap)) {
      const totalAmount = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
      const order = new Order({
        customer: req.user.id,
        seller: sellerId,
        items,
        totalAmount,
        deliveryAddress,
        specialRequest: specialRequest || "",
        paymentMethod,
        paymentStatus: "unpaid",
      });
      await order.save();
      orders.push(order);

      const productIds = items.map((i) => i.product);
      await ChatRequest.updateMany(
        { customerId: req.user.id, sellerId, productId: { $in: productIds } },
        { status: "ordered" },
      );
    }

    await Cart.findOneAndDelete({ customer: req.user.id });

    if (paymentMethod === "cod") {
      return res
        .status(201)
        .json({ message: "Order placed successfully!", orders });
    }

    const order = orders[0];
    const totalInPaisa = order.totalAmount * 100;

    const khaltiRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: `${process.env.FRONTEND_URL}/payment/verify`,
        website_url: process.env.FRONTEND_URL,
        amount: totalInPaisa,
        purchase_order_id: order._id.toString(),
        purchase_order_name: `MeroKitchen Order #${order._id.toString().slice(-8).toUpperCase()}`,
        customer_info: {
          name: req.user.name || "Customer",
          email: req.user.email || "",
        },
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    order.khaltiPidx = khaltiRes.data.pidx;
    await order.save();

    return res.status(201).json({
      message: "Khalti payment initiated",
      orders,
      payment_url: khaltiRes.data.payment_url,
    });
  } catch (error) {
    console.error("Place order error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getMyOrdersController(req, res) {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate("items.product", "name photos price")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getOrderHistoryController(req, res) {
  try {
    const orders = await Order.find({
      customer: req.user.id,
      status: { $in: ["delivered", "completed", "declined", "cancelled"] },
    })
      .populate("items.product", "name photos price")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getSellerOrdersController(req, res) {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate("items.product", "name photos price")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
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
      "pending", "accepted", "preparing",
      "completed", "declined", "delivered", "cancelled",
    ];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id)
      .populate("customer", "_id")
      .populate("seller", "_id");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const customerId = order.customer?._id?.toString() ?? order.customer?.toString();
    const sellerId = order.seller?._id?.toString() ?? order.seller?.toString();

    if (status === "delivered") {
      if (customerId !== req.user.id)
        return res.status(403).json({ message: "Only the customer can mark as delivered" });
      if (order.status !== "completed")
        return res.status(400).json({ message: "Order must be completed before marking delivered" });
    } else if (status === "cancelled") {
      if (customerId !== req.user.id)
        return res.status(403).json({ message: "Only the customer can cancel" });
      if (!["pending", "accepted", "preparing"].includes(order.status))
        return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    } else {
      if (sellerId !== req.user.id)
        return res.status(403).json({ message: "Not your order" });
    }

    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("updateOrderStatus error:", error.message); 
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

async function getOrderByIdController(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name photos price")
      .populate("seller", "name email")
      .populate("customer", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner =
      order.customer._id.toString() === req.user.id ||
      order.seller._id.toString() === req.user.id;
    if (!isOwner) return res.status(403).json({ message: "Forbidden" });

    res.status(200).json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getSellerStatsController(req, res) {
  try {
    const sellerId = req.user.id;

    const orders = await Order.find({ seller: sellerId })
      .populate("customer", "name")
      .populate("items.product", "name")
      .sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const uniqueCustomerIds = new Set(
      orders.map((o) => o.customer?._id?.toString()),
    );
    const totalCustomers = uniqueCustomerIds.size;

    const completedStatuses = ["completed", "delivered"];
    const activeStatuses = ["pending", "accepted", "preparing"];

    const totalRevenue = orders
      .filter((o) => completedStatuses.includes(o.status))
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingRevenue = orders
      .filter((o) => activeStatuses.includes(o.status))
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const statusBreakdown = {
      pending: 0,
      accepted: 0,
      preparing: 0,
      completed: 0,
      delivered: 0,
      declined: 0,
      cancelled: 0,
    };
    for (const o of orders) {
      if (statusBreakdown.hasOwnProperty(o.status)) statusBreakdown[o.status]++;
    }

    const now = new Date();
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("en-NP", {
        month: "short",
        year: "2-digit",
      });
      const monthOrders = orders.filter((o) => {
        const c = new Date(o.createdAt);
        return (
          c.getFullYear() === d.getFullYear() &&
          c.getMonth() === d.getMonth() &&
          completedStatuses.includes(o.status)
        );
      });
      monthlyRevenue.push({
        label,
        revenue: monthOrders.reduce((s, o) => s + o.totalAmount, 0),
        orders: monthOrders.length,
      });
    }

    const recentOrders = orders.slice(0, 10).map((o) => ({
      _id: o._id,
      customerName: o.customer?.name || "Customer",
      createdAt: o.createdAt,
      itemCount: o.items.reduce((s, i) => s + i.quantity, 0),
      totalAmount: o.totalAmount,
      paymentStatus: o.paymentStatus,
      status: o.status,
    }));

    const reviews = await Review.find({ seller: sellerId })
      .populate("customer", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? Math.round(
            (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10,
          ) / 10
        : 0;

    res.status(200).json({
      totalOrders,
      totalCustomers,
      totalRevenue,
      pendingRevenue,
      statusBreakdown,
      monthlyRevenue,
      recentOrders,
      avgRating,
      totalReviews,
      reviews,
    });
  } catch (error) {
    console.error("Seller stats error:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  placeOrderController,
  getMyOrdersController,
  getOrderHistoryController,
  getSellerOrdersController,
  updateOrderStatusController,
  getOrderByIdController,
  getSellerStatsController,
};
