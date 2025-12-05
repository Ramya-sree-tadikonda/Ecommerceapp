// src/toast/ToastContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { type, message }

  const showToast = useCallback((type, message) => {
    setToast({ type, message });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast UI */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "4px",
            backgroundColor:
              toast.type === "error" ? "#ff4d4f" : "#4caf50",
            color: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
