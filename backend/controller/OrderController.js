const Order = require("../model/OrderModel");
const Cart = require("../model/CartModel");
const Product = require("../model/ProductModel");

// POST /orders — customer places order from cart
async function placeOrderController(req, res) {
  try {
    const { deliveryAddress, specialRequest } = req.body;
    if (!deliveryAddress)
      return res.status(400).json({ message: "Delivery address is required" });

    const cart = await Cart.findOne({ customer: req.user.id }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Your cart is empty" });

    // Group items by seller
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

    // Create one order per seller
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
      });
      await order.save();
      orders.push(order);
    }

    // Clear cart after order placed
    await Cart.findOneAndDelete({ customer: req.user.id });

    res.status(201).json({ message: "Order placed successfully!", orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// GET /orders/my — customer views their orders
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

// GET /orders/seller — seller views incoming orders
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

// PUT /orders/:id/status — seller updates order status
async function updateOrderStatusController(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "accepted",
      "preparing",
      "completed",
      "declined",
    ];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your order" });

    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// GET /orders/:id — get single order detail
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
