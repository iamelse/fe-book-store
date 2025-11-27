import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  login as loginApi,
  register as registerApi,
  logoutApi,
  getMe,
  refreshToken
} from "../api/auth";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: Cookies.get("token") || null,
    role: Cookies.get("role") || null,
    user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  });

  const [loading, setLoading] = useState(true);

  // Pasang / hapus Authorization header axios
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  // Init: cek /me jika ada token di cookies
  useEffect(() => {
    async function initAuth() {
      if (!auth.token) {
        setLoading(false);
        return;
      }

      try {
        const user = await getMe();
        setAuth((prev) => ({ ...prev, user }));
      } catch (err) {
        // token invalid → logout paksa
        Cookies.remove("token");
        Cookies.remove("role");
        Cookies.remove("user");
        setAuth({ token: null, role: null, user: null });
      }

      setLoading(false);
    }

    initAuth();
  }, []);

  // Interceptor axios untuk refresh token otomatis
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshToken();
            if (!newToken) throw new Error("Refresh failed");

            Cookies.set("token", newToken, { expires: 7 });
            setAuth((prev) => ({ ...prev, token: newToken }));

            axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

            return axios(originalRequest);

          } catch (err) {
            Cookies.remove("token");
            Cookies.remove("role");
            Cookies.remove("user");
            setAuth({ token: null, role: null, user: null });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);

      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("role", data.role, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

      setAuth(data);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      return data;
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  // REGISTER
  const register = async (name, email, password, password_confirmation) => {
    try {
      return await registerApi(name, email, password, password_confirmation);
    } catch (err) {
      console.error("Register failed", err);
      throw err;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout API failed", err);
    }

    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    setAuth({ token: null, role: null, user: null });
  };

  // Manual refresh token (opsional)
  const refresh = async () => {
    try {
      const token = await refreshToken();
      if (token) {
        Cookies.set("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuth((prev) => ({ ...prev, token }));
      }
    } catch (err) {
      console.error("Manual refresh failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, register, refresh, loading }}>
      {children}
    </AuthContext.Provider>
  );
};