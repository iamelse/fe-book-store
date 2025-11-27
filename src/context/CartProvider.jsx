import { createContext, useContext, useEffect, useState } from "react";
import { getCart, addToCart as apiAdd, removeFromCart as apiRemove } from "../api/cart";
import { useAuth } from "./AuthProvider";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { auth } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const fetchCart = async () => {
    if (!auth.user) return;
    try {
      setLoadingCart(true);
      const res = await getCart();
      setCartItems(res.data.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [auth.user]);

  const addToCart = async ({ item_id, quantity = 1 }) => {
    await apiAdd({ item_id, quantity });
    fetchCart();
  };

  const removeFromCart = async (id) => {
    await apiRemove(id);
    fetchCart();
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, loadingCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}