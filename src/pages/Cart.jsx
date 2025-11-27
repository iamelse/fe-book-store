import { useEffect, useState, useRef } from "react";
import { getCart, removeFromCart, updateCartItemQuantity } from "../api/cart";
import { useAuth } from "../context/AuthProvider";
import Navbar from "../components/Navbar";
import FullscreenLoader from "../components/FullscreenLoader";
import { createOrderFromCart } from "../api/order";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/format";
import Footer from "../components/Footer";

export default function Cart() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  // Track debounce timers per item
  const debounceTimers = useRef({});

  useEffect(() => {
    if (!auth.token) {
      setCart(null);
      setLoading(false);
      return;
    }
    fetchCart();
  }, [auth.token]);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const triggerUpdateQty = async (id, qty) => {
    try {
      await updateCartItemQuantity(id, { quantity: qty });
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      alert("Failed to update quantity");
    }
  };

  const onChangeQuantity = (ci, qty) => {
    qty = Number(qty);

    if (qty < 1 || qty > ci.item.stock) return;

    // Update UI only — local state update
    setCart((prev) => ({
      ...prev,
      cart_items: prev.cart_items.map((item) =>
        item.id === ci.id ? { ...item, quantity: qty } : item
      ),
    }));

    // Debounce API update
    clearTimeout(debounceTimers.current[ci.id]);
    debounceTimers.current[ci.id] = setTimeout(() => {
      triggerUpdateQty(ci.id, qty);
    }, 500);
  };

  const onBlurQuantity = (ci) => {
    const qty = ci.quantity;
    triggerUpdateQty(ci.id, qty);
  };

  const handleRemove = async (id) => {
    setRemovingId(id);
    try {
      await removeFromCart(id);
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      alert("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await createOrderFromCart();
      navigate(`/payment/${res.data.data.id}`);
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return <FullscreenLoader />;

  if (!cart || cart.cart_items.length === 0) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600">Add items to your cart to see them here.</p>
      </div>
    </div>
  );

  const totalPrice = cart.cart_items.reduce(
    (sum, item) => sum + item.quantity * item.item.price,
    0
  );
  const shipping = 50000;
  const tax = Math.round(totalPrice * 0.084);
  const orderTotal = totalPrice + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-6">
          Review items before checking out. Adjust quantities or remove items anytime.
        </p>

        {/* CART ITEMS */}
        <div className="bg-white rounded shadow divide-y">
          {cart.cart_items.map((ci) => (
            <div key={ci.id} className="flex items-center justify-between p-4">
              
              {/* Info */}
              <div className="flex items-center gap-4 flex-1">
                <img
                  src="https://picsum.photos/80/80"
                  alt={ci.item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{ci.item.title}</p>

                  <p className={`text-sm mt-1 ${ci.item.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {ci.item.stock > 0 ? "In stock" : "Out of stock"}
                  </p>

                  {/* Total Stock */}
                  {ci.item.stock > 0 && (
                    <p className="text-xs text-gray-500">
                      {ci.item.stock} items available
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col items-center gap-2 mx-4 qty-input-wrapper">
                <div className="flex items-center gap-2">
                  
                  <button
                    className="px-3 py-1 border rounded"
                    disabled={ci.quantity <= 1}
                    onClick={() => onChangeQuantity(ci, ci.quantity - 1)}
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={ci.item.stock}
                    value={ci.quantity}
                    onChange={(e) => onChangeQuantity(ci, e.target.value)}
                    onBlur={() => onBlurQuantity(ci)}
                    className="w-14 text-center border rounded py-1"
                  />

                  <button
                    className="px-3 py-1 border rounded"
                    disabled={ci.quantity >= ci.item.stock}
                    onClick={() => onChangeQuantity(ci, ci.quantity + 1)}
                  >
                    +
                  </button>

                </div>

                <button
                  disabled={removingId === ci.id}
                  onClick={() => handleRemove(ci.id)}
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                  {removingId === ci.id ? "Removing..." : "Remove"}
                </button>
              </div>

              {/* Price */}
              <div className="text-right w-24">
                <p className="font-medium">{formatPrice(ci.item.price)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="mt-6 bg-white p-4 rounded shadow space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Order total</span>
            <span>{formatPrice(orderTotal)}</span>
          </div>
        </div>

        {/* ACTION */}
        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="mt-6 w-full bg-[#3e6dc8] text-white py-3 rounded hover:bg-[#345ab0] transition disabled:opacity-50"
        >
          {checkingOut ? "Processing..." : "Checkout"}
        </button>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            or Continue Shopping →
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}