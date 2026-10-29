import { useState } from "react";

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  user = null,
  onOrderSuccess,
}) {
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    line1: user?.address || "",
    line2: "",
    city: user?.city || "",
    state: user?.state || "Karnataka",
    pincode: user?.zip || "",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const discount = subtotal >= 2500 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shippingFee - discount;

  const handleInputChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!shippingAddress.name || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.pincode) {
      setErrorMsg("Please fill in all mandatory delivery address fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Please sign in or register to place your order.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        items: cartItems.map((item) => ({
          product: item._id || item.id,
          title: item.name || item.title,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
        })),
        shippingAddress: {
          ...shippingAddress,
          state: shippingAddress.state || "Punjab",
        },
        paymentMethod,
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (
          res.status === 401 ||
          res.status === 403 ||
          data.error === "invalid token" ||
          data.error === "No token provided"
        ) {
          throw new Error("Your session has expired or is invalid. Please sign out and sign in again.");
        }
        throw new Error(data.message || data.error || "Failed to place order.");
      }

      onOrderSuccess(data.data);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#E6E0D2] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E0D2]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#174C3C]">
              Secure Checkout
            </span>
            <h3 className="font-serif-heading text-2xl font-bold text-[#202824]">
              Complete Your Order
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#68736C] hover:text-[#202824] hover:bg-[#E6E0D2] transition"
            aria-label="Close checkout"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-[#C0392B]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="mt-6 space-y-6">
          {/* 1. Delivery Address */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#174C3C] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#174C3C] text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Delivery Address</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={shippingAddress.name}
                  onChange={handleInputChange}
                  placeholder="Radhika Sharma"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E6E0D2] focus:border-[#174C3C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E6E0D2] focus:border-[#174C3C] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#202824] mb-1">
                  Street Address / House / Flat *
                </label>
                <input
                  type="text"
                  name="line1"
                  required
                  value={shippingAddress.line1}
                  onChange={handleInputChange}
                  placeholder="Flat 402, Heritage Apartments, 12th Main Road"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E6E0D2] focus:border-[#174C3C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  placeholder="Bengaluru"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E6E0D2] focus:border-[#174C3C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={shippingAddress.pincode}
                  onChange={handleInputChange}
                  placeholder="560038"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E6E0D2] focus:border-[#174C3C] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 2. Order Summary Items */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#174C3C] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#174C3C] text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>Cart Items ({cartItems.length})</span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-[#E6E0D2] bg-[#F8F5EC]/50 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-white"
                    />
                    <div>
                      <p className="font-semibold text-[#202824] line-clamp-1">{item.name}</p>
                      <p className="text-[#68736C]">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#174C3C]">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Payment Method */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#174C3C] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#174C3C] text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>Payment Method</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  paymentMethod === "COD"
                    ? "border-[#174C3C] bg-[#E8EFE8] font-bold text-[#174C3C]"
                    : "border-[#E6E0D2] bg-white text-[#202824]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="accent-[#174C3C]"
                />
                <div>
                  <p className="text-xs sm:text-sm">Cash on Delivery</p>
                  <p className="text-[10px] text-[#68736C]">Pay at doorstep</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  paymentMethod === "UPI"
                    ? "border-[#174C3C] bg-[#E8EFE8] font-bold text-[#174C3C]"
                    : "border-[#E6E0D2] bg-white text-[#202824]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                  className="accent-[#174C3C]"
                />
                <div>
                  <p className="text-xs sm:text-sm">Online / UPI</p>
                  <p className="text-[10px] text-[#68736C]">Instant verified</p>
                </div>
              </label>
            </div>
          </div>

          {/* 4. Total calculation */}
          <div className="p-4 rounded-2xl bg-[#F8F5EC] border border-[#E6E0D2] space-y-2 text-xs">
            <div className="flex justify-between text-[#68736C]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#202824]">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[#68736C]">
              <span>Delivery Charges</span>
              <span className="font-semibold text-[#26734D]">
                {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#26734D]">
                <span>MarketNest Reward Discount</span>
                <span className="font-semibold">-₹{discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#E6E0D2] flex justify-between text-sm sm:text-base font-bold text-[#202824]">
              <span>Grand Total</span>
              <span className="text-[#174C3C] font-serif-heading text-lg">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="w-full py-3.5 rounded-full bg-[#174C3C] hover:bg-[#0f3429] text-white font-bold text-sm sm:text-base transition shadow-md active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Confirming Order...</span>
              </>
            ) : (
              <span>Place Order (₹{total.toLocaleString("en-IN")})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
