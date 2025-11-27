import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { auth, logout } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Admin Dashboard</h1>
      <p>Hello Admin {auth.user?.name}</p>
      <p>Email: {auth.user?.email}</p>
      <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>Logout</button>
    </div>
  );
}