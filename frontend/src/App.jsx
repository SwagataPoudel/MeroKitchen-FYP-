import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./pages/landing";
import BrowseProducts from "./pages/BrowseProducts";
import ProductDetail from "./pages/ProductDetail";
import SellerDashboard from "./pages/SellerDashboard";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import SellerOrders from "./pages/SellerOrders";
import ScrollToTop from "./components/ScrollToTop";
// Route guard for protected pages
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/products" element={<BrowseProducts />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Seller only */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerOrders />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
