import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getItems } from "../api/items";
import ItemCard from "../components/ItemCard";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper";
import { ArrowLeft, ArrowRight, Book, FileText, Star, Smile } from "lucide-react";
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

  const categories = [
    {
      name: 'Fiction',
      slug: 'fiction',
      description: 'Kategori buku fiksi, termasuk novel dan cerita imajinatif.',
      icon: <Book className="w-6 h-6 text-blue-500" />,
    },
    {
      name: 'Non-fiction',
      slug: 'non-fiction',
      description: 'Kategori buku non-fiksi, termasuk biografi, sejarah, dan self-help.',
      icon: <FileText className="w-6 h-6 text-green-500" />,
    },
    {
      name: 'Fantasy',
      slug: 'fantasy',
      description: 'Kategori buku fantasi, dengan cerita yang melibatkan unsur magis dan dunia imajinatif.',
      icon: <Star className="w-6 h-6 text-purple-500" />,
    },
    {
      name: 'Self-Help',
      slug: 'self-help',
      description: 'Kategori buku yang berfokus pada pengembangan diri, kebiasaan baik, dan motivasi.',
      icon: <Smile className="w-6 h-6 text-yellow-500" />,
    },
  ];

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
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-10 relative group">
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="rounded-xl overflow-hidden"
          style={{ "--swiper-pagination-color": "white" }}
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="cursor-pointer" onClick={() => navigate(slide.link)}>
                <img
                  src={slide.image}
                  alt={`slide-${idx}`}
                  className="w-full aspect-[2/1] sm:aspect-[3/1] md:aspect-[3/1] object-cover rounded-xl"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom arrows */}
        <button
          className="absolute left-0.5 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={() => swiperRef.current.swiper.slidePrev()}
        >
          <ArrowLeft size={20} />
        </button>
        <button
          className="absolute right-0.5 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={() => swiperRef.current.swiper.slideNext()}
        >
          <ArrowRight size={20} />
        </button>
      </section>

      {/* KATEGORI BUKU */}
      <section className="max-w-7xl mx-auto px-6 mt-14">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Jelajahi Kategori Buku
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md">
          Temukan buku berdasarkan kategori favorit Anda.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="cursor-pointer p-4 border rounded-lg hover:shadow-md transition-shadow flex flex-col items-start gap-2"
              onClick={() => navigate(`/items?category=${cat.slug}`)}
            >
              <div>{cat.icon}</div>
              <h3 className="font-medium text-gray-700">{cat.name}</h3>
              <p className="text-gray-400 text-sm">{cat.description}</p>
            </div>
          ))}
        </div>
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

      {/* List Items */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-14">
        {loadingItems ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : latestItems.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {latestItems.map((item) => (
              <div key={item.slug} className="shrink-0 w-40 sm:w-44 md:w-48">
                <ItemCard item={item} onClick={() => navigate(`/items/${item.slug}`)} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">Tidak dapat memuat daftar buku.</p>
        )}
      </div>
    </div>
  );
}