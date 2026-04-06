import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../css/Auth.css";
import logoImg from "../../assets/logo.png";

export default function SubscriptionVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | failed
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
    <div className="auth-page" style={{ background: "black" }}>
      <div className="auth-card" style={{ maxWidth: 480, margin: "auto", padding: 48, borderRadius: 28, textAlign: "center" }}>
        <div className="auth-logo" onClick={() => navigate("/")}>
          <div className="auth-logo-icon">
            <img src={logoImg} alt="Mero Kitchen" />
          </div>
          <div className="auth-logo-text">Mero <span>Kitchen</span></div>
        </div>

        {status === "verifying" && (
          <>
            <div style={{ fontSize: "3rem", margin: "24px 0" }}>⏳</div>
            <h2 className="auth-heading">Verifying Payment...</h2>
            <p className="auth-subheading">Please wait while we confirm your payment with Khalti.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", margin: "24px 0" }}>🎉</div>
            <h2 className="auth-heading" style={{ color: "#2d7a4f" }}>Subscription Active!</h2>
            <p className="auth-subheading">{message}</p>
            <p className="auth-subheading">You can now submit your verification documents.</p>
            <button
              className="submit-btn"
              style={{ marginTop: 24 }}
              onClick={() => navigate("/profile")}
            >
              Go to Profile 🍽️
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <div style={{ fontSize: "3rem", margin: "24px 0" }}>❌</div>
            <h2 className="auth-heading" style={{ color: "#c0392b" }}>Payment Failed</h2>
            <p className="auth-subheading">{message}</p>
            <button
              className="submit-btn"
              style={{ marginTop: 24 }}
              onClick={() => navigate("/subscription")}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}