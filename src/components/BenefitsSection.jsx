export default function BenefitsSection() {
  const benefits = [
    {
      title: "Multiple Trusted Sellers",
      description: "Directly connect with vetted artisan studios, local designers, and independent brands across India.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Secure Payments",
      description: "Protected transactions with bank-grade 256-bit encryption, UPI, cards, and net-banking integration.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: "Fast & Reliable Delivery",
      description: "Trackable Pan-India shipping with real-time updates and careful doorstep packaging.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: "Support Small Businesses",
      description: "Every purchase directly empowers local entrepreneurs, makers, and homegrown creative communities.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-[#F8F5EC] border-b border-[#E6E0D2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#174C3C] mb-2 block">
            The MarketNest Difference
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#202824]">
            Why Choose MarketNest?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#68736C]">
            We bridge the gap between discerning customers and talented independent creators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-[#E6E0D2] transition-all duration-300 hover:border-[#D5B779] hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EFE8] text-[#174C3C] mb-5 border border-[#174C3C]/10">
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#202824] mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#68736C] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
