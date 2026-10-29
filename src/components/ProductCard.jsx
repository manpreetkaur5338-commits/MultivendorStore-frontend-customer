import { Heart, ShoppingBag, Star } from "lucide-react";

export default function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) {
  const {
    _id,
    name,
    title,
    price = 0,
    originalPrice,
    description,
    image,
    images,
    category,
    stock = 10,
    rating = 4.8,
    ratingCount = 24,
    discountPercent = 20,
    brand,
  } = product;

  const displayName = name || title || "Curated Market Product";
  const displayImage =
    image ||
    (Array.isArray(images) && images[0]) ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";

  const calcOriginalPrice =
    originalPrice && originalPrice > price
      ? originalPrice
      : Math.round(price * 1.25);

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-[#E6E0D2] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#D5B779]/80 w-full min-w-0">
      {/* Top Image & Floating Badges */}
      <div
        onClick={() => onSelectProduct && onSelectProduct(product)}
        className="relative aspect-square w-full overflow-hidden bg-[#F8F5EC] cursor-pointer"
      >
        <img
          src={displayImage}
          alt={displayName}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-[#D5B779] text-[#174C3C] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shadow-2xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full backdrop-blur-xs transition shadow-xs cursor-pointer ${
            isWishlisted
              ? "bg-[#C0392B] text-white"
              : "bg-white/80 text-[#202824] hover:bg-white hover:text-[#C0392B]"
          }`}
        >
          <Heart
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Content Details */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#68736C] mb-1">
          <span className="uppercase tracking-wider font-semibold text-[9px] sm:text-[10px] text-[#174C3C] truncate max-w-[65%]">
            {category || "Curated"}
          </span>
          <div className="flex items-center gap-0.5 text-[#D5B779] shrink-0">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#202824]">{rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="font-semibold text-xs sm:text-sm md:text-base text-[#202824] line-clamp-2 leading-snug group-hover:text-[#174C3C] transition cursor-pointer min-h-[2rem] sm:min-h-[2.5rem]"
          title={displayName}
        >
          {displayName}
        </h3>

        {/* Brand / Seller */}
        {brand && (
          <p className="text-[10px] sm:text-[11px] text-[#68736C] truncate mt-0.5">by {brand}</p>
        )}

        {/* Price & Stock info */}
        <div className="mt-2 pt-2 border-t border-[#E6E0D2] flex flex-wrap items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base md:text-lg font-bold text-[#174C3C]">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {calcOriginalPrice > price && (
              <span className="text-[10px] sm:text-xs text-[#68736C] line-through">
                ₹{calcOriginalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <span className={`text-[9px] sm:text-[10px] font-medium ${stock > 0 ? "text-[#26734D]" : "text-[#C0392B]"}`}>
            {stock > 0 ? `${stock} left` : "Sold out"}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          disabled={stock <= 0}
          className="mt-2.5 w-full py-1.5 sm:py-2.5 px-2 sm:px-4 bg-[#174C3C] text-white text-[11px] sm:text-xs md:text-sm font-semibold rounded-xl hover:bg-[#0f3429] active:scale-98 transition flex items-center justify-center gap-1.5 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-2xs cursor-pointer min-h-[34px] sm:min-h-[40px]"
        >
          <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
