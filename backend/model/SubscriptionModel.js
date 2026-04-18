const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["standard"],
      required: true,
    },
    amount: { type: Number, required: true }, // in paisa (Khalti)
    status: {
      type: String,
      enum: ["pending_payment", "active", "expired", "failed"],
      default: "pending_payment",
    },
    khaltiPidx: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;