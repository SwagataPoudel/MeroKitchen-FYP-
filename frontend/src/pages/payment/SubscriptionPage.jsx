import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/Auth.css";
import "../../css/Profile.css";
import "../../css/Subscription.css";
import logoImg from "../../assets/logo.png";

const PLANS = [
  {
    key: "basic",
    label: "Basic",
    price: "Rs. 499",
    amount: 49900,
    duration: "30 days",
    features: ["List up to 10 products", "Standard support", "Verified badge eligibility"],
    color: "#7a8fa6",
    popular: true,
  },
 
];

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    if (!selectedPlan) return setError("Please select a plan first.");
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:3000/subscription/initiate",
        { plan: selectedPlan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Redirect to Khalti payment page
      window.location.href = res.data.payment_url;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate payment.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page profile-page sub-page">
      <div className="auth-card profile-card sub-card">
        {/* Logo */}
        <div className="auth-logo" onClick={() => navigate("/")}>
          <div className="auth-logo-icon">
            <img src={logoImg} alt="Mero Kitchen" />
          </div>
          <div className="auth-logo-text">Mero <span>Kitchen</span></div>
        </div>

        <h2 className="auth-heading">Choose a <em>Plan</em></h2>
        <p className="auth-subheading">
          Subscribe to unlock verification and start selling on Mero Kitchen.
        </p>

        <div className="sub-plans-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className={`sub-plan-card ${selectedPlan === plan.key ? "selected" : ""} ${plan.popular ? "popular" : ""}`}
              onClick={() => setSelectedPlan(plan.key)}
              style={{ "--plan-color": plan.color }}
            >
              {plan.popular && <div className="sub-popular-badge">Most Popular</div>}
              <div className="sub-plan-name">{plan.label}</div>
              <div className="sub-plan-price">{plan.price}</div>
              <div className="sub-plan-duration">per {plan.duration}</div>
              <ul className="sub-plan-features">
                {plan.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <div className="sub-plan-select-indicator">
                {selectedPlan === plan.key ? "✅ Selected" : "Select"}
              </div>
            </div>
          ))}
        </div>

        {error && <div className="msg-banner msg-error">{error}</div>}

        <button
          className="submit-btn sub-pay-btn"
          onClick={handleSubscribe}
          disabled={loading || !selectedPlan}
        >
          {loading ? "Redirecting to Khalti..." : "Pay with Khalti 💳"}
        </button>

        <p className="sub-note">
          Secure payment via Khalti. Your subscription activates immediately after payment.
        </p>
      </div>
    </div>
  );
}