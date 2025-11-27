import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  Home,
  Menu,
  User,
  LogIn,
  Search,
  ShoppingCart,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout, loading } = useAuth();
  const { cartCount, fetchCartCount } = useCart();

  const [mobileSearch, setMobileSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    { name: "Fantasy", slug: "fantasy" },
    { name: "Fiction", slug: "fiction" },
    { name: "Finance", slug: "finance" },
  ];

  const navLinks = [
    { label: "Shop", path: "/items" },
    ...categories.map((cat) => ({
      label: cat.name,
      path: `/items?category=${cat.slug}`,
    })),
  ];

  const isActive = (path) => location.pathname + location.search === path;

  useEffect(() => {
    const handler = () => fetchCartCount();
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  // Close dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearch.trim() === "") return;
    navigate(`/items?search=${encodeURIComponent(mobileSearch.trim())}`);
    setMobileSearch("");
  };

  return (
    <header className="relative bg-white border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop logo */}
          <div
            onClick={() => navigate("/")}
            className="ml-4 hidden lg:flex lg:ml-0 cursor-pointer"
          >
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=600"
              alt="Logo"
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop nav links */}
          <div className="ml-8 hidden lg:flex lg:space-x-8">
            {navLinks.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition ${
                  isActive(item.path)
                    ? "text-[#3e6dc8] border-b-2 border-[#3e6dc8]"
                    : "text-gray-700 hover:text-[#3e6dc8]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex ml-auto items-center relative">
            {loading ? (
              <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
            ) : auth.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-sm font-medium text-gray-700 mr-4 hover:text-[#3e6dc8] flex items-center"
                >
                  Hi, {auth.user.name}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-sm rounded-md z-50 animate-fade-in">
                    <button
                      onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => { logout(); setShowDropdown(false); }}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      <LogIn className="w-4 h-4 mr-2 rotate-180" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-gray-700 hover:text-[#3e6dc8] mr-4 flex items-center"
                >
                  <LogIn className="w-5 h-5 mr-1" />
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="text-sm font-medium text-gray-700 hover:text-[#3e6dc8] mr-4"
                >
                  Create account
                </button>
              </>
            )}

            {/* Cart icon */}
            <button
              onClick={() => navigate(auth.user ? "/cart" : "/login")}
              className="relative -m-2 flex items-center p-2"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#3e6dc8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: search form + cart */}
          <div className="lg:hidden flex items-center space-x-2 px-2">
            <form
              onSubmit={handleMobileSearch}
              className="flex flex-1 items-center bg-gray-100 rounded-md px-3 py-2"
            >
              <input
                type="text"
                placeholder="Search..."
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-sm"
              />
              <button type="submit" className="ml-2 text-gray-500 hover:text-[#3e6dc8]">
                <Search className="w-5 h-5" />
              </button>
            </form>

            <button
              onClick={() => navigate(auth.user ? "/cart" : "/login")}
              className="relative flex-shrink-0 p-2"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#3e6dc8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center justify-center ${
              isActive("/") ? "text-[#3e6dc8]" : "text-gray-700 hover:text-[#3e6dc8]"
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => navigate("/items")}
            className={`flex flex-col items-center justify-center ${
              location.pathname.startsWith("/items") ? "text-[#3e6dc8]" : "text-gray-700 hover:text-[#3e6dc8]"
            }`}
          >
            <Menu className="w-6 h-6 mb-1" />
            <span className="text-xs">Categories</span>
          </button>

          {auth.user ? (
            <button
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center justify-center text-gray-700 hover:text-[#3e6dc8]"
            >
              <User className="w-6 h-6 mb-1" />
              <span className="text-xs">Profile</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex flex-col items-center justify-center text-gray-700 hover:text-[#3e6dc8]"
            >
              <LogIn className="w-6 h-6 mb-1" />
              <span className="text-xs">Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}