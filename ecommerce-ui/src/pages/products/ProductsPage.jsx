// src/pages/catalog/ProductsPage.jsx
import { useEffect, useState } from "react";
import { getProductsApi } from "../../api/productApi.js";
import { addToCartApi } from "../../api/cartApi.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import useAuth from "../../hooks/useAuth.jsx";
import { extractApiErrorMessage } from "../../utils/errorUtils.js";
import { useToast } from "../../toast/ToastContext.jsx";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0); // 0-based
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [quantities, setQuantities] = useState({});

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { showToast } = useToast();

  const isLoggedIn = !!auth?.accessToken;

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProductsApi({ page, size, search });
      const data = res.data;
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);

      const q = {};
      (data.content || []).forEach((p) => {
        q[p.id] = 1;
      });
      setQuantities(q);
    } catch (err) {
      console.error("Failed to load products:", err);
      const msg = extractApiErrorMessage(err, "Failed to load products.");
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  };

  const handleQuantityChange = (productId, value) => {
    const num = Number(value);
    if (Number.isNaN(num) || num <= 0) return;
    setQuantities((prev) => ({
      ...prev,
      [productId]: num,
    }));
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      showToast("error", "Please login to add items to cart.");
      return;
    }

    const quantity = quantities[productId] || 1;

    try {
      await addToCartApi(axiosPrivate,productId,quantity);
      showToast("success", "Item added to cart.");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      const msg = extractApiErrorMessage(err, "Failed to add to cart.");
      showToast("error", msg);
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto" }}>
      <h2>Products</h2>

      {/* Search */}
      <form
        onSubmit={handleSearchSubmit}
        style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}
      >
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading products...</p>}
      {!loading && products.length === 0 && (
        <p>No products found. Try a different search.</p>
      )}

      {/* Product grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{p.name}</h3>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                {p.description}
              </p>
            </div>

            <div style={{ marginTop: "0.5rem" }}>
              <div>
                <strong>${Number(p.price ?? 0).toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#777" }}>
                Stock: {p.stock ?? 0}
              </div>
            </div>

            <div
              style={{
                marginTop: "0.75rem",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <input
                type="number"
                min="1"
                value={quantities[p.id] || 1}
                onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                style={{ width: "60px" }}
              />
              {isLoggedIn && (
                <button
                  style={{ fontSize: "0.85rem" }}
                  onClick={() => handleAddToCart(p.id)}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <button onClick={handlePrevPage} disabled={page === 0}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
