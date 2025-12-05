// src/pages/admin/AdminProductsPage.jsx
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import {
  getAdminProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../../api/productApi.js";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  stock: "",
  active: true,
};

export default function AdminProductsPage() {
  const axiosPrivate = useAxiosPrivate();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Pagination + search state
  const [page, setPage] = useState(0); // 0-based
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = async (pageArg = page, searchArg = search) => {
    setError("");
    setLoading(true);
    try {
      const res = await getAdminProductsApi(axiosPrivate, {
        page: pageArg,
        size,
        search: searchArg,
      });

      const data = res.data;
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number ?? pageArg ?? 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(0, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price: p.price ?? "",
      stock: p.stock ?? "",
      active: p.active ?? true,
    });
    setMessage("");
    setError("");
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      active: form.active,
    };

    if (isNaN(payload.price) || isNaN(payload.stock)) {
      setError("Price and stock must be valid numbers.");
      return;
    }

    try {
      if (form.id) {
        await updateProductApi(form.id, payload, axiosPrivate);
        setMessage("Product updated.");
      } else {
        await createProductApi(payload, axiosPrivate);
        setMessage("Product created.");
      }
      setForm(emptyForm);
      await loadProducts(page, search);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 403
          ? "Forbidden: only admin can modify products."
          : err.response?.data?.message || "Failed to save product."
      );
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setMessage("");
    if (!window.confirm("Soft delete / deactivate this product?")) return;

    try {
      await deleteProductApi(id, axiosPrivate);
      setMessage("Product deactivated.");
      await loadProducts(page, search);
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    loadProducts(0, searchInput);
  };

  const handlePrevPage = () => {
    if (page > 0) {
      loadProducts(page - 1, search);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      loadProducts(page + 1, search);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Simple admin header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "1rem",
        }}
      >
        <h2>Admin: Manage Products</h2>
        <div style={{ fontSize: "0.9rem" }}>
          <a href="/admin" style={{ marginRight: "1rem" }}>
            Dashboard
          </a>
          <a href="/admin/products" style={{ marginRight: "1rem" }}>
            Products
          </a>
          {/* later you can add /admin/orders, /admin/cart, etc. */}
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* 🔍 Search */}
      <form
        onSubmit={handleSearchSubmit}
        style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}
      >
        <input
          type="text"
          placeholder="Search by name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading products...</p>}

      {/* Product form */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "4px",
          backgroundColor: "#fafafa",
        }}
      >
        <h3>{form.id ? "Edit Product" : "Create Product"}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              style={{ width: "100%", minHeight: "80px" }}
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>Stock</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />{" "}
              Active
            </label>
          </div>

          <button type="submit">
            {form.id ? "Update Product" : "Create Product"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={handleCancel}
              style={{ marginLeft: "1rem" }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Product list table */}
      <h3>Existing Products</h3>
      {products.length === 0 && !loading && <p>No products.</p>}
      {products.length > 0 && (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "0.5rem",
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ddd" }}>ID</th>
                <th style={{ borderBottom: "1px solid #ddd" }}>Name</th>
                <th style={{ borderBottom: "1px solid #ddd" }}>Price</th>
                <th style={{ borderBottom: "1px solid #ddd" }}>Stock</th>
                <th style={{ borderBottom: "1px solid #ddd" }}>Active</th>
                <th style={{ borderBottom: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: "0.3rem" }}>{p.id}</td>
                  <td style={{ padding: "0.3rem" }}>{p.name}</td>
                  <td style={{ padding: "0.3rem" }}>
                    ${Number(p.price || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: "0.3rem" }}>{p.stock}</td>
                  <td style={{ padding: "0.3rem" }}>
                    {p.active ? "Yes" : "No"}
                  </td>
                  <td style={{ padding: "0.3rem" }}>
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button
                      style={{ marginLeft: "0.5rem" }}
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </>
      )}
    </div>
  );
}
