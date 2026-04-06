import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/PublicProfile.css";

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/users/${id}/public`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pub-loading">✨ Loading profile...</div>;
  if (!data) return <div className="pub-loading">User not found.</div>;

  const { user, products, reviews, stats } = data;
  const isSeller = user.role === "seller";

  return (
    <div className="pub-page">
      {/* Hero */}
      <div className="pub-hero">
        <div className="pub-avatar">
          {user.profilePhoto ? (
            <img
              src={`http://localhost:3000${user.profilePhoto}`}
              alt={user.name}
            />
          ) : (
            <div className="pub-avatar-placeholder">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="pub-hero-info">
          <div className="pub-role-badge">
            {isSeller ? "🍳 Seller" : "🛒 Customer"}
          </div>

          <div className="pub-name-row">
            <h1 className="pub-name">
              {isSeller ? user.kitchenName || user.name : user.name}
            </h1>
            {/* ── Verified Badge ── */}
            {isSeller && user.isVerifiedSeller && (
              <span className="verified-badge" title="Verified Homemade Seller">
                ✅ Verified Homemade
              </span>
            )}
          </div>

          {isSeller && user.kitchenName && (
            <p className="pub-subname">by {user.name}</p>
          )}
          {user.city && <p className="pub-city">📍 {user.city}</p>}
          {isSeller && user.openingHours && (
            <p className="pub-hours">🕐 {user.openingHours}</p>
          )}
          {isSeller && (
            <span
              className={`pub-avail ${user.isAvailable ? "open" : "closed"}`}
            >
              {user.isAvailable ? "✅ Accepting Orders" : "🔴 Closed"}
            </span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="pub-stats">
        {isSeller ? (
          <>
            <div className="pub-stat">
              <div className="pub-stat-value">{stats.totalProducts}</div>
              <div className="pub-stat-label">Listings</div>
            </div>
            <div className="pub-stat">
              <div className="pub-stat-value">{stats.totalReviews}</div>
              <div className="pub-stat-label">Reviews</div>
            </div>
            <div className="pub-stat">
              <div className="pub-stat-value">
                {stats.avgRating ? `⭐ ${stats.avgRating}` : "New"}
              </div>
              <div className="pub-stat-label">Avg Rating</div>
            </div>
            {/* ── Verified stat pill ── */}
            {user.isVerifiedSeller && (
              <div className="pub-stat">
                <div className="pub-stat-value">🏅</div>
                <div className="pub-stat-label">Verified</div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="pub-stat">
              <div className="pub-stat-value">{stats.orderCount}</div>
              <div className="pub-stat-label">Orders Placed</div>
            </div>
            <div className="pub-stat">
              <div className="pub-stat-value">{stats.reviewCount}</div>
              <div className="pub-stat-label">Reviews Written</div>
            </div>
            <div className="pub-stat">
              <div className="pub-stat-value">
                {new Date(user.createdAt).toLocaleDateString("en-NP", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="pub-stat-label">Member Since</div>
            </div>
          </>
        )}
      </div>

      {/* Seller: About + Cuisine */}
      {isSeller && (
        <div className="pub-section">
          {user.kitchenDescription && (
            <>
              <h2 className="pub-section-title">About the Kitchen</h2>
              <p className="pub-about">{user.kitchenDescription}</p>
            </>
          )}
          {user.cuisineTypes?.length > 0 && (
            <>
              <h2 className="pub-section-title">Cuisine Types</h2>
              <div className="pub-chips">
                {user.cuisineTypes.map((c) => (
                  <span key={c} className="pub-chip">
                    {c}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Customer: Basic info */}
      {!isSeller && (
        <div className="pub-section">
          <h2 className="pub-section-title">About</h2>
          <p className="pub-about">
            {user.name} has been a member since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-NP", {
              month: "long",
              year: "numeric",
            })}{" "}
            and has placed {stats.orderCount} order
            {stats.orderCount !== 1 ? "s" : ""}.
          </p>
        </div>
      )}

      {/* Seller: Products */}
      {isSeller && products?.length > 0 && (
        <div className="pub-section">
          <h2 className="pub-section-title">Menu ({products.length})</h2>
          <div className="pub-products">
            {products.map((p) => (
              <div
                key={p._id}
                className="pub-product-card"
                onClick={() => navigate(`/products/${p._id}`)}
              >
                {p.photos?.[0] ? (
                  <img
                    src={`http://localhost:3000${p.photos[0]}`}
                    alt={p.name}
                    className="pub-product-img"
                  />
                ) : (
                  <div className="pub-product-placeholder">🍲</div>
                )}
                <div className="pub-product-info">
                  <div className="pub-product-cat">{p.category}</div>
                  <div className="pub-product-name">{p.name}</div>
                  <div className="pub-product-footer">
                    <span className="pub-product-price">Rs. {p.price}</span>
                    {p.ratings?.count > 0 && (
                      <span className="pub-product-rating">
                        ⭐ {p.ratings.average.toFixed(1)} ({p.ratings.count})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seller: Reviews */}
      {isSeller && reviews?.length > 0 && (
        <div className="pub-section">
          <h2 className="pub-section-title">Customer Reviews</h2>
          <div className="pub-reviews">
            {reviews.map((r) => (
              <div key={r._id} className="pub-review-card">
                <div className="pub-review-top">
                  <div className="pub-reviewer">
                    <div className="pub-reviewer-avatar">
                      {r.customer?.profilePhoto ? (
                        <img
                          src={`http://localhost:3000${r.customer.profilePhoto}`}
                          alt=""
                        />
                      ) : (
                        <div className="pub-reviewer-placeholder">
                          {r.customer?.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div
                        className="pub-reviewer-name"
                        onClick={() => navigate(`/users/${r.customer?._id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {r.customer?.name}
                      </div>
                      <div className="pub-review-product">
                        on {r.product?.name}
                      </div>
                    </div>
                  </div>
                  <div className="pub-review-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={s <= r.rating ? "star filled" : "star"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {r.comment && <p className="pub-review-comment">{r.comment}</p>}
                <div className="pub-review-date">
                  {new Date(r.createdAt).toLocaleDateString("en-NP", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
