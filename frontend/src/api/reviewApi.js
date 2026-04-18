import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const submitReview = (data) => API.post("/reviews", data);
export const getProductReviews = (productId) => API.get(`/reviews/product/${productId}`);
export const getMyReviews = () => API.get("/reviews/my-reviews");