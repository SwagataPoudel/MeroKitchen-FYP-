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

  if (token) {
    if (role === "customer") return <Navigate to="/home" replace />;
    if (role === "seller") return <Navigate to="/sell-with-us" replace />;
    if (role === "admin") return <Navigate to="/admin" replace />;
  }

  return <Landing />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <>
      <Header />
      {children}
      {location.pathname !== "/auth" && <Footer />}
    </>
  );
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin - no Header/Footer */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* All other routes - with Header/Footer */}
        <Route path="/" element={<Layout><SmartHome /></Layout>} />
        <Route path="/auth" element={<Layout><Auth /></Layout>} />
        <Route path="/about" element={<Layout><AboutUs /></Layout>} />
        <Route path="/users/:id" element={<Layout><PublicProfile /></Layout>} />

        <Route path="/home" element={
          <Layout>
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerHome />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/products" element={
          <Layout>
            <ProtectedRoute allowedRoles={["customer"]}>
              <BrowseProducts />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/products/:id" element={
          <Layout>
            <ProtectedRoute allowedRoles={["customer"]}>
              <ProductDetail />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/cart" element={
          <Layout>
            <ProtectedRoute allowedRoles={["customer"]}>
              <Cart />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/orders" element={
          <Layout>
            <ProtectedRoute allowedRoles={["customer"]}>
              <MyOrders />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/order-history" element={
          <Layout>
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderHistory />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/payment/verify" element={
          <Layout>
            <ProtectedRoute allowedRoles={["customer"]}>
              <PaymentVerify />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/sell-with-us" element={
          <Layout>
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLanding />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/seller/dashboard" element={
          <Layout>
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/seller/analytics" element={
          <Layout>
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerAnalytics />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/seller/orders" element={
          <Layout>
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerOrders />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/subscription" element={
          <Layout>
            <ProtectedRoute allowedRoles={["seller"]}>
              <SubscriptionPage />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/subscription/verify" element={
          <Layout>
            <ProtectedRoute allowedRoles={["seller"]}>
              <SubscriptionVerify />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/profile" element={
          <Layout>
            <ProtectedRoute allowedRoles={["customer", "seller"]}>
              <Profile />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;