import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api/order";
import { useAuth } from "../context/AuthContext";
import FullscreenLoader from "../components/FullscreenLoader";

export default function Orders() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth.token]);

  if (loading) return <FullscreenLoader />;

  if (!auth.token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Please login to view your orders
          </h2>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">You have no orders yet</h2>
          <p className="text-gray-600">
            Once you make a purchase, your orders will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto bg-white rounded shadow mt-6">
        <h1 className="text-3xl font-semibold mb-6">My Orders</h1>

        <table className="w-full text-left border-collapse mb-6">
          <thead>
            <tr>
              <th className="border-b p-2">Order ID</th>
              <th className="border-b p-2">Status</th>
              <th className="border-b p-2">Total Price</th>
              <th className="border-b p-2">Created At</th>
              <th className="border-b p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2">{order.id}</td>
                <td className="p-2 capitalize">{order.status}</td>
                <td className="p-2">Rp {order.total_price}</td>
                <td className="p-2">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="p-2">
                  {order.status === "pending" ? (
                    <button
                      onClick={() => navigate(`/payment/${order.id}`)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Pay
                    </button>
                  ) : (
                    <span className="text-gray-500 italic">Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}