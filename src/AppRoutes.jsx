import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Items from "./pages/Items";
import ItemDetail from "./pages/ItemDetail";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/admin/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import FullscreenLoader from "./components/FullscreenLoader";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Profile from "./pages/Profile";

export default function AppRoutes() {
  const { auth, loading } = useAuth();

  if (loading) return <FullscreenLoader />;

  return (
    <Routes>
      {/* Auth pages */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

      {/* Main pages */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/items"
        element={
          <MainLayout>
            <Items />
          </MainLayout>
        }
      />
      <Route
        path="/items/:slug"
        element={
          <MainLayout>
            <ItemDetail />
          </MainLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <MainLayout>
            <Cart />
          </MainLayout>
        }
      />
      <Route
        path="/payment/:orderId"
        element={
          <MainLayout>
            <Payment />
          </MainLayout>
        }
      />
      <Route
        path="/orders"
        element={
          <MainLayout>
            {auth.token ? <Orders /> : <Navigate to="/login" replace />}
          </MainLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <MainLayout>
            {auth.token ? <Profile /> : <Navigate to="/login" replace />}
          </MainLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <MainLayout>
            {auth.token && auth.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" replace />}
          </MainLayout>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}