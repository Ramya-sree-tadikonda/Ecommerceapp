
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { createPaymentIntentApi } from "../../api/paymentApi.js";
import { checkoutApi } from "../../api/orderApi.js";

export default function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!stripe || !elements) {
      setError("Stripe is not loaded yet.");
      return;
    }

    if (
      !address.fullName ||
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.postalCode ||
      !address.country
    ) {
      setError("Please fill in all required address fields.");
      return;
    }

    setProcessing(true);

    try {
      const intentRes = await createPaymentIntentApi(axiosPrivate);
      const clientSecret = intentRes.data.clientSecret;

      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: address.fullName,
            address: {
              line1: address.line1,
              line2: address.line2 || undefined,
              city: address.city,
              state: address.state,
              postal_code: address.postalCode,
              country: address.country,
            },
          },
        },
      });

      if (paymentResult.error) {
        console.error(paymentResult.error);
        setError(paymentResult.error.message || "Payment failed.");
        setProcessing(false);
        return;
      }

      if (paymentResult.paymentIntent.status !== "succeeded") {
        setError("Payment not completed.");
        setProcessing(false);
        return;
      }

      await checkoutApi(axiosPrivate);

      setStatus("Payment successful and order placed!");
      alert("Your order has been placed successfully!");
      setProcessing(false);

      navigate("/"); // redirect to Home / Products
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Checkout failed."
      );
      setProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Checkout</h2>
      <p>Enter your shipping address and card details to confirm the order.</p>

      {status && <p style={{ color: "green" }}>{status}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          margin: "0.75rem 0 1rem",
        }}
      >
        <img
          src="/cards/visa.png"
          alt="Visa"
          style={{ height: "18px", objectFit: "contain" }}
        />
        <img
          src="/cards/mastercard.png"
          alt="MasterCard"
          style={{ height: "18px", objectFit: "contain" }}
        />
        <img
          src="/cards/amex.png"
          alt="Amex"
          style={{ height: "18px", objectFit: "contain" }}
        />
        <img
          src="/cards/discover.png"
          alt="Discover"
          style={{ height: "18px", objectFit: "contain" }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset
          style={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <legend>Shipping Address</legend>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              Full Name<span style={{ color: "red" }}> *</span>
            </label>
            <input
              name="fullName"
              value={address.fullName}
              onChange={handleAddressChange}
              style={{ width: "100%" }}
              required
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              Address Line 1<span style={{ color: "red" }}> *</span>
            </label>
            <input
              name="line1"
              value={address.line1}
              onChange={handleAddressChange}
              style={{ width: "100%" }}
              required
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>Address Line 2 (optional)</label>
            <input
              name="line2"
              value={address.line2}
              onChange={handleAddressChange}
              style={{ width: "100%" }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
            }}
          >
            <div>
              <label>
                City<span style={{ color: "red" }}> *</span>
              </label>
              <input
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                required
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>
                State<span style={{ color: "red" }}> *</span>
              </label>
              <input
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                required
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <div>
              <label>
                ZIP / Postal Code<span style={{ color: "red" }}> *</span>
              </label>
              <input
                name="postalCode"
                value={address.postalCode}
                onChange={handleAddressChange}
                required
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>
                Country<span style={{ color: "red" }}> *</span>
              </label>
              <input
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                required
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </fieldset>

        <fieldset
          style={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <legend>Card Details</legend>
          <div
            style={{
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  },
                },
              }}
            />
          </div>
        </fieldset>

        <button type="submit" disabled={!stripe || processing}>
          {processing ? "Processing..." : "Pay & Place Order"}
        </button>
      </form>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        Use Stripe test card: <strong>4242 4242 4242 4242</strong>, any future
        expiry (e.g. 12/34), any CVC (e.g. 123), any ZIP (e.g. 12345).
      </p>
    </div>
  );
}
