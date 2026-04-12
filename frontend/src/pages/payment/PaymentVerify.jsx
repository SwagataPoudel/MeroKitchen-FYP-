import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyKhaltiPayment } from "../../api/paymentApi";

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying your payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    if (!pidx) {
      setStatus("Invalid payment session.");
      return;
    }

    verifyKhaltiPayment(pidx)
      .then(() => {
        setStatus(" Payment successful! Redirecting to your orders...");
        setTimeout(() => navigate("/orders"), 2000);
      })
      .catch((err) => {
        setStatus("❌ Payment verification failed. Please contact support.");
        console.error(err);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "120px", fontFamily: "Playfair Display, serif", fontSize: "1.3rem" }}>
      {status}
    </div>
  );
}