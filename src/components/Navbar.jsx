import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout, loading } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = 0;

  // Hardcode 3 kategori terbaru
  const categories = [
    { name: "Fantasy", slug: "fantasy" },
    { name: "Fiction", slug: "fiction" },
    { name: "Finance", slug: "finance" },
  ];

  const navLinks = [
    { label: "Shop", path: "/items" }, // tetap ada
    ...categories.map((cat) => ({
      label: cat.name,
      path: `/items?category=${cat.slug}`,
    })),
  ];

  const isActive = (path) => location.pathname + location.search === path;

  return (
    <header className="relative bg-white border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-gray-400 lg:hidden"
          >
            <span className="sr-only">Open menu</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="ml-4 flex lg:ml-0 cursor-pointer"
          >
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=600"
              alt="Logo"
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop nav links */}
          <div className="ms-8 hidden lg:flex lg:space-x-8">
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

          {/* Right side */}
          <div className="ml-auto flex items-center">
            {loading ? (
              <div className="hidden lg:flex w-24 h-5 bg-gray-200 rounded animate-pulse" />
            ) : auth.user ? (
              <div className="hidden lg:flex lg:items-center lg:space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Hi, {auth.user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-700 hover:text-[#3e6dc8]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex lg:items-center lg:space-x-6">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-gray-700 hover:text-[#3e6dc8]"
                >
                  Sign in
                </button>
                <span className="h-6 w-px bg-gray-200"></span>
                <button
                  onClick={() => navigate("/register")}
                  className="text-sm font-medium text-gray-700 hover:text-[#3e6dc8]"
                >
                  Create account
                </button>
              </div>
            )}

            {/* Cart icon */}
            <button
              onClick={() => {
                if (auth.user) {
                  navigate("/cart");
                } else {
                  navigate("/login");
                }
              }}
              className="group -m-2 flex items-center p-2 ml-4"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" className="size-6 text-gray-400 group-hover:text-[#3e6dc8]">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993
                    1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125
                    0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513
                    7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625
                    10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1
                    .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-[#3e6dc8]">
                {cartCount}
              </span>
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/25 lg:hidden">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl p-6 flex flex-col">

            <div className="flex justify-end mb-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-400 hover:text-[#3e6dc8]"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 space-y-4 overflow-y-auto">
              {navLinks.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={`block text-base font-medium transition ${
                    isActive(item.path)
                      ? "text-[#3e6dc8]"
                      : "text-gray-700 hover:text-[#3e6dc8]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 border-t border-gray-200 pt-6 space-y-4">
              {loading ? (
                <div className="w-full h-6 bg-gray-200 rounded animate-pulse" />
              ) : auth.user ? (
                <>
                  <span className="block text-gray-900 text-base font-medium">
                    Hi, {auth.user.name}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="text-base font-medium text-gray-900 hover:text-[#3e6dc8]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileOpen(false);
                    }}
                    className="block text-gray-900 text-base font-medium hover:text-[#3e6dc8]"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileOpen(false);
                    }}
                    className="block text-gray-900 text-base font-medium hover:text-[#3e6dc8]"
                  >
                    Create account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}