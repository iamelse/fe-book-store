import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FullscreenLoader from "../components/FullscreenLoader";
import Button from "../components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  LayoutDashboard,
  Calendar,
  Heart,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react";

export default function Profile() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.token) return navigate("/login");
    setLoading(false);
  }, [auth.token]);

  if (loading) return <FullscreenLoader />;

  const user = auth.user;

  const avatarURL =
    "https://ebooks.gramedia.com/static/media/profile_default.e0deee7514910eaa9c5ac27a34086e64.svg";

  const menu = [
    { label: "Profil Saya", icon: User, link: "/profile" },
    { label: "Transaksi", icon: LayoutDashboard, link: "/orders" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">

        {/* Header Clean */}
        <div className="mb-6 p-6 rounded-xl bg-white border border-gray-200">
          <h1 className="text-3xl font-semibold text-gray-800">
            Hai, {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola data akun dan informasi pribadi Anda di sini.
          </p>
        </div>

        {/* 2 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* SIDEBAR */}
          <div className="border border-gray-200 bg-white rounded-xl p-4 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Menu
            </h2>

            <div className="space-y-1">
              {menu.map((item) => (
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

              {/* Logout */}
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

          {/* RIGHT DETAIL */}
          <div className="md:col-span-2 space-y-6">

            {/* Stats clean flat */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center gap-3">
                <CheckCircle className="text-green-600" size={22} />
                <div>
                  <p className="text-sm text-gray-600">Pesanan Selesai</p>
                  <p className="text-xl font-semibold text-gray-800">12</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center gap-3">
                <Clock className="text-yellow-600" size={22} />
                <div>
                  <p className="text-sm text-gray-600">Diproses</p>
                  <p className="text-xl font-semibold text-gray-800">3</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center gap-3">
                <Star className="text-blue-600" size={22} />
                <div>
                  <p className="text-sm text-gray-600">Akun Dibuat</p>
                  <p className="text-xl font-semibold text-gray-800">2023</p>
                </div>
              </div>
            </div>

            {/* Detail Profile Card */}
            <div className="border border-gray-200 bg-white rounded-xl p-6 space-y-6">

              {/* Avatar + header */}
              <div className="flex items-center gap-6 border-b border-gray-200 pb-6">
                <img
                  src={avatarURL}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover bg-gray-100"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {user?.name}
                  </h2>
                  <p className="text-gray-600 text-sm">Pengguna terdaftar</p>
                </div>
              </div>

              {/* Informasi Personal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Informasi Personal
                </h3>

                <div className="space-y-4">

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg font-medium text-gray-800">{user?.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Nomor Telepon</p>
                      <p className="text-lg font-medium text-gray-800">
                        {user?.phone || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Alamat</p>
                      <p className="text-lg font-medium text-gray-800">
                        {user?.address || "Belum ditambahkan"}
                      </p>
                    </div>
                  </div>

                  {/* TTL */}
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Lahir</p>
                      <p className="text-lg font-medium text-gray-800">
                        12 Agustus 2001
                      </p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex items-center gap-3">
                    <Heart className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Jenis Kelamin</p>
                      <p className="text-lg font-medium text-gray-800">
                        Laki-laki
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  text="Edit Profil"
                  variant="primary"
                  onClick={() => navigate("/profile/edit")}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}