const Review = require("../model/ReviewModel");
const Product = require("../model/ProductModel");
const Order = require("../model/OrderModel");

// POST /reviews — customer submits a review
async function submitReviewController(req, res) {
  try {
    const { productId, orderId, rating, comment } = req.body;

    if (!productId || !orderId || !rating)
      return res
        .status(400)
        .json({ message: "productId, orderId and rating are required" });

    // Verify order belongs to customer and is delivered
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.customer.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your order" });
    if (order.status !== "delivered")
      return res
        .status(400)
        .json({ message: "Order must be delivered before reviewing" });

    // Check product is actually in the order
    const inOrder = order.items.some((i) => i.product.toString() === productId);
    if (!inOrder)
      return res
        .status(400)
        .json({ message: "Product not part of this order" });

    // Create review (unique index prevents duplicates)
    const review = new Review({
      product: productId,
      customer: req.user.id,
      order: orderId,
      rating,
      comment: comment || "",
    });
    await review.save();

    // Recalculate product average rating
    const allReviews = await Review.find({ product: productId });
    const avg =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, {
      "ratings.average": Math.round(avg * 10) / 10,
      "ratings.count": allReviews.length,
    });

    res.status(201).json({ message: "Review submitted!", review });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(400)
        .json({ message: "You already reviewed this product for this order" });
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// GET /reviews/product/:productId — get all reviews for a product
async function getProductReviewsController(req, res) {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("customer", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function getMyReviewsController(req, res) {
  try {
    const reviews = await Review.find({ customer: req.user.id })
      .select("product order");  // only need these two fields

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = { submitReviewController, getProductReviewsController, getMyReviewsController };
