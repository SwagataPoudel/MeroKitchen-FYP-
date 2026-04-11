import { useEffect, useState } from "react";
import { sendChatRequest, getChatRequest } from "../api/chatApi";
import ChatBox from "./ChatBox";

export default function ChatRequestButton({ productId, sellerId }) {
  const currentUserId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (role !== "customer" || !currentUserId) return setLoading(false);
    getChatRequest(productId)
      .then(setRequest)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const handleRequest = async () => {
    try {
      const req = await sendChatRequest(productId, sellerId);
      setRequest(req);
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUserId || role !== "customer") return null;
  if (loading) return null;

  const roomId = `product_${productId}_${[currentUserId, sellerId].sort().join("_")}`;

  // At the top of ChatRequestButton, before the return:
console.log({ currentUserId, role, productId, sellerId });

  return (
    <div style={{ marginTop: "1rem" }}>
      {!request && (
        <button onClick={handleRequest} style={{
          backgroundColor: "#fff", color: "#4F46E5",
          border: "2px solid #4F46E5", borderRadius: "8px",
          padding: "0.5rem 1.2rem", cursor: "pointer", fontWeight: "600",
        }}>
          Chat with Seller
        </button>
      )}

      {request?.status === "pending" && (
        <p style={{ color: "#854d0e", background: "#fef9c3", padding: "0.5rem 1rem", borderRadius: "8px" }}>
           Chat request sent — waiting for seller to accept
        </p>
      )}

      {request?.status === "declined" && (
        <p style={{ color: "#991b1b", background: "#fee2e2", padding: "0.5rem 1rem", borderRadius: "8px" }}>
          Seller declined the chat request
        </p>
      )}

      {request?.status === "accepted" && (
        <>
          <button onClick={() => setOpen((o) => !o)} style={{
            backgroundColor: "#4F46E5", color: "#fff", border: "none",
            borderRadius: "8px", padding: "0.5rem 1.2rem", cursor: "pointer", fontWeight: "600",
          }}>
             {open ? "Close Chat" : "Open Chat"}
          </button>
          {open && (
            <div style={{ marginTop: "1rem" }}>
              <ChatBox
                currentUserId={currentUserId}
                currentUserRole="customer"
                otherUserId={sellerId}
                roomId={roomId}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}