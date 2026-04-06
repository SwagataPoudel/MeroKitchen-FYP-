const axios = require("axios");
const Subscription = require("../model/SubscriptionModel");
const User = require("../model/UserModel");

// Plan definitions
const PLANS = {
  basic: { amount: 49900, label: "Basic Plan", durationDays: 30 }, // Rs. 499
  standard: { amount: 99900, label: "Standard Plan", durationDays: 30 }, // Rs. 999
  premium: { amount: 199900, label: "Premium Plan", durationDays: 30 }, // Rs. 1999
};

// Step 1: Seller initiates subscription payment
async function initiateSubscriptionController(req, res) {
  try {
    const { plan } = req.body;

    if (!PLANS[plan])
      return res
        .status(400)
        .json({ message: "Invalid plan. Choose basic, standard, or premium." });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "seller")
      return res.status(403).json({ message: "Only sellers can subscribe" });

    // Check if already has active subscription
    if (user.subscriptionStatus === "active") {
      const existing = await Subscription.findById(user.subscription);
      if (existing && existing.endDate > new Date())
        return res
          .status(400)
          .json({ message: "You already have an active subscription" });
    }

    const selectedPlan = PLANS[plan];

    // Create a pending subscription record
    const subscription = new Subscription({
      seller: req.user.id,
      plan,
      amount: selectedPlan.amount,
      status: "pending_payment",
      paymentStatus: "unpaid",
    });
    await subscription.save();

    // Initiate Khalti payment
    const khaltiRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: `${process.env.FRONTEND_URL}/subscription/verify`,
        website_url: process.env.FRONTEND_URL,
        amount: selectedPlan.amount,
        purchase_order_id: subscription._id.toString(),
        purchase_order_name: `MeroKitchen ${selectedPlan.label}`,
        customer_info: {
          name: user.name || "Seller",
          email: user.email || "seller@merokitchen.com",
        },
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Save pidx to subscription
    subscription.khaltiPidx = khaltiRes.data.pidx;
    await subscription.save();

    return res.status(201).json({
      message: "Subscription payment initiated",
      subscription,
      payment_url: khaltiRes.data.payment_url,
    });
  } catch (error) {
    console.error(
      "Initiate subscription error:",
      error.response?.data || error.message,
    );
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Step 2: Verify payment after Khalti redirect
async function verifySubscriptionPaymentController(req, res) {
  try {
    const { pidx } = req.body;
    if (!pidx) return res.status(400).json({ message: "pidx is required" });

    // Lookup payment from Khalti
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

    const { status } = khaltiRes.data;

    if (status !== "Completed") {
      return res.status(400).json({ message: "Payment not completed", status });
    }

    // Find subscription by pidx
    const subscription = await Subscription.findOne({ khaltiPidx: pidx });
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    if (subscription.paymentStatus === "paid")
      return res
        .status(400)
        .json({ message: "Subscription already activated" });

    // Activate subscription
    const plan = PLANS[subscription.plan];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    subscription.paymentStatus = "paid";
    subscription.status = "active";
    subscription.startDate = startDate;
    subscription.endDate = endDate;
    await subscription.save();

    // Update user
    await User.findByIdAndUpdate(subscription.seller, {
      subscription: subscription._id,
      subscriptionStatus: "active",
      // Also update verificationStatus to pending so they can now submit docs
      verificationStatus: "pending",
    });

    return res.status(200).json({
      message: "Subscription activated successfully!",
      subscription,
    });
  } catch (error) {
    console.error(
      "Verify subscription error:",
      error.response?.data || error.message,
    );
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
}

// Get current seller's subscription
async function getMySubscriptionController(req, res) {
  try {
    const user = await User.findById(req.user.id).populate("subscription");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Auto-expire if past endDate
    if (
      user.subscription &&
      user.subscription.endDate &&
      user.subscription.endDate < new Date() &&
      user.subscriptionStatus === "active"
    ) {
      await Subscription.findByIdAndUpdate(user.subscription._id, {
        status: "expired",
      });
      await User.findByIdAndUpdate(req.user.id, {
        subscriptionStatus: "expired",
      });
      user.subscriptionStatus = "expired";
    }

    return res.status(200).json({
      subscriptionStatus: user.subscriptionStatus,
      subscription: user.subscription || null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  initiateSubscriptionController,
  verifySubscriptionPaymentController,
  getMySubscriptionController,
};
