import { useEffect, useState } from "react";
import { getSellerChatRequests, updateChatRequest } from "../api/chatApi";
import ChatBox from "./ChatBox";
import "../css/SellerChatRequests.css";

export default function SellerChatRequests() {
  const currentUserId = localStorage.getItem("userId");
  const [requests, setRequests] = useState([]);
  const [openChat, setOpenChat] = useState(null);

  useEffect(() => {
    getSellerChatRequests().then(setRequests).catch(console.error);
  }, []);

  const handleRespond = async (requestId, status) => {
    try {
      const updated = await updateChatRequest(requestId, status);
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: updated.status } : r))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (requests.length === 0) return null;

  return (
    <div className="chat-requests-wrapper">
      <h3 className="chat-requests-title">Chat Requests</h3>

      {requests.map((req) => {
        const roomId = `product_${req.productId?._id}_${[currentUserId, req.customerId?._id].sort().join("_")}`;
        const isOpen = openChat === req._id;

        return (
          <div key={req._id} className="chat-request-card">
            <div className="chat-request-info">
              <strong>{req.customerId?.name}</strong> wants to chat about{" "}
              <strong>{req.productId?.name}</strong>
            </div>

            {req.status === "pending" && (
              <div className="chat-request-actions">
                <button
                  className="chat-req-accept-btn"
                  onClick={() => handleRespond(req._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="chat-req-decline-btn"
                  onClick={() => handleRespond(req._id, "declined")}
                >
                  Decline
                </button>
              </div>
            )}

            {req.status === "declined" && (
              <span className="chat-req-declined-label">Declined</span>
            )}

            {req.status === "accepted" && (
              <>
                <button
                  className="chat-req-open-btn"
                  onClick={() => setOpenChat(isOpen ? null : req._id)}
                >
                  {isOpen ? "Close Chat" : "Open Chat"}
                </button>
                {isOpen && (
                  <div className="chat-req-chatbox">
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