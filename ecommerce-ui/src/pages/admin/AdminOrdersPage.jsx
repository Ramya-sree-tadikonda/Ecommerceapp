
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import {
  getAdminOrdersApi,
  updateAdminOrderStatusApi,
} from "../../api/orderApi.js";
import { useToast } from "../../toast/ToastContext.jsx";

const ORDER_STATUSES = ["PLACED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const axiosPrivate = useAxiosPrivate();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [sort, setSort] = useState("desc"); // desc = newest
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const loadOrders = async (sortArg = sort) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminOrdersApi(axiosPrivate, sortArg);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load admin orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders("desc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeStatus = async (orderId, newStatus) => {
    setSavingId(orderId);
    try {
      await updateAdminOrderStatusApi(axiosPrivate, orderId, newStatus);
      showToast("success", `Order #${orderId} status updated to ${newStatus}.`);
      // update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("error", "Failed to update order status.");
    } finally {
      setSavingId(null);
    }
  };

  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
      <h2>Admin: Orders</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          margin: "1rem 0",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span style={{ marginRight: "0.5rem" }}>Sort:</span>
          <select
            value={sort}
            onChange={(e) => {
              const val = e.target.value;
              setSort(val);
              loadOrders(val);
            }}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>

        <div>
          <span style={{ marginRight: "0.5rem" }}>Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {loading && <span>Loading...</span>}
      </div>

      {filteredOrders.length === 0 && !loading && <p>No orders found.</p>}

      {filteredOrders.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "0.5rem",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Placed On</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Items (first)</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => {
              const firstItem = (o.items && o.items[0]) || null;
              return (
                <tr key={o.id}>
                  <td style={tdStyle}>{o.id}</td>
                  <td style={tdStyle}>{o.userEmail || "-"}</td>
                  <td style={tdStyle}>{formatDate(o.createdAt)}</td>
                  <td style={tdStyle}>
                    ${Number(o.totalAmount ?? 0).toFixed(2)}
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={o.status || "PLACED"}
                      onChange={(e) =>
                        handleChangeStatus(o.id, e.target.value)
                      }
                      disabled={savingId === o.id}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle}>
                    {firstItem
                      ? `${firstItem.productName || ""} x${firstItem.quantity}`
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #ddd",
  padding: "0.5rem",
  textAlign: "left",
  fontSize: "0.9rem",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "0.5rem",
  fontSize: "0.9rem",
};
