import { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
} from "lucide-react";

export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  orderCount = 0,
  user = null,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenAuth,
  onLogout,
  onSearch,
  searchQuery = "",
  setSearchQuery,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const links = [
    { label: "Home", href: "#" },
    { label: "Shop All", href: "#products" },
    { label: "Collections", href: "#categories" },
    { label: "Why MarketNest", href: "#benefits" },
    { label: "Become a Seller", href: "https://multivendor-store-frontend-vendor.vercel.app/" },
  ];

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    const productsEl = document.getElementById("products");
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F8F5EC] border-b border-[#E6E0D2] shadow-xs">
      {/* Top Banner */}
      <div className="bg-[#174C3C] text-white py-1.5 sm:py-2 text-center text-[9px] sm:text-xs font-medium tracking-[0.15em] sm:tracking-[0.2em] px-3 sm:px-4 overflow-hidden text-ellipsis whitespace-nowrap">
        <span>INDIA&apos;S TRUSTED MULTI-VENDOR MARKETPLACE</span>
        <span className="mx-1.5 sm:mx-2 text-[#D5B779]">✦</span>
        <span className="text-[#D5B779] hidden xs:inline">DISCOVER UNIQUE FINDS</span>
      </div>

      {/* Main Navigation Container */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* ROW 1: Logo & Actions */}
        <div className="flex h-15 sm:h-20 items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <a href="#" className="flex flex-col group shrink-0">
            <span className="font-serif-heading text-xl sm:text-3xl font-bold tracking-tight text-[#174C3C] transition group-hover:text-[#0f3429]">
              MarketNest<span className="text-[#D5B779]">.</span>
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#68736C]">
              Curated with Character
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative py-1 text-sm font-medium text-[#68736C] transition-colors duration-200 hover:text-[#174C3C]"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#D5B779] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative items-center flex-1 max-w-xs lg:max-w-sm mx-2 lg:mx-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search products, brands and sellers..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white rounded-full border border-[#E6E0D2] text-[#202824] placeholder-[#68736C]/70 focus:outline-hidden focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C] transition-all shadow-2xs"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute left-3 text-[#68736C] hover:text-[#174C3C] transition"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Actions & Controls */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Account / User Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#E6E0D2] bg-white text-xs font-semibold text-[#174C3C] hover:border-[#174C3C] transition shadow-2xs min-h-[38px]"
                  aria-label="Account menu"
                >
                  <span className="w-2 h-2 rounded-full bg-[#26734D]"></span>
                  <span className="max-w-[65px] sm:max-w-[90px] truncate">
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#E6E0D2] shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-[#E6E0D2]">
                      <p className="font-bold text-[#202824] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#68736C] truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#E8EFE8] text-[9px] font-bold uppercase tracking-wider text-[#174C3C]">
                        {user.role || "Customer"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenOrders();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#F8F5EC] text-[#202824] flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#174C3C]" />
                        <span>My Orders</span>
                      </span>
                      {orderCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#D5B779] text-[#174C3C] text-[9px] font-bold">
                          {orderCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-[#C0392B] font-semibold border-t border-[#E6E0D2] flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full border border-[#E6E0D2] bg-white text-xs font-semibold text-[#174C3C] hover:border-[#174C3C] hover:bg-[#E8EFE8] transition shadow-2xs min-h-[38px] min-w-[38px]"
                aria-label="Login or Register"
                title="Login / Register"
              >
                <User className="h-4 w-4 text-[#174C3C]" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Orders Icon (Desktop Quick Access) */}
            {user && (
              <button
                type="button"
                onClick={onOpenOrders}
                className="hidden sm:flex p-2 text-[#202824] hover:text-[#174C3C] hover:bg-[#E8EFE8] rounded-full transition min-h-[38px] min-w-[38px] items-center justify-center"
                aria-label="My Orders"
                title="My Orders"
              >
                <Package className="h-5 w-5" />
              </button>
            )}

            {/* Wishlist */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative p-2 text-[#202824] hover:text-[#174C3C] hover:bg-[#E8EFE8] rounded-full transition min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label={`Wishlist (${wishlistCount} items)`}
              title="Wishlist"
            >
              <Heart className="h-5 w-5 text-[#202824] hover:text-[#174C3C]" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D5B779] text-[9px] font-bold text-[#174C3C] shadow-2xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-1.5 sm:gap-2 bg-[#174C3C] text-white p-2 sm:px-3.5 sm:py-2 rounded-full hover:bg-[#0f3429] transition shadow-xs text-xs font-semibold min-h-[38px] min-w-[38px] justify-center"
              aria-label={`Shopping Cart (${cartCount} items)`}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D5B779] text-[9px] font-bold text-[#174C3C] shadow-2xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#202824] hover:text-[#174C3C] lg:hidden rounded-xl border border-[#E6E0D2] bg-white min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ROW 2: Mobile Dedicated Full-Width Search Input */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search products, brands & sellers..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white rounded-full border border-[#E6E0D2] text-[#202824] placeholder-[#68736C]/75 focus:outline-hidden focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C] transition shadow-2xs"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68736C] hover:text-[#174C3C]"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  if (setSearchQuery) setSearchQuery("");
                  if (onSearch) onSearch("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68736C] hover:text-[#202824]"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E6E0D2] py-4 bg-[#F8F5EC] space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#202824] hover:bg-[#E8EFE8] rounded-xl transition"
              >
                {link.label}
              </a>
            ))}

            {user && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrders();
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-[#174C3C] hover:bg-[#E8EFE8] rounded-xl transition flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#174C3C]" />
                  <span>My Orders</span>
                </span>
                {orderCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D5B779] text-[#174C3C] text-xs font-bold">
                    {orderCount}
                  </span>
                )}
              </button>
            )}

            <div className="pt-3 border-t border-[#E6E0D2] flex gap-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-center py-2 text-sm font-semibold rounded-xl bg-white border border-[#E6E0D2] text-[#C0392B] flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({user.name?.split(" ")[0]})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full text-center py-2 text-sm font-semibold rounded-xl bg-white border border-[#E6E0D2] text-[#174C3C] flex items-center justify-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Login / Register</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="h-[2px] bg-linear-to-r from-[#F8F5EC] via-[#D5B779] to-[#F8F5EC]" />
    </header>
  );
}