import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://127.0.0.1:8000/api/v1/auth";

/**
 * LOGIN
 */
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, { email, password });

    if (res.data.success) {
      const { access_token, user } = res.data.data;

      return {
        success: true,
        token: access_token,
        role: user.role,
        user,
        status: res.status
      };
    }

    return {
      success: false,
      message: res.data.message,
      status: res.status
    };

  } catch (err) {
    throw {
      success: false,
      message: err.response?.data?.message || "Login failed",
      errors: err.response?.data?.errors || null,
      status: err.response?.status || 500,
    };
  }
};


/**
 * REGISTER
 */
export const register = async (name, email, password, password_confirmation) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, {
      name, email, password, password_confirmation
    });

    return {
      success: true,
      message: res.data.message,
      data: res.data.data,
      status: res.status
    };

  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Register failed",
      errors: err.response?.data?.errors || null,
      status: err.response?.status || 500
    };
  }
};


/**
 * LOGOUT
 */
export const logoutApi = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) return;

    await axios.post(
      `${BASE_URL}/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` }}
    );
  } catch (_) {
    // silent fail
  }
};


/**
 * GET ME
 */
export const getMe = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) return null;

    const res = await axios.get(`${BASE_URL}/me`);
    return res.data.data;

  } catch (err) {
    return null;
  }
};


/**
 * REFRESH TOKEN
 */
export const refreshToken = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) return null;

    const res = await axios.post(`${BASE_URL}/refresh`);

    const newToken = res.data.data.access_token;
    Cookies.set("token", newToken, { expires: 7 });

    return newToken;

  } catch (err) {
    return null;
  }
};