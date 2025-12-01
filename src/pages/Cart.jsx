import { useEffect, useState, useRef } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getCart, removeFromCart, updateCartItemQuantity, removeMultipleCartItems } from "../api/cart";
import { useAuth } from "../context/AuthContext";
import FullscreenLoader from "../components/FullscreenLoader";
import { createOrderFromCart } from "../api/order";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/format";
import toast from "react-hot-toast";
import Button from "../components/Button";

export default function Cart() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const debounceTimers = useRef({});

  // ---------------- Fetch cart ----------------
  useEffect(() => {
    if (!auth.token) {
      setCart(null);
      setLoading(false);
      return;
    }
    fetchCartData();
  }, [auth.token]);

  const fetchCartData = async () => {
    try {
      const res = await getCart();
      setCart(res.data.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Quantity ----------------
  const triggerUpdateQty = async (id, qty) => {
    try {
      await updateCartItemQuantity(id, { quantity: qty });
      await fetchCartData();
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Jumlah barang berhasil diperbarui");
    } catch {
      toast.error("Gagal memperbarui jumlah barang");
    }
  };

  const onChangeQuantity = (ci, qty) => {
    qty = Number(qty);
    if (qty < 1 || qty > ci.item.stock) return;

    setCart((prev) => ({
      ...prev,
      cart_items: prev.cart_items.map((item) =>
        item.id === ci.id ? { ...item, quantity: qty } : item
      ),
    }));

    clearTimeout(debounceTimers.current[ci.id]);
    debounceTimers.current[ci.id] = setTimeout(() => {
      triggerUpdateQty(ci.id, qty);
    }, 500);
  };

  const onBlurQuantity = (ci) => {
    triggerUpdateQty(ci.id, ci.quantity);
  };

  // ---------------- Remove single ----------------
  const handleRemove = async (id) => {
    setRemovingId(id);
    try {
      await removeFromCart(id);
      await fetchCartData();
      window.dispatchEvent(new Event("cartUpdated"));
      fetchCartCount();
      toast.success("Barang berhasil dihapus dari keranjang");
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } catch {
      toast.error("Gagal menghapus barang");
    } finally {
      setRemovingId(null);
    }
  };

  // ---------------- Remove multiple ----------------
  const handleRemoveSelected = async () => {
    setRemovingId("bulk");
    try {
      await removeMultipleCartItems(selectedItems);
      await fetchCartData();
      setSelectedItems([]);
      window.dispatchEvent(new Event("cartUpdated"));
      fetchCartCount();
      toast.success("Semua item yang dipilih berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus beberapa item");
    } finally {
      setRemovingId(null);
    }
  };

  // ---------------- Checkout ----------------
const handleCheckout = async () => {
  if (selectedItems.length === 0) {
    toast.error("Silakan pilih minimal satu item untuk checkout");
    return;
  }

  setCheckingOut(true);
    try {
      // Misal createOrderFromCart menerima payload: { cart_item_ids: [...] }
      const res = await createOrderFromCart({ cart_item_ids: selectedItems });

      // Kosongkan cart & selection hanya untuk item yang dibeli
      setCart((prev) => ({
        ...prev,
        cart_items: prev.cart_items.filter((ci) => !selectedItems.includes(ci.id)),
      }));
      setSelectedItems([]);
      window.dispatchEvent(new Event("cartUpdated"));
      fetchCartCount();

      toast.success("Pesanan berhasil dibuat! Mengalihkan ke pembayaran…");
      navigate(`/payment/${res.data.data.id}`);
    } catch {
      toast.error("Checkout gagal. Silakan coba lagi.");
    } finally {
      setCheckingOut(false);
    }
  };

  // ---------------- Selection ----------------
  const allSelected = cart?.cart_items.length > 0 && selectedItems.length === cart.cart_items.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelectedItems([]);
    else setSelectedItems(cart.cart_items.map((ci) => ci.id));
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // ---------------- Render ----------------
  if (loading) return <FullscreenLoader />;

  if (!cart || cart.cart_items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Keranjang Anda kosong</h2>
        <p className="text-gray-600">Tambahkan barang ke keranjang untuk melihatnya di sini.</p>
      </div>
    );
  }

  const totalPrice = cart.cart_items.reduce(
    (sum, item) => sum + item.quantity * item.item.price,
    0
  );
  const shipping = 50000;
  const tax = Math.round(totalPrice * 0.084);
  const orderTotal = totalPrice + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold mb-2 text-gray-800">Keranjang Belanja</h1>
          <p className="text-gray-600">
            Periksa barang sebelum melakukan pembayaran. Anda dapat menyesuaikan jumlah atau menghapus barang kapan saja.
          </p>
        </div>

        {/* Select All */}
        <div className="flex items-center justify-between border border-gray-200 rounded-xl bg-white p-4 mb-6">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4" />
            <label className="text-base text-gray-700 font-medium">Pilih semua barang</label>
          </div>

          {selectedItems.length > 0 && (
            <Button
              text="Hapus Semua"
              onClick={handleRemoveSelected}
              variant="danger-outline"
              loading={removingId === "bulk"}
            />
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* LEFT: cart items */}
          <div className="md:col-span-2 space-y-4">
            {cart.cart_items.map((ci) => (
              <div key={ci.id} className="flex flex-col md:flex-row items-center gap-4 border border-gray-200 rounded-xl bg-white p-4">
                <input type="checkbox" checked={selectedItems.includes(ci.id)} onChange={() => toggleSelectItem(ci.id)} className="w-4 h-4" />
                <div className="w-24 aspect-[1/1.4] overflow-hidden rounded">
                  <img src="https://picsum.photos/80/112" alt={ci.item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-xl line-clamp-2 text-gray-800">{ci.item.title}</p>
                  <span className={`inline-block px-2 py-1 rounded-sm mt-2 text-xs font-semibold ${
                    ci.item.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {ci.item.stock > 0 ? `Tersedia • ${ci.item.stock} barang` : "Stok habis"}
                  </span>
                  <p className="mt-2 text-lg font-medium text-gray-800">{formatPrice(ci.item.price)}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-3 mt-4">
                    <div className="qty-input-wrapper flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button disabled={ci.quantity <= 1} onClick={() => onChangeQuantity(ci, ci.quantity - 1)} className="px-1.5 py-3 disabled:opacity-40 hover:bg-gray-100">
                        <Minus size={18} />
                      </button>
                      <input type="number" min="1" max={ci.item.stock} value={ci.quantity} onChange={(e) => onChangeQuantity(ci, e.target.value)} onBlur={() => onBlurQuantity(ci)} className="w-12 text-center font-medium text-gray-700 focus:outline-none" />
                      <button disabled={ci.quantity >= ci.item.stock} onClick={() => onChangeQuantity(ci, ci.quantity + 1)} className="px-1.5 py-3 disabled:opacity-40 hover:bg-gray-100">
                        <Plus size={18} />
                      </button>
                    </div>
                    <Button
                      text="Hapus"
                      onClick={() => handleRemove(ci.id)}
                      variant="danger-outline"
                      loading={removingId === ci.id}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: summary */}
          <div className="border border-gray-200 rounded-xl bg-white p-4 flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Ringkasan Pesanan</h2>
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
            <div className="flex justify-between"><span>Ongkos Kirim</span><span>{formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span>Pajak</span><span>{formatPrice(tax)}</span></div>
            
            {/* Divider sebelum total */}
            <div className="border-t border-gray-300 my-2" />

            <div className="flex justify-between font-semibold text-lg"><span>Total Pesanan</span><span>{formatPrice(orderTotal)}</span></div>

            <Button
              text="Checkout"
              onClick={handleCheckout}
              variant="primary"
              loading={checkingOut}
              disabled={checkingOut || selectedItems.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}