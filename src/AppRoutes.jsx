import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";
import Login from "../src/pages/auth/Login";
import Register from "../src/pages/auth/Register";
import Home from "../src/pages/Home";
import Items from "../src/pages/Items";
import ItemDetail from "../src/pages/ItemDetail";
import Cart from "../src/pages/Cart";
import Payment from "../src/pages/Payment";
import Orders from "../src/pages/Orders";
import AdminDashboard from "../src/pages/admin/Dashboard";
import NotFound from "../src/pages/NotFound";
import FullscreenLoader from "../src/components/FullscreenLoader";

export default function AppRoutes() {
  const { auth, loading } = useAuth();

  if (loading) return <FullscreenLoader />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/items" element={<Items />} />
      <Route path="/items/:slug" element={<ItemDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment/:orderId" element={<Payment />} />

      <Route
        path="/orders"
        element={auth.token ? <Orders /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/admin"
        element={auth.token && auth.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}