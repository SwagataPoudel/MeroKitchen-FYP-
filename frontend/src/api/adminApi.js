import axios from "axios";

const BASE_URL = "http://localhost:3000/admin";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

// Stats
export const fetchDashboardStats = () =>
  axios.get(`${BASE_URL}/stats`, getAuthHeader());

// Users
export const fetchAllUsers = () =>
  axios.get(`${BASE_URL}/users`, getAuthHeader());

export const deleteUser = (id) =>
  axios.delete(`${BASE_URL}/users/${id}`, getAuthHeader());

export const updateUserRole = (id, role) =>
  axios.patch(`${BASE_URL}/users/${id}/role`, { role }, getAuthHeader());

// Orders
export const fetchAllOrders = () =>
  axios.get(`${BASE_URL}/orders`, getAuthHeader());

export const updateOrderStatus = (id, status) =>
  axios.patch(`${BASE_URL}/orders/${id}/status`, { status }, getAuthHeader());

// Products
export const fetchAllProducts = () =>
  axios.get(`${BASE_URL}/products`, getAuthHeader());

export const deleteProduct = (id) =>
  axios.delete(`${BASE_URL}/products/${id}`, getAuthHeader());

export const toggleProductAvailability = (id) =>
  axios.patch(`${BASE_URL}/products/${id}/availability`, {}, getAuthHeader());

// Reviews
export const fetchAllReviews = () =>
  axios.get(`${BASE_URL}/reviews`, getAuthHeader());

export const deleteReview = (id) =>
  axios.delete(`${BASE_URL}/reviews/${id}`, getAuthHeader());

// Verifications (NEW)
export const fetchVerificationRequests = () =>
  axios.get(`${BASE_URL}/verifications`, getAuthHeader());

export const updateVerificationStatus = (id, status, note = "") =>
  axios.patch(`${BASE_URL}/verifications/${id}`, { status, note }, getAuthHeader());