import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const fetchMessages = (roomId) =>
  API.get(`/chat/messages/${roomId}`).then((r) => r.data);

export const sendChatRequest = (productId, sellerId) =>
  API.post("/chat/request", { productId, sellerId }).then((r) => r.data);

export const getChatRequest = (productId) =>
  API.get(`/chat/request/${productId}`).then((r) => r.data);

export const getSellerChatRequests = () =>
  API.get("/chat/requests/seller").then((r) => r.data);

export const updateChatRequest = (requestId, status) =>
  API.put(`/chat/request/${requestId}`, { status }).then((r) => r.data);