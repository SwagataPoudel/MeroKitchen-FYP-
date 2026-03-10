import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (!isHome) {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

        .header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: ${scrolled ? "12px 48px" : "24px 48px"};
          background: ${scrolled ? "rgba(255,250,240,0.97)" : "transparent"};
          backdrop-filter: ${scrolled ? "blur(12px)" : "none"};
          box-shadow: ${scrolled ? "0 2px 24px rgba(180,120,60,0.08)" : "none"};
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .header-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer; }
        .logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #c8753a, #e8a055);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(200,117,58,0.3);
          flex-shrink: 0;
        }
        .logo-text { font-family: 'Playfair Display', serif; font-size: 1.55rem; color: #2d1a0e; letter-spacing: 0.02em; }
        .logo-text span { color: #c8753a; font-style: italic; }

        nav { display: flex; align-items: center; gap: 32px; }

        .nav-link {
          font-family: 'Lato', sans-serif;
          font-size: 0.88rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4a3020;
          background: none; border: none; cursor: pointer;
          position: relative; transition: color 0.2s; padding: 0;
        }
        .nav-link::after {
          content: ''; position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 2px;
          background: #c8753a;
          transition: width 0.3s ease;
        }
        .nav-link:hover { color: #c8753a; }
        .nav-link:hover::after { width: 100%; }

        .header-cta {
          font-family: 'Lato', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: #2d1a0e;
          color: #fff8ef;
          border: none;
          padding: 11px 26px;
          border-radius: 50px;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
        }
        .header-cta:hover { background: #c8753a; transform: translateY(-1px); }

        .header-cta-outline {
          font-family: 'Lato', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: transparent;
          color: #2d1a0e;
          border: 2px solid #2d1a0e;
          padding: 9px 22px;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .header-cta-outline:hover { background: #2d1a0e; color: #fff8ef; }

        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
        .hamburger span { display: block; width: 24px; height: 2px; background: #2d1a0e; transition: all 0.3s; }

        .mobile-menu {
          display: none; position: fixed; inset: 0;
          background: #fffaf0; z-index: 99;
          flex-direction: column; align-items: center; justify-content: center;
          gap: 28px; animation: fadeIn 0.3s ease;
        }
        .mobile-menu.open { display: flex; }
        .close-btn { position: absolute; top: 24px; right: 32px; background: none; border: none; font-size: 2rem; color: #2d1a0e; cursor: pointer; }
        .mobile-nav-link { font-family: 'Playfair Display', serif; font-size: 2rem; color: #2d1a0e; text-decoration: none; background: none; border: none; cursor: pointer; transition: color 0.2s; }
        .mobile-nav-link:hover { color: #c8753a; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 768px) {
          .header { padding: ${scrolled ? "12px 24px" : "20px 24px"}; }
          nav, .header-cta, .header-cta-outline { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <header className="header">
        <div className="header-logo" onClick={() => navigate("/")}>
          <div className="logo-icon">🍲</div>
          <div className="logo-text">Mero <span>Kitchen</span></div>
        </div>

        <nav>
          {/* Always visible */}
          <button className="nav-link" onClick={() => navigate("/landing")}>Home</button>

          {/* Customer nav */}
          {token && role === "customer" && (
            <>
              <button className="nav-link" onClick={() => navigate("/products")}>Browse</button>
              <button className="nav-link" onClick={() => navigate("/orders")}>My Orders</button>
              <button className="nav-link" onClick={() => navigate("/cart")}>Cart 🛒</button>
            </>
          )}

          {/* Seller nav */}
          {token && role === "seller" && (
            <>
              <button className="nav-link" onClick={() => navigate("/seller/dashboard")}>My Listings</button>
              <button className="nav-link" onClick={() => navigate("/seller/orders")}>Orders</button>
            </>
          )}

          {/* Admin nav */}
          {token && role === "admin" && (
            <button className="nav-link" onClick={() => navigate("/admin")}>Dashboard</button>
          )}
        </nav>

        {/* Right CTA */}
        {!token ? (
          <button className="header-cta" onClick={() => navigate("/auth")}>Register / Login</button>
        ) : (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button className="header-cta-outline" onClick={handleLogout}>Logout</button>
          </div>
        )}

        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </header>

    
    </>
  );
};

export default Header;