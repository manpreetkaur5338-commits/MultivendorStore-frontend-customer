export default function Footer({ onCategoryClick }) {
  return (
    <footer className="bg-[#0f3429] text-[#F8F5EC] border-t border-[#174C3C]">
      {/* Upper Newsletter & Brand Teaser */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D5B779] mb-2 block">
                Stay In The Loop
              </span>
              <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">
                Subscribe to Our Newsletter
              </h3>
              <p className="mt-2 text-sm text-[#F8F5EC]/70 max-w-md">
                Get weekly curated finds, stories about our independent sellers, and exclusive subscriber perks.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing to MarketNest updates!");
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-md md:ml-auto w-full"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-hidden focus:border-[#D5B779] flex-1"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#D5B779] text-[#174C3C] font-bold text-sm hover:bg-[#be9d58] transition shadow-xs"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#" className="inline-block mb-4">
              <span className="font-serif-heading text-3xl font-bold text-white">
                MarketNest<span className="text-[#D5B779]">.</span>
              </span>
            </a>
            <p className="text-sm text-[#F8F5EC]/80 leading-relaxed max-w-sm mb-6">
              India&apos;s trusted multi-vendor marketplace connecting conscious shoppers with independent artisans, craftspeople, and passionate small business owners.
            </p>
            <div className="flex items-center gap-3">
              {["Twitter", "Instagram", "Facebook", "LinkedIn"].map((platform) => (
                <a
                  key={platform}
                  href={`#${platform.toLowerCase()}`}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#D5B779] hover:text-[#174C3C] transition text-xs font-bold"
                  aria-label={platform}
                >
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D5B779] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F8F5EC]/80">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#products" className="hover:text-white transition">Shop All</a></li>
              <li><a href="#categories" className="hover:text-white transition">Collections</a></li>
              <li><a href="#benefits" className="hover:text-white transition">Why MarketNest</a></li>
              <li><a href="#seller" className="hover:text-white transition">Sell on MarketNest</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D5B779] mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F8F5EC]/80">
              <li><a href="#categories" className="hover:text-white transition">Fashion & Apparel</a></li>
              <li><a href="#categories" className="hover:text-white transition">Electronics & Gadgets</a></li>
              <li><a href="#categories" className="hover:text-white transition">Home & Living</a></li>
              <li><a href="#categories" className="hover:text-white transition">Beauty & Wellness</a></li>
              <li><a href="#categories" className="hover:text-white transition">Handmade Crafts</a></li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D5B779] mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F8F5EC]/80">
              <li><a href="#contact" className="hover:text-white transition">Help & FAQs</a></li>
              <li><a href="#shipping" className="hover:text-white transition">Shipping Policy</a></li>
              <li><a href="#returns" className="hover:text-white transition">Returns & Exchanges</a></li>
              <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F8F5EC]/60 gap-4">
          <p>© {new Date().getFullYear()} MarketNest Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Made with care for Indian small businesses</span>
            <span className="text-[#D5B779]">✦</span>
            <span>100% Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
