import axios from "axios";

const BASE_URL = "http://localhost:3000/admin";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
});

// ── Dashboard
export const fetchDashboardStats = () =>
  axios.get(`${BASE_URL}/stats`, getAuthHeader());

// ── Users
export const fetchAllUsers = (params = {}) =>
  axios.get(`${BASE_URL}/users`, { ...getAuthHeader(), params });

export const fetchUserById = (id) =>
  axios.get(`${BASE_URL}/users/${id}`, getAuthHeader());

export const deleteUser = (id) =>
  axios.delete(`${BASE_URL}/users/${id}`, getAuthHeader());

export const updateUserRole = (id, role) =>
  axios.patch(`${BASE_URL}/users/${id}/role`, { role }, getAuthHeader());

export const updateUserProfile = (id, data) =>
  axios.patch(`${BASE_URL}/users/${id}/profile`, data, getAuthHeader());

export const toggleUserAvailability = (id) =>
  axios.patch(`${BASE_URL}/users/${id}/availability`, {}, getAuthHeader());

// ── Orders
export const fetchAllOrders = (params = {}) =>
  axios.get(`${BASE_URL}/orders`, { ...getAuthHeader(), params });

export const fetchOrderById = (id) =>
  axios.get(`${BASE_URL}/orders/${id}`, getAuthHeader());

export const updateOrderStatus = (id, status) =>
  axios.patch(`${BASE_URL}/orders/${id}/status`, { status }, getAuthHeader());

export const updateOrderPaymentStatus = (id, paymentStatus) =>
  axios.patch(
    `${BASE_URL}/orders/${id}/payment-status`,
    { paymentStatus },
    getAuthHeader(),
  );

export const deleteOrder = (id) =>
  axios.delete(`${BASE_URL}/orders/${id}`, getAuthHeader());

export const bulkUpdateOrderStatus = (ids, status) =>
  axios.patch(
    `${BASE_URL}/orders/bulk/status`,
    { ids, status },
    getAuthHeader(),
  );

// ── Products
export const fetchAllProducts = (params = {}) =>
  axios.get(`${BASE_URL}/products`, { ...getAuthHeader(), params });

export const fetchProductById = (id) =>
  axios.get(`${BASE_URL}/products/${id}`, getAuthHeader());

export const updateProduct = (id, data) =>
  axios.patch(`${BASE_URL}/products/${id}`, data, getAuthHeader());

export const deleteProduct = (id) =>
  axios.delete(`${BASE_URL}/products/${id}`, getAuthHeader());

export const toggleProductAvailability = (id) =>
  axios.patch(`${BASE_URL}/products/${id}/availability`, {}, getAuthHeader());

// ── Reviews
export const fetchAllReviews = (params = {}) =>
  axios.get(`${BASE_URL}/reviews`, { ...getAuthHeader(), params });

export const deleteReview = (id) =>
  axios.delete(`${BASE_URL}/reviews/${id}`, getAuthHeader());

// ── Verifications
export const fetchVerificationRequests = () =>
  axios.get(`${BASE_URL}/verifications`, getAuthHeader());

// ── Subscriptions
export const expireSellerSubscription = (id) =>
  axios.patch(`${BASE_URL}/users/${id}/expire-subscription`, {}, getAuthHeader());

export const updateVerificationStatus = (id, status, note = "") =>
  axios.patch(
    `${BASE_URL}/verifications/${id}`,
    { status, note },
    getAuthHeader(),
  );
