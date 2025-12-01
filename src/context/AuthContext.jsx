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

  // ---------------- Set Axios Header ----------------
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  // ---------------- Init → validate token ----------------
  useEffect(() => {
    const init = async () => {
      if (!auth.token) {
        setLoading(false);
        return;
      }
      try {
        const user = await getMe();
        if (!user) throw new Error("Token invalid");
        setAuth((prev) => ({ ...prev, user }));
      } catch {
        Cookies.remove("token");
        Cookies.remove("role");
        Cookies.remove("user");
        setAuth({ token: null, role: null, user: null });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // ---------------- Auto Refresh Token ----------------
  useEffect(() => {
    if (!auth.token) return;

    const scheduleRefresh = () => {
      try {
        const payload = JSON.parse(atob(auth.token.split('.')[1]));
        const exp = payload.exp * 1000;
        const now = Date.now();
        const timeout = exp - now - 60 * 1000; // refresh 1 menit sebelum expired

        if (timeout > 0) {
          const timer = setTimeout(async () => {
            try {
              const newToken = await refreshToken();
              if (newToken) {
                setAuth(p => ({ ...p, token: newToken }));
                scheduleRefresh();
              } else {
                logout();
              }
            } catch {
              logout();
            }
          }, timeout);
          return () => clearTimeout(timer);
        } else {
          logout();
        }
      } catch {
        // jika token invalid
        logout();
      }
    };

    const clearTimer = scheduleRefresh();
    return clearTimer;
  }, [auth.token]);

  // ---------------- Axios Interceptor ----------------
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;

          try {
            const newToken = await refreshToken();
            if (!newToken) throw new Error("Refresh gagal");

            setAuth((p) => ({ ...p, token: newToken }));
            original.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(original);
          } catch {
            logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    const res = await loginApi(email, password);
    if (!res.success) throw res;

    Cookies.set("token", res.token, { expires: 7 });
    Cookies.set("role", res.role, { expires: 7 });
    Cookies.set("user", JSON.stringify(res.user), { expires: 7 });

    setAuth(res);
    return res;
  };

  // ---------------- REGISTER ----------------
  const register = async (...args) => registerApi(...args);

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    await logoutApi();
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    setAuth({ token: null, role: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};