export default function SellerCTA({ onOpenSellerModal }) {
  return (
    <section id="seller" className="py-16 sm:py-20 bg-[#174C3C] text-white relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#D5B779]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#D5B779]/20 text-[#D5B779] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Partner With Us
          </span>

          <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Are You a Seller?
          </h2>

          <p className="mt-5 text-base sm:text-lg text-[#F8F5EC]/90 leading-relaxed max-w-2xl mx-auto">
            Join our marketplace and reach thousands of passionate shoppers looking for high quality, independent goods. Low commission rates, easy catalog management, and prompt payouts.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenSellerModal}
              className="px-8 py-3.5 rounded-full bg-[#D5B779] hover:bg-[#be9d58] text-[#174C3C] font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Become a Seller
            </button>
            <a
              href="#about"
              className="px-6 py-3.5 rounded-full border border-white/30 text-white hover:bg-white/10 font-medium text-sm sm:text-base transition-all"
            >
              Learn More
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/15 max-w-lg mx-auto text-center">
            <div>
              <p className="font-serif-heading text-2xl font-bold text-[#D5B779]">0%</p>
              <p className="text-[11px] text-[#F8F5EC]/80 mt-1">Listing Fee First 3 Mos</p>
            </div>
            <div>
              <p className="font-serif-heading text-2xl font-bold text-[#D5B779]">Pan-India</p>
              <p className="text-[11px] text-[#F8F5EC]/80 mt-1">Logistics Support</p>
            </div>
            <div>
              <p className="font-serif-heading text-2xl font-bold text-[#D5B779]">Weekly</p>
              <p className="text-[11px] text-[#F8F5EC]/80 mt-1">Direct Bank Payouts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
