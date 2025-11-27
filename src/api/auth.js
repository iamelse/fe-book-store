import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://127.0.0.1:8000/api/v1/auth";

// Login
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, { email, password });

    if (res.data.success) {
      const { access_token, user } = res.data.data;
      return { token: access_token, role: user.role, user };
    } else {
      throw new Error(res.data.message || "Login failed");
    }
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

// Register
export const register = async (name, email, password, password_confirmation) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, { name, email, password, password_confirmation });

    if (res.data.success) {
      const user = res.data.data;
      return { success: true, message: res.data.message || "Register success", user };
    }

    return { success: false, message: res.data.message };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// Logout
export const logoutApi = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) return;

    await axios.post(`${BASE_URL}/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("Logout API failed:", err.response?.data || err.message);
  } finally {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
  }
};

// Get current user
export const getMe = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) return null;

    const res = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch /me:", err.response?.data || err.message);
    return null;
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) return null;

    const res = await axios.post(`${BASE_URL}/refresh`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { access_token } = res.data.data;
    Cookies.set("token", access_token, { expires: 7 });
    return access_token;
  } catch (err) {
    console.error("Failed to refresh token:", err.response?.data || err.message);
    return null;
  }
};