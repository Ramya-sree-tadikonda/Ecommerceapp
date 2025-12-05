// src/pages/cart/CartPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import {
  getCartApi,
  updateCartItemApi,
  removeCartItemApi,
} from "../../api/cartApi.js";

export default function CartPage() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadCart = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await getCartApi(axiosPrivate);
      setCartItems(res.data || []);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setError("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (itemId, productId, value) => {
    const qty = Number(value);
    if (Number.isNaN(qty) || qty <= 0) return;

    setUpdating(true);
    try {
      await updateCartItemApi(axiosPrivate, productId, qty);
      // update local state
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: qty } : item
        )
      );
    } catch (err) {
      console.error("Failed to update cart item:", err);
      setError("Failed to update cart item.");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (productId) => {
    setUpdating(true);
    try {
      await removeCartItemApi(axiosPrivate, productId);
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      setError("Failed to remove cart item.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    // just go to Stripe + address page
    navigate("/checkout");
  };

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.product?.price ?? 0);
    return sum + price * (item.quantity ?? 0);
  }, 0);

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
        <h2>My Cart</h2>
        <p>Your cart is empty. Go to Products and add some items!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>My Cart</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "1rem",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
              Product
            </th>
            <th style={{ borderBottom: "1px solid #ddd" }}>Price</th>
            <th style={{ borderBottom: "1px solid #ddd" }}>Quantity</th>
            <th style={{ borderBottom: "1px solid #ddd" }}>Total</th>
            <th style={{ borderBottom: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const price = Number(item.product?.price ?? 0);
            const lineTotal = price * (item.quantity ?? 0);
            return (
              <tr key={item.id}>
                <td style={{ padding: "0.5rem 0" }}>
                  {item.product?.name || "Product"}
                </td>
                <td style={{ textAlign: "center" }}>
                  ${price.toFixed(2)}
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    disabled={updating}
                    onChange={(e) =>
                      handleQuantityChange(item.id, item.product.id, e.target.value)
                    }
                    style={{ width: "60px" }}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  ${lineTotal.toFixed(2)}
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    disabled={updating}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary + Checkout */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <div>
          <strong>Cart Total: ${total.toFixed(2)}</strong>
        </div>
        <button onClick={handleCheckout} disabled={updating}>
          Checkout
        </button>
      </div>
    </div>
  );
}
