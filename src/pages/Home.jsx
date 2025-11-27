import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItems } from "../api/items";
import ItemCard from "../components/ItemCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [latestItems, setLatestItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadItems() {
      try {
        const res = await getItems({
          limit: 10,
          sort: "created_at:desc",
        });

        // console.log("📦 FULL API RESPONSE:", res);
        // console.log("📦 res.data:", res?.data);
        // console.log("📦 res.data.data:", res?.data?.data);

        const data = res?.data?.data;

        // Pastikan items adalah array
        const safeItems = Array.isArray(data?.items) ? data.items : [];

        // console.log("➡️ SAFE EXTRACTED ITEMS:", safeItems);

        setLatestItems(safeItems);
      } catch (err) {
        // console.error("❌ ERROR getItems:", err);
        setLatestItems([]); // tetap array agar .map() tidak error
      } finally {
        setLoadingItems(false);
      }
    }

    loadItems();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="border-b border-gray-200 min-h-[70vh] md:min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* TEXT */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 leading-tight">
              Temukan Buku Terbaik Untuk Perjalanan Belajarmu
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-4 max-w-md">
              Jelajahi koleksi buku pilihan kami dari berbagai kategori.
              Temukan buku yang menginspirasi dan menambah wawasanmu.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("latestBooks")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="mt-6 px-5 py-3 sm:px-6 sm:py-3.5 rounded-lg transition text-sm sm:text-base font-medium bg-[#3e6dc8] hover:bg-[#345ab0] text-white"
            >
              Jelajahi Buku
            </button>
          </div>

          {/* IMAGE */}
          <div className="hidden md:flex justify-center">
            <img
              src="https://picsum.photos/id/29/500/650"
              alt="Books"
              className="rounded-xl shadow-lg object-cover max-h-[520px] w-full"
            />
          </div>
        </div>
      </section>

      {/* Koleksi Buku Terbaru */}
      <div id="latestBooks" className="max-w-7xl mx-auto px-6 mt-14">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Koleksi Buku Terbaru
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md">
          Pilihan buku populer dan terbaru yang sedang digemari banyak pembaca.
        </p>
      </div>

      {/* LIST ITEMS */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-14">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {loadingItems ? (
            <p className="text-gray-500">Memuat data...</p>
          ) : latestItems.length > 0 ? (
            latestItems.map((item) => (
              <div key={item.slug} className="shrink-0 w-40 sm:w-44 md:w-48">
                <ItemCard
                  item={item}
                  onClick={() => navigate(`/items/${item.slug}`)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak dapat memuat daftar buku.</p>
          )}
        </div>
      </div>

      {/* Buku Populer */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Buku Populer / Rekomendasi
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md">
          Buku-buku pilihan yang bisa kamu baca selanjutnya.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 pb-24">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {latestItems.length > 0 ? (
            latestItems.map((item) => (
              <div key={item.slug} className="shrink-0 w-40 sm:w-44 md:w-48">
                <ItemCard
                  item={item}
                  onClick={() => navigate(`/items/${item.slug}`)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada rekomendasi buku.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}