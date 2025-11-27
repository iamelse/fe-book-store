import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createOrderFromCart = () => api.post("/orders/from-cart");
export const getOrders = () => api.get("/orders");
export const getOrder = (id) => api.get(`/orders/${id}`);