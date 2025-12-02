import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FullscreenLoader from "../components/FullscreenLoader";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import {
  User,
  LayoutDashboard,
  LogOut,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { formatPrice } from "../utils/format";
import { getOrders } from "../api/order";

export default function Orders() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!auth.token) return navigate("/login");

    const fetchData = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [auth.token]);

  if (loading) return <FullscreenLoader />;

  const sidebarMenu = [
    { label: "Profil Saya", icon: User, link: "/profile" },
    { label: "Transaksi", icon: LayoutDashboard, link: "/orders" },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    paid: "bg-green-100 text-green-700 border-green-300",
    canceled: "bg-red-100 text-red-700 border-red-300",
  };

  const statusIcon = {
    pending: <Clock size={18} className="text-yellow-700" />,
    paid: <CheckCircle size={18} className="text-green-700" />,
    canceled: <XCircle size={18} className="text-red-700" />,
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}
        <div className="mb-6 p-6 rounded-xl bg-white border border-gray-200">
          <h1 className="text-3xl font-semibold text-gray-800">Transaksi</h1>
          <p className="text-gray-600 mt-1">
            Daftar pesanan Anda dari yang terbaru hingga terlama.
          </p>
        </div>

        {/* 2 KOLOM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* SIDEBAR */}
          <div className="border border-gray-200 bg-white rounded-xl p-4 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Menu</h2>

            <div className="space-y-1">
              {sidebarMenu.map((item) => (
                <button
                  key={item.link}
                  onClick={() => navigate(item.link)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border
                    ${
                      pathname === item.link
                        ? "bg-blue-50 border-blue-200"
                        : "border-transparent hover:bg-gray-100"
                    }`}
                >
                  <item.icon
                    size={18}
                    className={
                      pathname === item.link ? "text-blue-600" : "text-gray-600"
                    }
                  />
                  <span
                    className={`font-medium ${
                      pathname === item.link
                        ? "text-blue-700"
                        : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}

              {/* LOGOUT */}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 border border-transparent"
              >
                <LogOut size={18} className="text-red-600" />
                <span className="text-red-600 font-medium">Keluar</span>
              </button>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="md:col-span-2 space-y-6">

            <div className="border border-gray-200 bg-white rounded-xl p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Riwayat Pesanan
              </h3>

              {orders.length === 0 ? (
                <p className="text-gray-600">Belum ada pesanan.</p>
              ) : (
                <div className="space-y-4">

                  {orders.map((order) => {
                    const firstItem = order.items[0];

                    return (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-xl p-4 bg-white"
                      >
                        <div className="flex gap-4">

                          {/* THUMBNAIL */}
                          {firstItem && (
                            <img
                              src={`https://picsum.photos/200/300?random=${firstItem.item_id}`}
                              className="w-[90px] h-[130px] object-cover rounded-md border"
                            />
                          )}

                          {/* INFORMATION */}
                          <div className="flex-1 flex flex-col justify-between py-1">

                            <div>
                              <p className="text-gray-800 font-semibold text-lg">
                                Order #{order.id}
                              </p>

                              <p className="text-gray-600 text-sm mt-1">
                                {order.items.length} barang • {formatDate(order.created_at)}
                              </p>

                              <span
                                className={`mt-2 inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border ${statusColors[order.status]}`}
                              >
                                {statusIcon[order.status]}
                                {order.status === "pending"
                                  ? "Menunggu Pembayaran"
                                  : order.status === "paid"
                                  ? "Sudah Dibayar"
                                  : "Dibatalkan"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <p className="font-semibold text-gray-900 text-lg">
                                {formatPrice(order.total_amount)}
                              </p>

                              <Button
                                text="Lihat Detail"
                                variant="primary-outline"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}

                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}