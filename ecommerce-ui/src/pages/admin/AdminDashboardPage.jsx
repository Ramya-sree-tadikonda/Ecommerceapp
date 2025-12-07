
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { getAdminStatsApi } from "../../api/adminStatsApi.js";

export default function AdminDashboardPage() {
  const axiosPrivate = useAxiosPrivate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getAdminStatsApi(axiosPrivate);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [axiosPrivate]);

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
      <h2>Admin Dashboard</h2>
      {loading && <p>Loading stats...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <StatCard
            label="Total Orders"
            value={stats.totalOrders}
          />
          <StatCard
            label="Total Revenue"
            value={`$${Number(stats.totalRevenue ?? 0).toFixed(2)}`}
          />
          <StatCard
            label="Today's Orders"
            value={stats.todayOrders}
          />
          <StatCard
            label="Paid Orders"
            value={stats.paidOrders}
          />
          <StatCard
            label="Shipped Orders"
            value={stats.shippedOrders}
          />
          <StatCard
            label="Cancelled Orders"
            value={stats.cancelledOrders}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        backgroundColor: "#fafafa",
      }}
    >
      <div style={{ fontSize: "0.9rem", color: "#555" }}>{label}</div>
      <div style={{ fontSize: "1.4rem", fontWeight: 600, marginTop: "0.25rem" }}>
        {value}
      </div>
    </div>
  );
}
