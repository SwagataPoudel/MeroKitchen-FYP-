import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import { fetchMessages } from "../api/chatApi";

export default function ChatBox({ currentUserId, currentUserRole, otherUserId, roomId: propRoomId }) {
  const roomId = propRoomId || [currentUserId, otherUserId].sort().join("_");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    if (!roomId) return;

    fetchMessages(roomId).then(setMessages).catch(console.error);

    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();
    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msgData = { roomId, text: input };  // removed senderId/senderRole — server gets from JWT
    socket.emit("send_message", msgData);
    setInput("");
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "400px",
      border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontFamily: "sans-serif",
    }}>
      <div style={{ padding: "0.75rem 1rem", backgroundColor: "#4F46E5", color: "#fff", fontWeight: "600" }}>
        Chat
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", backgroundColor: "#f9fafb" }}>
        {messages.length === 0 && (
          <p style={{ color: "#9ca3af", textAlign: "center", marginTop: "2rem" }}>
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.senderId?.toString() === currentUserId?.toString();
          return (
            <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: "0.5rem" }}>
              <span style={{
                maxWidth: "70%", padding: "0.5rem 0.9rem", fontSize: "0.9rem", lineHeight: "1.4",
                borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                backgroundColor: isMe ? "#4F46E5" : "#e5e7eb",
                color: isMe ? "#fff" : "#111",
              }}>
                {msg.text}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", borderTop: "1px solid #e5e7eb", padding: "0.6rem", backgroundColor: "#fff", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: "8px", padding: "0.5rem 0.75rem", outline: "none", fontSize: "0.9rem" }}
        />
        <button onClick={sendMessage} style={{
          backgroundColor: "#4F46E5", color: "#fff", border: "none",
          borderRadius: "8px", padding: "0.5rem 1.1rem", cursor: "pointer", fontWeight: "600",
        }}>
          Send
        </button>
      </div>
    </div>
  );
}