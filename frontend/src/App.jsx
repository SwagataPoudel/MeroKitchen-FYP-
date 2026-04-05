import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageReviews from "./pages/admin/ManageReviews";
import AdminHome from "./pages/admin/AdminHome";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import VerificationRequests from "./pages/admin/VerificationRequests";
import AboutUs from "./pages/AboutUs";
import SellerLanding from "./pages/SellerLanding";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/" replace />;
  return children;
};

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="verifications" element={<VerificationRequests />} />
        </Route>

        <Route
          path="*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/products" element={<BrowseProducts />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/about" element={<AboutUs />} />
                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["seller"]}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/sell-with-us" element={<SellerLanding />} />
                <Route
                  path="/seller/orders"
                  element={
                    <ProtectedRoute allowedRoles={["seller"]}>
                      <SellerOrders />
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
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={["customer", "seller"]}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/users/:id" element={<PublicProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              {location.pathname !== "/auth" && <Footer />}
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;