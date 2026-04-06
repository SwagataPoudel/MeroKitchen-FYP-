import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getAllProducts = (filters = {}) =>
  API.get("/products", { params: filters });

export const getNearbyProducts = (params = {}) =>
  API.get("/products/nearby", { params });

export const getProductById = (id) => API.get(`/products/${id}`);

export const getMyProducts = () => API.get("/products/my");

export const createProduct = (formData) =>
  API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProduct = (id) => API.delete(`/products/${id}`);