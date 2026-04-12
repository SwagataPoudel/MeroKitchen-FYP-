import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const placeOrder = (data) => API.post("/orders", data);
export const verifyKhaltiPayment = (pidx) =>
  API.post("/orders/verify-payment", { pidx });
export const getMyOrders = () => API.get("/orders/my");
export const getOrderHistory = () => API.get("/orders/my/history");
export const getSellerOrders = () => API.get("/orders/seller");
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const markDelivered = (id) =>
  API.put(`/orders/${id}/status`, { status: "delivered" });
export const getSellerStats = () => API.get("/orders/seller/stats");
export const cancelOrder = (id) =>
  API.put(`/orders/${id}/status`, { status: "cancelled" });