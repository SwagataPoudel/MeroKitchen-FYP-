import { useEffect, useState } from "react";
import { sendChatRequest, getChatRequest } from "../api/chatApi";
import ChatBox from "./ChatBox";
import "../css/ChatRequestButton.css";

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

  return (
    <div className="chat-request-wrapper">
      {!request && (
        <button className="chat-request-btn" onClick={handleRequest}>
          Chat with Seller
        </button>
      )}

      {request?.status === "pending" && (
        <p className="chat-status-pending">
          Chat request sent — waiting for seller to accept
        </p>
      )}

      {request?.status === "declined" && (
        <p className="chat-status-declined">
          Seller declined the chat request
        </p>
      )}

      {request?.status === "accepted" && (
        <>
          <button className="chat-open-btn" onClick={() => setOpen((o) => !o)}>
            {open ? "Close Chat" : "Open Chat"}
          </button>
          {open && (
            <div className="chat-box-wrapper">
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