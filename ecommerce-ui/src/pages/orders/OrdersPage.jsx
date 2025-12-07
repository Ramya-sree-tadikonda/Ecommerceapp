
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { getOrdersApi } from "../../api/orderApi.js";
import { extractApiErrorMessage } from "../../utils/errorUtils.js";
import { useToast } from "../../toast/ToastContext.jsx";

export default function OrdersPage() {
  const axiosPrivate = useAxiosPrivate();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("NEWEST"); 

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrdersApi(axiosPrivate);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      const msg = extractApiErrorMessage(err, "Failed to load orders.");
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    
  }, []);

  
  const getOrderDateValue = (order) => {
    const raw =
      order.createdAt ||
      order.orderDate ||
      order.placedAt ||
      order.created_at ||
      null;

    if (!raw) return null;

    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return null;

    return d;
  };

  
  const formatDate = (date) => {
    if (!date) return "-";
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString(); 
  };

  
  const getOrderTitle = (order) => {
    if (order.items && order.items.length > 0) {
      const first = order.items[0];
      const name = first.product?.name || first.productName;
      if (name) return name;
    }
    return `Order #${order.id}`;
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const da = getOrderDateValue(a);
    const db = getOrderDateValue(b);

    // If one date is missing, push it to the end
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;

    if (sortOrder === "NEWEST") {
      return db - da; // latest first
    } else {
      return da - db; // oldest first
    }
  });

  if (loading) {
    return (
      <div style={{ maxWidth: "900px", margin: "2rem auto" }}>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto" }}>
      {/* Header row with sort on the right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ margin: 0 }}>My Orders</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.9rem", color: "#555" }}>Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="NEWEST">Newest first</option>
            <option value="OLDEST">Oldest first</option>
          </select>
        </div>
      </div>

      {sortedOrders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {sortedOrders.map((order) => {
            const date = getOrderDateValue(order);
            const title = getOrderTitle(order);

            return (
              <div
                key={order.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "1rem",
                  backgroundColor: "#fafafa",
                }}
              >
                {/* Top row: Title + date + status + total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#555",
                        marginTop: "0.15rem",
                      }}
                    >
                      <div>
                        <strong>Order #</strong> {order.id}
                      </div>
                      <div>
                        <strong>Placed on:</strong> {formatDate(date)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {order.status && (
                      <span
                        style={{
                          fontSize: "0.85rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "999px",
                          border: "1px solid #ccc",
                          backgroundColor: "#fff",
                        }}
                      >
                        {order.status}
                      </span>
                    )}
                    <div style={{ marginTop: "0.25rem" }}>
                      <strong>
                        Total: $
                        {Number(order.totalAmount ?? order.total ?? 0).toFixed(
                          2
                        )}
                      </strong>
                    </div>
                  </div>
                </div>

             
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
