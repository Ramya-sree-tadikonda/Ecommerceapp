import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const stored = localStorage.getItem("auth");
  const [auth, setAuth] = useState(stored ? JSON.parse(stored) : null);

  const login = (user, accessToken, refreshToken) => {
    const authData = { user, accessToken, refreshToken };
    setAuth(authData);
    localStorage.setItem("auth", JSON.stringify(authData));
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);

    // ✅ redirect to Login page after logout
    navigate("/login", { replace: true });
    // React will re-render the whole tree with auth = null,
    // so navbar updates and it "feels" like a refresh.
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
