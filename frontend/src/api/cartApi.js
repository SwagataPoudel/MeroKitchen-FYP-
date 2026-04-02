import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getCart = () => API.get("/cart");
export const addToCart = (productId, quantity = 1) =>
  API.post("/cart/add", { productId, quantity });
export const updateCartItem = (productId, quantity) =>
  API.put("/cart/update", { productId, quantity });
export const removeFromCart = (productId) =>
  API.delete(`/cart/remove/${productId}`);
export const clearCart = () => API.delete("/cart/clear");
