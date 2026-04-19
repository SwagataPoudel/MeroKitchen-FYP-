import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyKhaltiPayment } from "../../api/paymentApi";

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    if (!pidx) {
      setStatus("invalid");
      return;
    }
    verifyKhaltiPayment(pidx)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/orders"), 3000);
      })
      .catch((err) => {
        setStatus("failed");
        console.error(err);
      });
  }, []);

  const states = {
    verifying: {
      icon: "⏳",
      heading: "Verifying your payment",
      sub: "Please wait, this only takes a moment...",
      iconBg: "#fdf5e4",
      iconColor: "#c8753a",
      badgeBg: "#fdf5e4",
      badgeColor: "#c8753a",
      badgeText: "Processing",
    },
    success: {
      icon: "✓",
      heading: "Payment successful!",
      sub: "Your order has been placed. Redirecting to your orders...",
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
      badgeBg: "#f0fdf4",
      badgeColor: "#16a34a",
      badgeText: "Confirmed",
    },
    failed: {
      icon: "✕",
      heading: "Payment verification failed",
      sub: "Something went wrong. Please contact support or try again.",
      iconBg: "#fef2f2",
      iconColor: "#dc2626",
      badgeBg: "#fef2f2",
      badgeColor: "#dc2626",
      badgeText: "Failed",
    },
    invalid: {
      icon: "!",
      heading: "Invalid payment session",
      sub: "No payment reference found. Please go back and try again.",
      iconBg: "#fdf5e4",
      iconColor: "#c8753a",
      badgeBg: "#fdf5e4",
      badgeColor: "#c8753a",
      badgeText: "Invalid",
    },
  };

  const s = states[status];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fffaf0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Lato', sans-serif",
      padding: "2rem",
    }}>
      <div style={{
        background: "#ffffff",
        border: "1px solid #f0e6d3",
        borderRadius: "16px",
        padding: "3rem 2.5rem",
        maxWidth: "460px",
        width: "100%",
        textAlign: "center",
      }}>

        {/* Icon circle */}
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: s.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
          fontSize: "1.8rem",
          color: s.iconColor,
          fontWeight: "700",
        }}>
          {s.icon}
        </div>

        {/* Status badge */}
        <div style={{
          display: "inline-block",
          background: s.badgeBg,
          color: s.badgeColor,
          fontSize: "0.72rem",
          fontWeight: "700",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "4px 14px",
          borderRadius: "20px",
          marginBottom: "1rem",
        }}>
          {s.badgeText}
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.55rem",
          fontWeight: "700",
          color: "#2d1a0e",
          marginBottom: "0.75rem",
          lineHeight: "1.3",
        }}>
          {s.heading}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "0.95rem",
          color: "#7a5c40",
          lineHeight: "1.6",
          marginBottom: "2rem",
        }}>
          {s.sub}
        </p>

        {/* Progress bar — only on verifying */}
        {status === "verifying" && (
          <div style={{
            height: "3px",
            background: "#f0e6d3",
            borderRadius: "99px",
            overflow: "hidden",
            marginBottom: "2rem",
          }}>
            <div style={{
              height: "100%",
              width: "60%",
              background: "#c8753a",
              borderRadius: "99px",
              animation: "pulse 1.4s ease-in-out infinite",
            }} />
          </div>
        )}

        {/* Redirect note — only on success */}
        {status === "success" && (
          <p style={{
            fontSize: "0.8rem",
            color: "#16a34a",
            marginBottom: "1.5rem",
          }}>
            Redirecting in 3 seconds...
          </p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          {status === "success" && (
            <button
              onClick={() => navigate("/orders")}
              style={{
                background: "#2d1a0e",
                color: "#fffaf0",
                border: "none",
                borderRadius: "8px",
                padding: "10px 28px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              View My Orders →
            </button>
          )}
          {(status === "failed" || status === "invalid") && (
            <>
              <button
                onClick={() => navigate("/cart")}
                style={{
                  background: "#2d1a0e",
                  color: "#fffaf0",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Back to Cart
              </button>
              <button
                onClick={() => navigate("/")}
                style={{
                  background: "transparent",
                  color: "#c8753a",
                  border: "1.5px solid #c8753a",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Go Home
              </button>
            </>
          )}
        </div>

        <p style={{
          marginTop: "2.5rem",
          fontSize: "0.78rem",
          color: "#b89070",
          letterSpacing: "0.03em",
        }}>
          Mero <span style={{ color: "#c8753a", fontWeight: "700" }}>Kitchen</span>
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}