import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-gray-700">Bookify</h2>
            <p className="text-base text-gray-500 mt-2 max-w-xs">
              Toko buku online modern yang memberikan pengalaman belanja cepat dan mudah.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-3">Menu</h3>
            <ul className="space-y-2 text-base">
              <li
                onClick={() => navigate("/")}
                className="cursor-pointer text-gray-600 hover:text-[#3e6dc8] transition"
              >
                Home
              </li>
              <li
                onClick={() => navigate("/items")}
                className="cursor-pointer text-gray-600 hover:text-[#3e6dc8] transition"
              >
                Items
              </li>
              <li
                onClick={() => navigate("/orders")}
                className="cursor-pointer text-gray-600 hover:text-[#3e6dc8] transition"
              >
                Orders
              </li>
              <li
                onClick={() => navigate("/cart")}
                className="cursor-pointer text-gray-600 hover:text-[#3e6dc8] transition"
              >
                Cart
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-3">Kontak</h3>
            <ul className="space-y-2 text-base">
              <li className="text-gray-600">support@myshop.com</li>
              <li className="text-gray-600">+62 812-1234-5678</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 text-center mt-10 pt-4">
          <p className="text-base text-gray-500">
            © {new Date().getFullYear()} MyShop. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
