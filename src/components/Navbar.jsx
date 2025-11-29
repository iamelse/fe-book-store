import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import { getCategories } from "../api/categories";
import { getCart } from "../api/cart";

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { Menu, Search, ShoppingCart, Bell, ChevronDown, ChevronRight } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ---------------- UI States ----------------
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // ---------------- Data States ----------------
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ---------------- Context ----------------
  const { auth, logout, loading } = useAuth();
  const { cartCount, fetchCartCount } = useCart();

  // ---------------- Refs ----------------
  const categoryRef = useRef(null);
  const cartRef = useRef(null);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const notifications = []; // placeholder

  // ---------------- Dropdown Styling ----------------
  const dropdownClass = "absolute right-0 top-8 bg-white shadow-lg border border-gray-200 rounded-md p-3 z-50 transition-all duration-200 origin-top";

  // ---------------- Fetch Categories ----------------
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  // ---------------- Fetch Cart Items ----------------
  const loadCart = async () => {
    try {
      const res = await getCart();
      const items = Array.isArray(res.data.data.cart_items) ? res.data.data.cart_items : [];
      setCartItems(items);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      fetchCartCount();
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  // ---------------- Close Dropdowns on Outside Click ----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------- Close Dropdowns on Page Navigation ----------------
  useEffect(() => {
    setCategoryOpen(false);
    setCartOpen(false);
    setNotifOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // ---------------- Search Handler ----------------
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/items?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <nav className="border-b border-gray-300 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/">
          <img
            className="h-9"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/dummyLogoColored.svg"
            alt="logo"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden">
          <Menu size={24} strokeWidth={1.75} className="text-gray-700" />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center w-full justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-7 flex-1">

            {/* Category Dropdown */}
            <div className="relative ms-7" ref={categoryRef}>
              <button onClick={() => setCategoryOpen(!categoryOpen)} className="flex items-center gap-1 cursor-pointer font-medium">
                Kategori
                <ChevronDown size={18} className={`transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <div className="absolute top-8 left-0 w-48 bg-white shadow-md border rounded-md py-2 z-50">
                  {loadingCats ? (
                    <p className="px-4 py-2 text-base text-gray-500">Loading...</p>
                  ) : categories.length === 0 ? (
                    <p className="px-4 py-2 text-base text-gray-500">Tidak ada kategori</p>
                  ) : (
                    categories.map(cat => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          navigate(`/items?category=${encodeURIComponent(cat.slug)}`);
                          setCategoryOpen(false);
                        }}
                        className="flex justify-between w-full px-4 py-2 text-left text-base hover:bg-gray-100"
                      >
                        <span>{cat.name}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center gap-3 border border-gray-300 px-4 rounded-full flex-1 h-[42px]">
              <input
                className="w-full bg-transparent outline-none placeholder-gray-500 h-full"
                type="text"
                placeholder="Keyword dari author, title, atau description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button onClick={handleSearch}>
                <Search size={22} strokeWidth={1.4} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6 ms-6">

            {/* Cart Dropdown */}
            <div className="relative flex items-center" ref={cartRef}>
              <button onClick={() => setCartOpen(!cartOpen)}>
                <ShoppingCart size={22} strokeWidth={1.75} className="text-gray-700" />
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 text-sm text-white bg-[#3e6dc8] w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
              {cartOpen && (
                <div className={`${dropdownClass} w-80`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Keranjang</h4>
                    {cartCount > 0 && <Link to="/cart" className="text-[#3e6dc8] hover:underline text-base">Lihat semua</Link>}
                  </div>
                  <div className="w-full h-px bg-gray-200 my-2"></div>
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-gray-600 py-3">Keranjang kosong</p>
                  ) : (
                    <div className="max-h-[260px] overflow-y-auto pr-1">
                      {cartItems.map(cartItem => (
                        <div key={cartItem.id} className="flex items-center gap-3 py-2">
                          <img
                            src={cartItem.item.image || `https://picsum.photos/50/50?random=${cartItem.id}`}
                            alt={cartItem.item.title}
                            className="w-12 h-12 rounded-md object-cover border"
                          />
                          <div className="flex flex-col">
                            <span className="text-base font-medium">{cartItem.item.title}</span>
                            <span className="text-base text-gray-600">Rp {cartItem.item.price.toLocaleString("id-ID")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative flex items-center" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={22} strokeWidth={1.75} className="text-gray-700" />
              </button>
              {notifications.length > 0 && (
                <span className="absolute -top-1.5 -right-2 text-sm text-white bg-red-500 w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}
              {notifOpen && (
                <div className={`${dropdownClass} w-80`}>
                  <h4 className="font-medium">Notifikasi</h4>
                  <div className="h-px bg-gray-200 my-2"></div>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-600">Tidak ada notifikasi</p>
                  ) : (
                    notifications.map((notif, i) => (
                      <div key={i} className="py-2 text-base">{notif}</div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-7 w-px bg-gray-300 mx-3"></div>

            {/* User Avatar Dropdown */}
            {loading ? (
              <span>Loading...</span>
            ) : auth?.user ? (
              <div className="relative flex items-center gap-1" ref={userMenuRef}>
                <img
                  src="https://ebooks.gramedia.com/static/media/profile_default.e0deee7514910eaa9c5ac27a34086e64.svg"
                  alt="avatar"
                  className="w-10 h-10 rounded-full border cursor-pointer"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                />
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                />
                {userMenuOpen && (
                  <div className={`${dropdownClass} w-80 right-0 mt-2`}>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <img
                        src="https://ebooks.gramedia.com/static/media/profile_default.e0deee7514910eaa9c5ac27a34086e64.svg"
                        alt="avatar"
                        className="w-12 h-12 rounded-full border"
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-medium">{auth.user.name}</span>
                        <span className="text-sm text-gray-500">{auth.user.email}</span>
                      </div>
                    </div>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex justify-between items-center w-full px-4 py-2 hover:bg-gray-100 text-base"
                    >
                      <span>Akun</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>

                    <button
                      onClick={() => navigate("/orders")}
                      className="flex justify-between items-center w-full px-4 py-2 hover:bg-gray-100 text-base"
                    >
                      <span>Transaksi</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                    <div className="border-t my-1"></div>
                    <button onClick={() => {
                      logout();
                      setCartItems([]);
                    }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-base text-red-600">Keluar</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition">Masuk</Link>
                <Link to="/register" className="px-6 py-2 bg-[#3e6dc8] hover:bg-[#345ab0] text-white rounded-full transition">Daftar</Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}