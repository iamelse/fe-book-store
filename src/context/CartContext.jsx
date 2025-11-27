import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import * as cartApi from "../api/cart";

export const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { auth } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Fungsi fetch cart count dari API
  const fetchCartCount = async () => {
    if (!auth.token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await cartApi.getCart();
      const count = res.data.data?.cart_items?.length || 0;
      setCartCount(count);
    } catch (err) {
      console.error("Fetch cart failed", err);
      setCartCount(0);
    }
  };

  // Fetch cart count saat mount / login
  useEffect(() => {
    fetchCartCount();
  }, [auth.token]);

  // Add item ke cart
  const addToCart = async ({ item_id, quantity = 1 }) => {
    if (!auth.token) return;
    try {
      setCartCount(prev => prev + quantity); // Optimistic UI
      await cartApi.addToCart({ item_id, quantity });
      fetchCartCount(); // pastikan count update dari API
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Add to cart failed", err);
      setCartCount(prev => (prev > 0 ? prev - quantity : 0));
    }
  };

  // Remove item dari cart
  const removeFromCart = async (id) => {
    if (!auth.token) return;
    try {
      await cartApi.removeFromCart(id);
      fetchCartCount(); // update count setelah hapus
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Remove from cart failed", err);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart, removeFromCart, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}