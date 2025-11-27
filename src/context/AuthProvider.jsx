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

  // -----------------------------------------------------
  // 1) Pasang / hapus Authorization header berdasarkan token
  // -----------------------------------------------------
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  // -----------------------------------------------------
  // 2) Init: cek /me jika ada token di cookies
  // -----------------------------------------------------
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
        // jika token invalid → logout paksa
        Cookies.remove("token");
        Cookies.remove("role");
        Cookies.remove("user");
        setAuth({ token: null, role: null, user: null });
      }

      setLoading(false);
    }

    initAuth();
  }, []);

  // -----------------------------------------------------
  // 3) Interceptor Refresh Token
  // -----------------------------------------------------
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        // jika token expired → refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshToken();

            if (!newToken) throw new Error("Refresh failed");

            // simpan token baru
            Cookies.set("token", newToken, { expires: 7 });
            setAuth((prev) => ({ ...prev, token: newToken }));

            // pasang token untuk axios
            axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

            return axios(originalRequest);

          } catch {
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

  // -----------------------------------------------------
  // 4) LOGIN
  // -----------------------------------------------------
  const login = async (email, password) => {
    const data = await loginApi(email, password);

    // simpan ke cookies
    Cookies.set("token", data.token, { expires: 7 });
    Cookies.set("role", data.role, { expires: 7 });
    Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

    // set state
    setAuth(data);

    // set axios header
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    return data;
  };

  // -----------------------------------------------------
  // 5) REGISTER
  // -----------------------------------------------------
  const register = async (name, email, password, password_confirmation) => {
    return await registerApi(name, email, password, password_confirmation);
  };

  // -----------------------------------------------------
  // 6) LOGOUT
  // -----------------------------------------------------
  const logout = async () => {
    try {
      await logoutApi();
    } catch {}

    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");

    setAuth({ token: null, role: null, user: null });
  };

  // -----------------------------------------------------
  // 7) Manual Refresh Token (opsional)
  // -----------------------------------------------------
  const refresh = async () => {
    const token = await refreshToken();

    if (token) {
      Cookies.set("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuth((prev) => ({ ...prev, token }));
    }
  };

  // -----------------------------------------------------
  // RETURN PROVIDER
  // -----------------------------------------------------
  return (
    <AuthContext.Provider
      value={{ auth, login, logout, register, refresh, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};