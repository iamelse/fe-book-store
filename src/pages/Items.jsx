import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react"; // <-- import icon lucide

import Footer from "../components/Footer";
import ItemCard from "../components/ItemCard";
import { getItems } from "../api/items";
import { getCategories } from "../api/categories";

export default function Items() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [localFilter, setLocalFilter] = useState({
    search: "",
    category: "",
    min_price: "",
    max_price: "",
    sort: "",
    limit: "10",
  });

  useEffect(() => {
    const paramsObj = Object.fromEntries(searchParams);
    setLocalFilter({
      search: paramsObj.search || "",
      category: paramsObj.category || "",
      min_price: paramsObj.min_price || "",
      max_price: paramsObj.max_price || "",
      sort: paramsObj.sort || "",
      limit: paramsObj.limit || "10",
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data?.data || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const extractItems = (raw) => raw?.data?.items || raw?.items || raw?.data || [];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const paramsObj = Object.fromEntries(searchParams);
      const res = await getItems(paramsObj);
      const parsedItems = extractItems(res.data);

      setTimeout(() => {
        setItems(parsedItems);
        setPagination({
          current_page: res.data?.data?.meta?.pagination?.current_page,
          last_page: res.data?.data?.meta?.pagination?.last_page,
          per_page: res.data?.data?.meta?.pagination?.per_page,
          total: res.data?.data?.meta?.pagination?.total,
          prev_url: res.data?.data?.links?.prev,
          next_url: res.data?.data?.links?.next,
        });
        setLoading(false);
      }, 500);
    } catch {
      setTimeout(() => {
        setItems([]);
        setPagination(null);
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => { fetchItems(); }, [searchParams]);

  const applyFilter = () => {
    const params = new URLSearchParams();
    Object.entries(localFilter).forEach(([key, value]) => {
      if (value !== "" && value != null) params.set(key, value);
    });
    params.set("page", "1");
    setSearchParams(params);
  };

  const resetFilter = () => {
    setLocalFilter({
      search: "",
      category: "",
      min_price: "",
      max_price: "",
      sort: "",
      limit: "10",
    });
    setSearchParams({ page: 1 });
  };

  const handleChange = (key, value) => setLocalFilter(prev => ({ ...prev, [key]: value }));
  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Koleksi Buku</h1>
        <p className="text-gray-600 mt-1 mb-6 max-w-2xl">
          Temukan berbagai koleksi buku pilihan dari beragam kategori. Gunakan filter di sebelah kiri.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* SIDEBAR */}
          <div className="bg-white p-5 rounded-lg shadow h-fit">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter</h2>
            <div className="flex flex-col gap-4">

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Cari Buku</label>
                <input
                  type="text"
                  placeholder="Keyword dari author, title, atau description..."
                  className="border rounded-lg px-3 py-2 text-sm placeholder-gray-500"
                  value={localFilter.search}
                  onChange={e => handleChange("search", e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                  value={localFilter.category}
                  onChange={e => handleChange("category", e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Harga Minimum</label>
                <input
                  type="number"
                  placeholder="Harga Minimum"
                  className="border rounded-lg px-3 py-2 text-sm placeholder-gray-500"
                  value={localFilter.min_price}
                  onChange={e => handleChange("min_price", e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Harga Maksimum</label>
                <input
                  type="number"
                  placeholder="Harga Maksimum"
                  className="border rounded-lg px-3 py-2 text-sm placeholder-gray-500"
                  value={localFilter.max_price}
                  onChange={e => handleChange("max_price", e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Urutkan</label>
                <select
                  className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                  value={localFilter.sort}
                  onChange={e => handleChange("sort", e.target.value)}
                >
                  <option value="">Urutkan berdasarkan</option>
                  <option value="price:asc">Harga: Rendah → Tinggi</option>
                  <option value="price:desc">Harga: Tinggi → Rendah</option>
                  <option value="created_at:desc">Terbaru</option>
                  <option value="created_at:asc">Terlama</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Jumlah / Halaman</label>
                <select
                  className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                  value={localFilter.limit}
                  onChange={e => handleChange("limit", e.target.value)}
                >
                  <option value="10">10 / halaman</option>
                  <option value="20">20 / halaman</option>
                  <option value="50">50 / halaman</option>
                </select>
              </div>

              <button
                onClick={applyFilter}
                className="bg-[#3e6dc8] hover:bg-[#355faf] text-white font-medium py-2 rounded-lg text-sm transition"
              >
                Terapkan Filter
              </button>
              <button
                onClick={resetFilter}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg text-sm transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="md:col-span-3">
            {loading && (
              <div className="flex justify-center py-10">
                <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}

            {!loading && items.length === 0 && (
              <p className="text-center py-10 text-gray-500">Tidak ada buku ditemukan.</p>
            )}

            {!loading && items.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 transition-opacity duration-500 opacity-0 animate-fade-in">
                {items.map(item => (
                  <ItemCard
                    key={item.slug}
                    item={item}
                    onClick={() => navigate(`/items/${item.slug}`)}
                  />
                ))}
              </div>
            )}

            {/* PAGINASI */}
            {pagination && !loading && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  disabled={pagination.current_page <= 1}
                  onClick={() => goToPage(pagination.current_page - 1)}
                  className={`px-3 py-2 rounded-lg text-sm border transition ${
                    pagination.current_page > 1
                      ? "bg-white hover:bg-gray-100 flex items-center gap-1"
                      : "bg-gray-200 cursor-not-allowed flex items-center gap-1"
                  }`}
                >
                  <ArrowLeft size={16} /> Sebelumnya
                </button>

                {(() => {
                  const pages = [];
                  const current = pagination.current_page;
                  const last = pagination.last_page;

                  let start = Math.max(1, current - 2);
                  let end = Math.min(last, current + 2);

                  if (current <= 2) end = Math.min(last, 5);
                  if (current >= last - 1) start = Math.max(1, last - 4);

                  for (let p = start; p <= end; p++) {
                    pages.push(
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`px-3 py-2 rounded-lg text-sm border transition ${
                          p === current
                            ? "bg-[#3e6dc8] text-white border-[#3e6dc8]"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  }

                  return pages;
                })()}

                <button
                  disabled={pagination.current_page >= pagination.last_page}
                  onClick={() => goToPage(pagination.current_page + 1)}
                  className={`px-3 py-2 rounded-lg text-sm border transition ${
                    pagination.current_page < pagination.last_page
                      ? "bg-white hover:bg-gray-100 flex items-center gap-1"
                      : "bg-gray-200 cursor-not-allowed flex items-center gap-1"
                  }`}
                >
                  Berikutnya <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s forwards;
          }
        `}
      </style>
    </div>
  );
}