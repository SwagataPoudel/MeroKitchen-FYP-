import { useEffect, useState } from "react";
import { getSellerChatRequests, updateChatRequest } from "../api/chatApi";
import ChatBox from "./ChatBox";

export default function SellerChatRequests() {
  const currentUserId = localStorage.getItem("userId");
  const [requests, setRequests] = useState([]);
  const [openChat, setOpenChat] = useState(null); // requestId

  useEffect(() => {
    getSellerChatRequests().then(setRequests).catch(console.error);
  }, []);

  const handleRespond = async (requestId, status) => {
    try {
      const updated = await updateChatRequest(requestId, status);
      setRequests((prev) => prev.map((r) => (r._id === requestId ? { ...r, status: updated.status } : r)));
    } catch (err) {
      console.error(err);
    }
  };

  if (requests.length === 0) return null;

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{ fontFamily: "Playfair Display, serif", marginBottom: "1rem" }}>
        💬 Chat Requests
      </h3>
      {requests.map((req) => {
        const roomId = `product_${req.productId?._id}_${[currentUserId, req.customerId?._id].sort().join("_")}`;
        const isOpen = openChat === req._id;
        return (
          <div key={req._id} style={{
            border: "1px solid #e5e7eb", borderRadius: "10px",
            padding: "1rem", marginBottom: "1rem", backgroundColor: "#fff",
          }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>{req.customerId?.name}</strong> wants to chat about{" "}
              <strong>{req.productId?.name}</strong>
            </div>

            {req.status === "pending" && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => handleRespond(req._id, "accepted")} style={{
                  backgroundColor: "#4F46E5", color: "#fff", border: "none",
                  borderRadius: "6px", padding: "0.4rem 1rem", cursor: "pointer",
                }}>
                  Accept
                </button>
                <button onClick={() => handleRespond(req._id, "declined")} style={{
                  backgroundColor: "#fee2e2", color: "#991b1b", border: "none",
                  borderRadius: "6px", padding: "0.4rem 1rem", cursor: "pointer",
                }}>
                  Decline
                </button>
              </div>
            )}

            {req.status === "declined" && (
              <span style={{ color: "#991b1b", fontSize: "0.85rem" }}>✗ Declined</span>
            )}

            {req.status === "accepted" && (
              <>
                <button onClick={() => setOpenChat(isOpen ? null : req._id)} style={{
                  backgroundColor: "#4F46E5", color: "#fff", border: "none",
                  borderRadius: "6px", padding: "0.4rem 1rem", cursor: "pointer",
                }}>
                  💬 {isOpen ? "Close Chat" : "Open Chat"}
                </button>
                {isOpen && (
                  <div style={{ marginTop: "1rem" }}>
                    <ChatBox
                      currentUserId={currentUserId}
                      currentUserRole="seller"
                      otherUserId={req.customerId?._id}
                      roomId={roomId}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}