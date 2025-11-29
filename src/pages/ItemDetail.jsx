import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItem } from "../api/items";
import { addToCart } from "../api/cart";
import FullscreenLoader from "../components/FullscreenLoader";
import NotFound from "./NotFound";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/format";
import { Star, Minus, Plus } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

export default function ItemDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  // Fetch item
  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const res = await getItem(slug);
        if (res.data?.data) {
          setItem(res.data.data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
        else setError("Terjadi kesalahan saat memuat item.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [slug]);

  // Set page title & meta
  useEffect(() => {
    if (item?.title) {
      document.title = `${item.title} | Bookify`;
      const description = item.description
        ? `${item.description.slice(0, 150)}...`
        : `Dapatkan buku berkualitas berjudul ${item.title} hanya di Bookify.`;
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    } else if (notFound) {
      document.title = "404 Not Found | Bookify";
    } else {
      document.title = "Loading Item... | Bookify";
    }
  }, [item, notFound]);

  const handleAddToCart = async () => {
    if (!auth.token) return navigate("/login");
    if (!item) return;

    setAdding(true);
    try {
      await addToCart({ item_id: item.id, quantity });
      setMessage(`Added ${quantity} ${item.title} to cart!`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!auth.token) return navigate("/login");
    if (!item) return;

    setBuying(true);
    setMessage("");
    try {
      const token = Cookies.get("token");

      const orderRes = await axios.post(
        `${BASE_URL}/items/${item.slug}/order`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const orderId = orderRes.data.data.slug;

      const paymentRes = await axios.post(
        `${BASE_URL}/payments`,
        { order_id: orderId, gateway: "midtrans" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentRes.data.data?.redirect_url) {
        window.location.href = paymentRes.data.data.redirect_url;
      } else {
        setMessage("Payment created successfully!");
        navigate(`/payment/${orderId}`);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to buy item");
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <FullscreenLoader />;
  if (notFound) return <NotFound />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const images = item.images?.length
    ? item.images
    : Array.from({ length: 12 }, (_, i) =>
        `https://picsum.photos/seed/${item.id}-${i + 1}/400/550`
      );

  const stock = item.stock ?? 0;
  const rating = item.rating ?? 4.5;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* LEFT: IMAGES */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="w-full aspect-square rounded-lg overflow-hidden mb-4">
            <img src={images[activeImage]} alt={item.title} className="w-full h-full object-cover" />
          </div>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="relative w-full flex space-x-2 overflow-x-auto scrollbar-hide">
              {images.slice(0, 12).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-20 aspect-square rounded overflow-hidden border-2 transition-all duration-150 ${
                    idx === activeImage
                      ? "border-[#3e6dc8] ring-2 ring-[#3e6dc8]/40"
                      : "border-gray-300 hover:border-[#3e6dc8]/60"
                  }`}
                >
                  <img src={img} alt={`thumb ${idx}`} loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: INFO */}
        <div className="md:w-1/2 flex flex-col justify-start items-start space-y-4">
          <p className="text-sm text-gray-500 uppercase">{item.category?.name || "Fiction"}</p>
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="text-gray-700">{item.author || "Unknown Author"}</p>
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">20% OFF</span>
            <p className="text-xl text-gray-400 line-through">{formatPrice(item.price)}</p>
            <p className="text-2xl font-bold text-[#3e6dc8]">{formatPrice(Math.round(item.price * 0.8))}</p>
          </div>

          <p className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
            stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </p>

          {item.description && <p className="text-gray-700 mt-2">{item.description}</p>}

          {/* QUANTITY & ACTIONS */}
          <div className="flex flex-col gap-3 mt-4 w-full">
            <div className="flex items-center gap-3">
              <div className="qty-input-wrapper flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button disabled={quantity <= 1} onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-1.5 py-2.5 disabled:opacity-40 hover:bg-gray-100"><Minus size={18} /></button>
                <input type="number" min="1" max={stock} value={quantity} onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value)), stock))} className="w-10 text-center font-medium text-gray-700 focus:outline-none" />
                <button disabled={quantity >= stock} onClick={() => setQuantity((q) => Math.min(stock, q + 1))} className="px-1.5 py-2.5 disabled:opacity-40 hover:bg-gray-100"><Plus size={18} /></button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 w-full">
              <button onClick={handleAddToCart} disabled={adding || stock === 0} className="px-5 py-3 rounded-lg font-medium border text-[#3e6dc8] border-[#3e6dc8] bg-white hover:bg-[#e0e7ff] disabled:opacity-50">{adding ? "Adding..." : "Add to Cart"}</button>
              <button onClick={handleBuyNow} disabled={buying || stock === 0} className="px-5 py-3 rounded-lg text-white font-medium bg-[#3e6dc8] hover:bg-[#345ab0] disabled:opacity-50">{buying ? "Processing..." : "Buy Now"}</button>
            </div>
          </div>

          {message && <p className="text-green-500">{message}</p>}
        </div>
      </section>
    </div>
  );
}