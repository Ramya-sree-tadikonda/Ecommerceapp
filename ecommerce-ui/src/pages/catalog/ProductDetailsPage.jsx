import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductByIdApi } from "../../api/productApi.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { addToCartApi } from "../../api/cartApi.js";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("");
  const [loadError, setLoadError] = useState("");
  const [cartError, setCartError] = useState("");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdApi(id);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setLoadError("Failed to load product.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setStatus("");
    setCartError("");
    try {
      await addToCartApi(
        { productId: Number(id), quantity: Number(qty) },
        axiosPrivate
      );
      setStatus("Added to cart.");
    } catch (err) {
      console.error(err);
      setCartError(
        err.response?.status === 401
          ? "Please log in to add to cart."
          : "Failed to add to cart."
      );
    }
  };

  if (loadError) return <p style={{ color: "red" }}>{loadError}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>
        <strong>${Number(product.price || 0).toFixed(2)}</strong>
      </p>
      <p>Stock: {product.stock}</p>

      <div style={{ marginTop: "1rem" }}>
        <label>Quantity: </label>
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{ width: "80px" }}
        />
        <button style={{ marginLeft: "1rem" }} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      {status && <p style={{ color: "green" }}>{status}</p>}
      {cartError && <p style={{ color: "red" }}>{cartError}</p>}
    </div>
  );
}
