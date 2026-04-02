const express = require("express");
const router = express.Router();
const Message = require("../model/Message");
const ChatRequest = require("../model/ChatRequest");
const Order = require("../model/OrderModel");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");

router.get("/messages/:roomId", validateTokenMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort(
      "createdAt",
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/request", validateTokenMiddleware, async (req, res) => {
  try {
    const { productId, sellerId } = req.body;
    const customerId = req.user.id;

    const existing = await ChatRequest.findOne({
      productId,
      customerId,
      sellerId,
    });
    if (existing) return res.json(existing);

    const request = await ChatRequest.create({
      productId,
      customerId,
      sellerId,
    });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to create chat request" });
  }
});

router.get("/request/:productId", validateTokenMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;
    const request = await ChatRequest.findOne({
      productId: req.params.productId,
      customerId,
    });
    res.json(request || null);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch request" });
  }
});

router.get("/requests/seller", validateTokenMiddleware, async (req, res) => {
  try {
    const requests = await ChatRequest.find({ sellerId: req.user.id })
      .populate("customerId", "name email")
      .populate("productId", "name");

    const filtered = await Promise.all(
      requests.map(async (chatReq) => {
        const order = await Order.findOne({
          "items.product": chatReq.productId._id,
          customer: chatReq.customerId._id,
        });
        return order ? null : chatReq;
      }),
    );

    res.json(filtered.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

router.put("/request/:id", validateTokenMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ChatRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to update request" });
  }
});

module.exports = router;
