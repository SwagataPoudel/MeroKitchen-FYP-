const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "preparing",
        "completed",
        "declined",
        "delivered",
      ],
      default: "pending",
    },
    specialRequest: { type: String, default: "" },
    deliveryAddress: { type: String, required: true },

    // 👇 ADD THESE
    paymentMethod: { type: String, enum: ["cod", "khalti"], default: "cod" },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    khaltiPidx: { type: String, default: "" },
  },
  { timestamps: true },
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
