import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../css/Auth.css";
import "../../css/SubscriptionVerify.css";
import logoImg from "../../assets/logo.png";

export default function SubscriptionVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    if (!pidx) {
      setStatus("failed");
      setMessage("Missing payment reference. Please try again.");
      return;
    }

    axios
      .post("http://localhost:3000/subscription/verify-payment", { pidx })
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message || "Subscription activated!");
      })
      .catch((err) => {
        setStatus("failed");
        setMessage(err.response?.data?.message || "Payment verification failed.");
      });
  }, []);

  return (
    <div className="sv-page">
      <div className="sv-card">
        <div className="sv-logo" onClick={() => navigate("/")}>
          <div className="sv-logo-icon">
            <img src={logoImg} alt="Mero Kitchen" />
          </div>
          <div className="sv-logo-text">Mero <span>Kitchen</span></div>
        </div>

        {status === "verifying" && (
          <div className="sv-body">
            <div className="sv-emoji">⏳</div>
            <h2 className="sv-title">Verifying Payment...</h2>
            <p className="sv-desc">Please wait while we confirm your payment with Khalti.</p>
          </div>
        )}

        {status === "success" && (
          <div className="sv-body">
            <div className="sv-emoji">🎉</div>
            <h2 className="sv-title sv-title--success">Subscription Active!</h2>
            <p className="sv-desc">{message}</p>
            <p className="sv-desc">Submit your verification documents to earn your badge.</p>
            <button className="sv-btn sv-btn--primary" onClick={() => navigate("/profile")}>
              Go to Profile →
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="sv-body">
            <div className="sv-emoji">❌</div>
            <h2 className="sv-title sv-title--error">Payment Failed</h2>
            <p className="sv-desc">{message}</p>
            <button className="sv-btn sv-btn--danger" onClick={() => navigate("/subscription")}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}