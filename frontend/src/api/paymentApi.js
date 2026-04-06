import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const verifyKhaltiPayment = (pidx) =>
  API.post("/orders/verify-payment", { pidx });