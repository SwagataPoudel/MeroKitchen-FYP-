const Order = require("../model/OrderModel");
const Cart = require("../model/CartModel");
const Product = require("../model/ProductModel");
const ChatRequest = require("../model/ChatRequest");
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

    // If COD, done
    if (paymentMethod === "cod") {
      return res
        .status(201)
        .json({ message: "Order placed successfully!", orders });
    }

    // If Khalti, initiate payment for first order (single-seller assumed)
    // For multi-seller, you'd loop — but typically one checkout at a time
    const order = orders[0];
    const totalInPaisa = order.totalAmount * 100; // Khalti uses paisa

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

    // Save pidx to order
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

// NEW: Verify Khalti payment after redirect


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
      "pending",
      "accepted",
      "preparing",
      "completed",
      "declined",
      "delivered",
    ];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "delivered") {
      if (order.customer.toString() !== req.user.id)
        return res
          .status(403)
          .json({ message: "Only the customer can mark as delivered" });
      if (order.status !== "completed")
        return res.status(400).json({
          message: "Order must be completed before marking delivered",
        });
    } else {
      if (order.seller.toString() !== req.user.id)
        return res.status(403).json({ message: "Not your order" });
    }

    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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

module.exports = {
  placeOrderController,
  getMyOrdersController,
  getSellerOrdersController,
  updateOrderStatusController,
  getOrderByIdController,
};
