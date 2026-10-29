import { useMemo } from "react";

export default function CategorySection({
  selectedCategory,
  onSelectCategory,
  categories = [],
}) {
  return (
    <section id="categories" className="py-14 sm:py-16 bg-[#F8F5EC] border-b border-[#E6E0D2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#174C3C] mb-1.5 block">
              Curated Collections
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#202824]">
              Shop by Category
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className="text-xs sm:text-sm font-semibold text-[#174C3C] hover:text-[#0f3429] inline-flex items-center gap-1 transition"
          >
            <span>View All Categories</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* Categories scrollable or grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* 'All' Category button */}
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border transition-all duration-200 text-center group cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#174C3C] text-white border-[#174C3C] shadow-md scale-[1.02]"
                : "bg-white text-[#202824] border-[#E6E0D2] hover:border-[#D5B779] hover:bg-[#E8EFE8] hover:shadow-xs"
            }`}
          >
            <span className="text-2xl sm:text-3xl mb-2 transition-transform group-hover:scale-110">
              ✨
            </span>
            <span className="text-xs sm:text-sm font-semibold">All Categories</span>
          </button>

          {/* Database Categories */}
          {categories.map((cat) => {
            const catSlug = cat.slug || cat.id || cat.name?.toLowerCase();
            const isSelected = selectedCategory?.toLowerCase() === catSlug?.toLowerCase();

            return (
              <button
                key={cat._id || cat.id}
                type="button"
                onClick={() => onSelectCategory(catSlug)}
                className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border transition-all duration-200 text-center group cursor-pointer ${
                  isSelected
                    ? "bg-[#174C3C] text-white border-[#174C3C] shadow-md scale-[1.02]"
                    : "bg-white text-[#202824] border-[#E6E0D2] hover:border-[#D5B779] hover:bg-[#E8EFE8] hover:shadow-xs"
                }`}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mb-2 border border-[#E6E0D2]"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl mb-2 transition-transform group-hover:scale-110">
                    🏷️
                  </span>
                )}
                <span className="text-xs sm:text-sm font-semibold line-clamp-1">
                  {cat.name}
                </span>
                {cat.count && (
                  <span className={`text-[10px] mt-0.5 ${isSelected ? "text-[#D5B779]" : "text-[#68736C]"}`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
