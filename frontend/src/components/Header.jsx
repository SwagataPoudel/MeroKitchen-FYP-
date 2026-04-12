import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logoImg from "../assets/logo.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    setMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div
        className="header-logo"
        onClick={() => {
          if (role === "seller") navigate("/sell-with-us");
          else navigate("/");
        }}
      >
        <div className="logo-icon">
          <img
            src={logoImg}
            alt="Mero Kitchen"
            style={{ width: "36px", height: "36px", objectFit: "contain" }}
          />
        </div>
        <div className="logo-text">
          Mero <span>Kitchen</span>
        </div>
      </div>

      <nav>
        <button
          className="nav-link"
          onClick={() => {
            if (role === "seller") navigate("/sell-with-us");
            else navigate("/");
          }}
        >
          Home
        </button>
        <button className="nav-link" onClick={() => navigate("/about")}>
          About Us
        </button>

        {token && role === "customer" && (
          <>
            <button className="nav-link" onClick={() => navigate("/products")}>
              Browse
            </button>
            <button className="nav-link" onClick={() => navigate("/orders")}>
              My Orders
            </button>
            <button className="nav-link" onClick={() => navigate("/order-history")}>
              History
            </button>
            <button className="nav-link" onClick={() => navigate("/cart")}>
              Cart
            </button>
            <button className="nav-link" onClick={() => navigate("/profile")}>
              Profile
            </button>
          </>
        )}

        {token && role === "seller" && (
          <>
            <button
              className="nav-link"
              onClick={() => navigate("/seller/dashboard")}
            >
              My Listings
            </button>
            <button
              className="nav-link"
              onClick={() => navigate("/seller/orders")}
            >
              Orders
            </button>
            <button className="nav-link" onClick={() => navigate("/profile")}>
              Profile
            </button>
            <button
              className="nav-link"
              onClick={() => navigate("/seller/analytics")}
            >
              Dashboard
            </button>
          </>
        )}
      </nav>

      {!token ? (
        <button className="header-cta" onClick={() => navigate("/auth")}>
          Register / Login
        </button>
      ) : (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button className="header-cta-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <button
        className="hamburger"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
};

export default Header;