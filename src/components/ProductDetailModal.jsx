import { useState } from "react";

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"];

  const maxStock = typeof product.stock === "number" ? product.stock : 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-[#E6E0D2] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#68736C] hover:text-[#202824] hover:bg-[#E6E0D2] transition z-10"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Images */}
          <div className="space-y-3">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#F8F5EC] border border-[#E6E0D2]">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.name || product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                      activeImageIndex === idx ? "border-[#174C3C]" : "border-[#E6E0D2] opacity-70"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info and Actions */}
          <div className="flex flex-col h-full">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#174C3C] bg-[#E8EFE8] px-2.5 py-1 rounded-full">
                {product.category || "Curated"}
              </span>
              {product.brand && (
                <span className="text-xs text-[#68736C]">by {product.brand}</span>
              )}
            </div>

            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#202824]">
              {product.name || product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex text-[#D5B779]">
                {"★".repeat(Math.round(product.rating || 5))}
              </div>
              <span className="font-bold text-[#202824]">{product.rating || 4.8}</span>
              <span className="text-[#68736C]">({product.ratingCount || 36} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-serif-heading text-3xl font-bold text-[#174C3C]">
                ₹{(product.price || 0).toLocaleString("en-IN")}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[#68736C] line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-xs font-bold text-[#26734D] bg-[#26734D]/10 px-2 py-0.5 rounded-full">
                In Stock ({maxStock} available)
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-xs sm:text-sm text-[#68736C] leading-relaxed">
              {product.description || "Authentic quality crafted with care by independent artisans and sellers."}
            </p>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-xs font-semibold text-[#202824]">Quantity:</span>
              <div className="flex items-center border border-[#E6E0D2] rounded-xl bg-[#F8F5EC] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 text-sm font-bold text-[#68736C] hover:bg-white transition"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-[#202824]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  className="px-3.5 py-1.5 text-sm font-bold text-[#68736C] hover:bg-white transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-6 border-t border-[#E6E0D2] flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onAddToCart({ ...product, quantity });
                }}
                className="flex-1 py-3 rounded-full bg-[#174C3C] hover:bg-[#0f3429] text-white font-bold text-xs sm:text-sm transition shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span>Add {quantity > 1 ? `(${quantity}) ` : ""}to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                aria-label="Wishlist"
                className={`p-3 rounded-full border border-[#E6E0D2] transition ${
                  isWishlisted ? "bg-red-50 text-[#C0392B] border-red-200" : "bg-white text-[#202824] hover:bg-[#F8F5EC]"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isWishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
