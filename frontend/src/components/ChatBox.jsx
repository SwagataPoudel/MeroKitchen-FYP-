import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import { fetchMessages } from "../api/chatApi";
import "../css/ChatBox.css";

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



  const sendMessage = () => {
    if (!input.trim()) return;
    const msgData = { roomId, text: input };
    socket.emit("send_message", msgData);
    setInput("");
  };

  return (
    <div className="chatbox-wrapper">
      <div className="chatbox-header">Chat</div>

      <div className="chatbox-messages">
        {messages.length === 0 && (
          <p className="chatbox-empty">No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.senderId?.toString() === currentUserId?.toString();
          return (
            <div key={i} className={`chatbox-message ${isMe ? "me" : "other"}`}>
              <span className="chatbox-bubble">{msg.text}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chatbox-input-row">
        <input
          className="chatbox-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button className="chatbox-send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}