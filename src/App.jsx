import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthProvider";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import FullscreenLoader from "./components/FullscreenLoader";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import MetaUpdater from "./components/MetaUpdater";
import Items from "./pages/Items";

function AppRoutes() {
  const { auth, loading } = useAuth();

  if (loading) return <FullscreenLoader />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Home bisa diakses siapa saja */}
      <Route path="/" element={<Home />} />
      <Route path="/items" element={<Items />} />
      <Route path="/items/:slug" element={<ItemDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment/:orderId" element={<Payment />} />

      <Route
        path="/orders"
        element={
          auth.token ? <Orders /> : <Navigate to="/login" replace />
        }
      />

      {/* Admin Protected */}
      <Route
        path="/admin"
        element={
          auth.token && auth.role === "admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MetaUpdater />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}