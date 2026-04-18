import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Auth from "./pages/public/Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./pages/public/landing";
import CustomerHome from "./pages/customer/CustomerHome";
import BrowseProducts from "./pages/customer/BrowseProducts";
import ProductDetail from "./pages/customer/ProductDetail";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerAnalytics from "./pages/seller/SellerAnalytics";
import Cart from "./pages/customer/Cart";
import MyOrders from "./pages/customer/MyOrders";
import OrderHistory from "./pages/customer/OrderHistory";
import SellerOrders from "./pages/seller/SellerOrders";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/public/Profile";
import PublicProfile from "./pages/public/PublicProfile";
import AboutUs from "./pages/public/AboutUs";
import SellerLanding from "./pages/seller/SellerLanding";
import PaymentVerify from "./pages/payment/PaymentVerify";
import SubscriptionPage from "./pages/payment/SubscriptionPage";
import SubscriptionVerify from "./pages/payment/SubscriptionVerify";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/auth" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "customer") return <Navigate to="/home" replace />;
    if (role === "seller") return <Navigate to="/sell-with-us" replace />;
    if (role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

const SmartHome = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (token && location.pathname === "/") {
    if (role === "customer") return <Navigate to="/home" replace />;
    if (role === "seller") return <Navigate to="/sell-with-us" replace />;
    if (role === "admin") return <Navigate to="/admin" replace />;
  }

  return <Landing />;
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
        />

        <Route
          path="*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<SmartHome />} />

                <Route
                  path="/home"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <CustomerHome />
                    </ProtectedRoute>
                  }
                />

                <Route path="/auth" element={<Auth />} />

                  <Route
                  path="/products"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <BrowseProducts />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/products/:id"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <ProductDetail />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<AboutUs />} />

                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["seller"]}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/analytics"
                  element={
                    <ProtectedRoute allowedRoles={["seller"]}>
                      <SellerAnalytics />
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
                  path="/order-history"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/verify"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <PaymentVerify />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <ProtectedRoute allowedRoles={["seller"]}>
                      <SubscriptionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription/verify"
                  element={
                    <ProtectedRoute allowedRoles={["seller"]}>
                      <SubscriptionVerify />
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