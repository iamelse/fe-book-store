import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({ baseURL: BASE_URL });

// Tambahkan token secara otomatis
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Ambil semua item di cart
export const getCart = () => api.get("/cart");

// Tambah item ke cart: payload harus { item_id, quantity }
export const addToCart = ({ item_id, quantity = 1 }) =>
  api.post("/cart/items", { item_id, quantity });

// Update quantity item di cart: payload harus { quantity }
export const updateCartItemQuantity = (id, { quantity }) =>
  api.put(`/cart/items/${id}`, { quantity });

// Hapus item dari cart
export const removeFromCart = (id) => api.delete(`/cart/items/${id}`);

// Hapus beberapa item sekaligus
export const removeMultipleCartItems = (ids) =>
  api.delete("/cart/multiple", { data: { cart_item_ids: ids } });