import { useEffect, useState } from "react";
import { getAllProducts, getNearbyProducts } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../css/BrowseProducts.css";

// Fix Leaflet marker icon bug with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CATEGORIES = [
  "all",
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "desserts",
  "drinks",
];

export default function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    availability: "",
  });

  const [nearbyMode, setNearbyMode] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [maxDistance, setMaxDistance] = useState(3000);
  const [showMap, setShowMap] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category && filters.category !== "all")
        params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.availability !== "")
        params.availability = filters.availability;
      const res = await getAllProducts(params);
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearby = async (coords, dist) => {
    setLoading(true);
    try {
      const res = await getNearbyProducts({
        lat: coords.lat,
        lng: coords.lng,
        maxDistance: dist || maxDistance,
        ...(filters.category !== "all" && { category: filters.category }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNearMe = () => {
    if (nearbyMode) {
      setNearbyMode(false);
      setUserCoords(null);
      setShowMap(false);
      fetchProducts();
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setNearbyMode(true);
        setLocationLoading(false);
        fetchNearby(coords);
      },
      () => {
        alert("Location access denied. Please allow location in your browser.");
        setLocationLoading(false);
      },
    );
  };

  useEffect(() => {
    if (nearbyMode && userCoords) {
      fetchNearby(userCoords);
    } else if (!nearbyMode) {
      fetchProducts();
    }
  }, [filters]);

  const formatDistance = (m) =>
    m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`;

  return (
    <>
      <div style={{ paddingTop: 0 }}>
        <div className="browse-hero">
          <div className="section-label">Fresh & Homemade</div>
          <h1>
            Discover <em>Today's</em> Menu
          </h1>
          <p>Real meals crafted with love by home cooks across Kathmandu.</p>
        </div>

        <div className="browse-body">
          {/* Filter Bar */}
          <div className="filter-bar">
            <label>Category</label>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`filter-tab ${filters.category === c ? "active" : ""}`}
                onClick={() => setFilters({ ...filters, category: c })}
              >
                {c}
              </button>
            ))}

            <div className="divider" />
            <label>Price</label>
            <input
              className="price-input"
              type="number"
              placeholder="Min Rs."
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />
            <input
              className="price-input"
              type="number"
              placeholder="Max Rs."
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />

            <div className="divider" />
            <select
              className="avail-select"
              onChange={(e) =>
                setFilters({ ...filters, availability: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>

            <div className="divider" />

            {/* Near Me Button */}
            <button
              className={`filter-tab ${nearbyMode ? "active" : ""}`}
              onClick={handleNearMe}
              disabled={locationLoading}
              style={{
                background: nearbyMode ? "#4a9c5d" : "",
                color: nearbyMode ? "#fff" : "",
                fontWeight: 600,
              }}
            >
              {locationLoading
                ? "📡 Locating..."
                : nearbyMode
                  ? "✅ Near Me ON"
                  : "📍 Near Me"}
            </button>

            {nearbyMode && (
              <>
                <select
                  className="avail-select"
                  value={maxDistance}
                  onChange={(e) => {
                    const d = parseInt(e.target.value);
                    setMaxDistance(d);
                    fetchNearby(userCoords, d);
                  }}
                >
                  <option value={1000}>Within 1 km</option>
                  <option value={3000}>Within 3 km</option>
                  <option value={5000}>Within 5 km</option>
                  <option value={10000}>Within 10 km</option>
                </select>

                <button
                  className="filter-tab"
                  onClick={() => setShowMap((v) => !v)}
                  style={{ fontSize: "0.8rem" }}
                >
                  {showMap ? "🗺️ Hide Map" : "🗺️ Show Map"}
                </button>
              </>
            )}
          </div>

          {/* Nearby Map View */}
          {nearbyMode && showMap && userCoords && (
            <div
              style={{
                margin: "16px 0",
                borderRadius: "12px",
                overflow: "hidden",
                height: "300px",
              }}
            >
              <MapContainer
                center={[userCoords.lat, userCoords.lng]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Customer marker */}
                <Marker position={[userCoords.lat, userCoords.lng]}>
                  <Popup>📍 You are here</Popup>
                </Marker>

                {/* Radius circle */}
                <Circle
                  center={[userCoords.lat, userCoords.lng]}
                  radius={maxDistance}
                  pathOptions={{ color: "#e07b39", fillOpacity: 0.08 }}
                />

                {/* Kitchen markers */}
                {products.map((p) =>
                  p.seller?.storeLocation?.coordinates?.length === 2 ? (
                    <Marker
                      key={p._id}
                      position={[
                        p.seller.storeLocation.coordinates[1],
                        p.seller.storeLocation.coordinates[0],
                      ]}
                    >
                      <Popup>
                        🍳{" "}
                        <strong>{p.seller.kitchenName || p.seller.name}</strong>
                        <br />
                        {p.name} — Rs. {p.price}
                        <br />
                        📍 {formatDistance(p.distanceMeters)} away
                      </Popup>
                    </Marker>
                  ) : null,
                )}
              </MapContainer>
            </div>
          )}

          {/* Nearby mode info banner */}
          {nearbyMode && (
            <div
              style={{
                background: "#fff7ed",
                border: "1px solid #f4c99a",
                borderRadius: "10px",
                padding: "10px 16px",
                marginBottom: "12px",
                fontSize: "0.88rem",
                color: "#a05c2e",
              }}
            >
              📍 Showing kitchens within{" "}
              <strong>{formatDistance(maxDistance)}</strong> of your location —
              sorted by nearest first.
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <p className="loading-text">✨ Loading delicious food...</p>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "4rem" }}>🍽️</div>
              <p>
                {nearbyMode
                  ? "No kitchens found nearby. Try increasing the distance."
                  : "No dishes found. Try different filters."}
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="product-card"
                  onClick={() => navigate(`/products/${p._id}`)}
                >
                  {p.photos?.[0] ? (
                    <img
                      src={`http://localhost:3000${p.photos[0]}`}
                      alt={p.name}
                      className="product-img"
                    />
                  ) : (
                    <div className="product-img-placeholder">🍲</div>
                  )}
                  <div className="product-body">
                    <div className="product-cat">{p.category}</div>
                    <div className="product-name">{p.name}</div>
                    <div
                      className="product-seller"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/users/${p.seller?._id}`);
                      }}
                    >
                      by{" "}
                      <span
                        style={{
                          color: "var(--spice)",
                          textDecoration: "underline",
                        }}
                      >
                        {p.seller?.name}
                      </span>
                    </div>
                    <div className="product-desc">
                      {p.description.slice(0, 80)}...
                    </div>
                    <div className="product-footer">
                      <span className="product-price">Rs. {p.price}</span>
                      <span
                        className="avail-badge"
                        style={{
                          background: p.availability ? "#4a9c5d" : "#c0392b",
                        }}
                      >
                        {p.availability ? "Available" : "Unavailable"}
                      </span>
                      {/* Distance badge */}
                      {nearbyMode && p.distanceMeters != null && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            background: "#fff7ed",
                            color: "#e07b39",
                            borderRadius: "20px",
                            padding: "2px 8px",
                            fontWeight: 600,
                          }}
                        >
                          📍 {formatDistance(p.distanceMeters)}
                        </span>
                      )}
                    </div>
                    <div className="prep-time">
                      ⏱ {p.preparationTime} mins prep
                    </div>
                    {p.ratings?.count > 0 && (
                      <div className="product-rating">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={
                              s <= Math.round(p.ratings.average)
                                ? "star filled"
                                : "star"
                            }
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-text">
                          {p.ratings.average.toFixed(1)} ({p.ratings.count})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
