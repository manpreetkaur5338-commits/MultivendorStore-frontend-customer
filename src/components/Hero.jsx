import { useState } from "react";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
} from "lucide-react";


export default function Hero({ onSearch }) {
  const [localSearch, setLocalSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && localSearch.trim()) {
      onSearch(localSearch.trim());
    }
    const productsEl = document.getElementById("products");
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#F8F5EC] border-b border-[#E6E0D2] flex flex-col justify-center">
      {/* 
        HERO BACKGROUND IMAGE & GRADIENT OVERLAY:
        - On mobile & tablet (< lg): Covers the entire hero section background (`object-cover object-right sm:object-center`) with a translucent warm-offwhite overlay (`bg-[#F8F5EC]/88 sm:bg-[#F8F5EC]/85`), guaranteeing text legibility without requiring any separate image element underneath!
        - On desktop (lg+): Ambient right-side blend with clean directional gradient fade.
      */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src="/images/hero.png"
          alt="MarketNest Multi-Vendor Marketplace"
          className="w-full h-full object-cover object-right sm:object-center select-none"
          loading="eager"
          fetchPriority="high"
          onError={(e) => {
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "true";
              e.target.src = "/hero.png";
            }
          }}
        />
        {/* Mobile & Tablet full-screen protective warm overlay */}
        <div className="lg:hidden absolute inset-0 bg-[#F8F5EC]/88 backdrop-blur-[1px]" />
        {/* Desktop directional fade overlay */}
        <div className="hidden lg:block absolute inset-0 bg-linear-to-r from-[#F8F5EC] via-[#F8F5EC]/85 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 w-full">
        <div className="max-w-xl lg:max-w-2xl flex flex-col justify-center text-left">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#174C3C] mb-2 sm:mb-3">
            <span className="h-[2px] w-6 sm:w-8 bg-[#D5B779]" />
            <span>India&apos;s Trusted Multi-Vendor Hub</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-[#202824] leading-[1.15]">
            Shop from Multiple Sellers,{" "}
            <span className="text-[#D5B779] italic font-serif-heading block sm:inline">
              All in One Place
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-sm md:text-base text-[#68736C] leading-relaxed max-w-xl">
            Discover unique artisan creations, daily lifestyle essentials, and support independent homegrown creators across India.
          </p>

          {/* Hero Search Bar - Full-width on mobile, constrained on desktop */}
          

          {/* CTA Buttons */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-4">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#174C3C] text-white text-xs sm:text-sm font-semibold hover:bg-[#0f3429] transition-all shadow-sm hover:shadow-md active:scale-95 min-h-[40px]"
            >
              <span>Shop Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>

            <a
              href="https://multivendor-store-frontend-vendor.vercel.app/"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 border-[#D5B779] bg-white/80 text-[#174C3C] text-xs sm:text-sm font-semibold hover:bg-[#D5B779]/20 transition-all active:scale-95 shadow-2xs min-h-[40px]"
            >
              <span>Become a Seller</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[#E6E0D2] grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EFE8] text-[#174C3C]">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold text-[#202824] leading-tight">Verified Sellers</p>
                <p className="text-[9px] sm:text-[10px] text-[#68736C]">100% authentic</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EFE8] text-[#174C3C]">
                <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold text-[#202824] leading-tight">Secure Checkout</p>
                <p className="text-[9px] sm:text-[10px] text-[#68736C]">Protected escrow</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EFE8] text-[#174C3C]">
                <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold text-[#202824] leading-tight">Pan-India Delivery</p>
                <p className="text-[9px] sm:text-[10px] text-[#68736C]">Tracked doorstep</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EFE8] text-[#174C3C]">
                <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold text-[#202824] leading-tight">Easy Returns</p>
                <p className="text-[9px] sm:text-[10px] text-[#68736C]">Hassle-free policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}