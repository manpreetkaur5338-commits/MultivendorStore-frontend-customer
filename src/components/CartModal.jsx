export default function CartModal({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E6E0D2] bg-[#F8F5EC]">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-[#174C3C]">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <h3 className="font-serif-heading text-xl font-bold text-[#202824]">
              Shopping Cart ({cartItems.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#68736C] hover:text-[#202824] hover:bg-[#E6E0D2] transition"
            aria-label="Close cart"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#E8EFE8] flex items-center justify-center text-[#174C3C] mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className="font-serif-heading text-lg font-bold text-[#202824]">Your cart is empty</p>
              <p className="text-xs text-[#68736C] mt-1 max-w-xs">
                Explore our curated collections and support independent sellers.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#0f3429] transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemTotal = (item.price || 0) * (item.quantity || 1);
              return (
                <div
                  key={item._id}
                  className="flex gap-4 p-3 rounded-xl border border-[#E6E0D2] bg-[#F8F5EC]/50"
                >
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80"}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-white"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-[#202824] line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item._id)}
                        className="text-xs text-[#C0392B] hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-[#174C3C]">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </span>

                      {/* Quantity controls */}
                      <div className="flex items-center border border-[#E6E0D2] rounded-lg bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item._id, (item.quantity || 1) - 1)}
                          className="px-2.5 py-1 text-xs font-bold text-[#68736C] hover:bg-[#E8EFE8]"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-[#202824]">
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item._id, (item.quantity || 1) + 1)}
                          className="px-2.5 py-1 text-xs font-bold text-[#68736C] hover:bg-[#E8EFE8]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[#E6E0D2] bg-[#F8F5EC] space-y-4">
            <div className="flex items-center justify-between text-base font-bold text-[#202824]">
              <span>Subtotal</span>
              <span className="text-[#174C3C] font-serif-heading text-xl">{formattedTotal}</span>
            </div>
            <p className="text-[11px] text-[#68736C]">
              Shipping and taxes calculated at checkout. Free shipping on orders over ₹999.
            </p>
            <button
              type="button"
              onClick={onCheckout}
              className="w-full py-3.5 rounded-full bg-[#174C3C] hover:bg-[#0f3429] text-white font-bold text-sm transition shadow-md active:scale-98"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
