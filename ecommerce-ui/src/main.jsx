import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import "./styles/global.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastProvider } from "./toast/ToastContext.jsx";

import "./styles/global.css";
const stripePromise = loadStripe("pk_test_51RLaabQS3y6KOaL69UEKYtuzIKGpBDmbAOZOqDadqRNOOCxPDOMjlXKQAbMwc6UYru5nRvSDM9j7dF8IL0ZgDNE500cVA9d1T9");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
