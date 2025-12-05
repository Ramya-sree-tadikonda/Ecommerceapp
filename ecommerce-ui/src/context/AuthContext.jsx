import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,        // { email, role }
    accessToken: null,
    refreshToken: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      setAuth(JSON.parse(stored));
    }
  }, []);

  const login = (user, accessToken, refreshToken) => {
    const newAuth = { user, accessToken, refreshToken };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth({ user: null, accessToken: null, refreshToken: null });
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
