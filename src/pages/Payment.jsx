import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

export default function Payment() {
  const { orderId } = useParams();
  const [gateway, setGateway] = useState("midtrans");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Ambil redirect URL dari response gateway
  const getRedirectUrl = (gateway, response) => {
    if (!response) return null;

    switch (gateway) {
      case "midtrans":
        return response?.midtrans_response?.redirect_url ?? response?.payment_url ?? null;
      case "xendit":
        return response?.invoice_url ?? response?.meta?.invoice_url ?? null;
      default:
        return null;
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = Cookies.get("token");
      const res = await axios.post(
        `${BASE_URL}/payments`,
        { order_id: orderId, gateway },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const gatewayResponse = res.data?.data?.gateway_response;
      const redirectUrl = getRedirectUrl(gateway, gatewayResponse);

      if (redirectUrl) {
        window.open(redirectUrl, "_blank"); // buka di new tab
        setMessage(`Payment page opened in new tab for ${gateway}`);
      } else {
        setMessage("Payment created successfully, but no redirect URL found.");
      }

      console.log(`=== Full response for ${gateway} ===`, res.data);
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Failed to create payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-md mx-auto bg-white shadow rounded mt-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Payment</h1>

        <p className="mb-4 text-gray-700 text-center">
          Order ID: <span className="font-bold">{orderId}</span>
        </p>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Select Payment Gateway:</label>
          <select
            value={gateway}
            onChange={(e) => setGateway(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="midtrans">Midtrans</option>
            <option value="xendit">Xendit</option>
          </select>
        </div>

        {message && (
          <div
            className={`mb-4 text-center ${
              message.toLowerCase().includes("failed") || message.toLowerCase().includes("error")
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}