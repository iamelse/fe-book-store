import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getItems } from "../api/items";
import ItemCard from "../components/ItemCard";
import Footer from "../components/Footer";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";

SwiperCore.use([Pagination, Autoplay]);

export default function Home() {
  const [latestItems, setLatestItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const slides = [
    { image: "https://picsum.photos/id/1015/1200/400", link: "/items/book-1" },
    { image: "https://picsum.photos/id/1016/1200/400", link: "/items/book-2" },
    { image: "https://picsum.photos/id/1018/1200/400", link: "/items/book-3" },
    { image: "https://picsum.photos/id/1020/1200/400", link: "/items/book-4" },
    { image: "https://picsum.photos/id/1024/1200/400", link: "/items/book-5" },
  ];

  // Load latest items
  useEffect(() => {
    async function loadItems() {
      try {
        const res = await getItems({ limit: 10, sort: "created_at:desc" });
        const safeItems = Array.isArray(res?.data?.data?.items)
          ? res.data.data.items
          : [];
        setLatestItems(safeItems);
      } catch {
        setLatestItems([]);
      } finally {
        setLoadingItems(false);
      }
    }
    loadItems();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO CAROUSEL */}
      <section className="max-w-7xl mx-auto px-6 pt-10 relative group">
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="rounded-xl overflow-hidden"
          style={{
            "--swiper-pagination-color": "white",
          }}
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="cursor-pointer"
                onClick={() => navigate(slide.link)}
              >
                <img
                  src={slide.image}
                  alt={`slide-${idx}`}
                  className="w-full aspect-[3/1] object-cover rounded-xl"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom circular navigation, muncul saat hover/focus */}
        <button
          className="absolute left-1 z-10 top-1/2 transform -translate-y-1/2 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          onClick={() => swiperRef.current.swiper.slidePrev()}
        >
          <ArrowLeft size={20} />
        </button>

        <button
          className="absolute right-1 z-10 top-1/2 transform -translate-y-1/2 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          onClick={() => swiperRef.current.swiper.slideNext()}
        >
          <ArrowRight size={20} />
        </button>
      </section>

      {/* Koleksi Buku Terbaru */}
      <div className="max-w-7xl mx-auto px-6 mt-14">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Koleksi Buku Terbaru
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md">
          Pilihan buku populer dan terbaru yang sedang digemari banyak pembaca.
        </p>
      </div>

      {/* LIST ITEMS */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-14">
        {loadingItems ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : latestItems.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {latestItems.map((item) => (
              <div key={item.slug} className="shrink-0 w-40 sm:w-44 md:w-48">
                <ItemCard
                  item={item}
                  onClick={() => navigate(`/items/${item.slug}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Tidak dapat memuat daftar buku.</p>
        )}
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

      <Footer />
    </div>
  );
}