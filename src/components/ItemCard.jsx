import { formatPrice } from "../utils/format";
import { Star } from "lucide-react";

export default function ItemCard({ item, onClick }) {
  const picsumId = item.id ? item.id % 1085 : 1;

  const imageSrc =
    item.image && item.image.trim() !== ""
      ? item.image
      : `https://picsum.photos/id/${picsumId}/400/600`;

  const discount = item.discount ?? 20;
  const rating = item.rating ?? 4.5;

  return (
    <div
      className="
        bg-card overflow-hidden rounded-xl
        md3-elevation-2
        transition-all duration-200 ease-out cursor-pointer
        hover:md3-elevation-3 hover:scale-[1.01] hover:-translate-y-[2px]
        flex flex-col
      "
    >
      {/* Klik menuju detail */}
      <div onClick={onClick} className="flex-1">
        <div className="relative w-full aspect-[1/1.4] bg-muted overflow-hidden">
          
          {/* Discount */}
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow">
            -{discount}%
          </div>

          {/* Rating */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            {rating}
          </div>

          {/* Image */}
          <img
            src={imageSrc}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg md:rounded-xl"
            loading="lazy"
          />
        </div>

        <div className="py-3 sm:py-4 flex flex-col space-y-1.5 sm:space-y-2">
          {/* Title */}
          <h3
            className="text-base sm:text-lg md:text-xl font-medium text-foreground line-clamp-1 hover:text-[#3e6dc8] transition"
          >
            {item.title}
          </h3>

          {/* Author */}
          <p className="text-xs sm:text-sm text-muted-foreground">
            {item.author || "Unknown Author"}
          </p>

          {/* Price */}
          <span className="text-base sm:text-lg font-semibold pt-1" style={{ color: "#3e6dc8" }}>
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </div>
  );
}