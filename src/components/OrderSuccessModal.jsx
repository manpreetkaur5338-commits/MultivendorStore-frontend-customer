import React from "react";
import { CheckCircle, ShoppingBag, Eye, ArrowRight, Calendar, CreditCard, MapPin, Truck } from "lucide-react";
import OrderTrackingTimeline from "./OrderTrackingTimeline";

export default function OrderSuccessModal({
  isOpen,
  onClose,
  order,
  onViewOrders,
}) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#E6E0D2] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Brand Stripe */}
        <div className="h-2 bg-linear-to-r from-[#174C3C] via-[#D5B779] to-[#174C3C]" />

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Success Banner */}
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E8EFE8] text-[#26734D] flex items-center justify-center mx-auto mb-3.5 border-2 border-[#26734D]/30 shadow-sm animate-bounce-subtle">
              <CheckCircle className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#A66B12]">
              Order Confirmed & Escrow Secured
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#174C3C] mt-1">
              Order Placed Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-[#68736C] max-w-md mx-auto mt-1">
              Thank you for shopping at MarketNest. Your order has been placed and is now in progress.
            </p>
          </div>

          {/* Key Order Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F8F5EC] border border-[#E6E0D2] text-xs">
            <div>
              <p className="text-[#68736C] text-[10px] uppercase font-semibold">Order ID</p>
              <p className="font-mono font-bold text-[#174C3C] mt-0.5">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-[#68736C] text-[10px] uppercase font-semibold">Order Date</p>
              <p className="font-semibold text-[#202824] mt-0.5">
                {new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-[#68736C] text-[10px] uppercase font-semibold">Total Paid / COD</p>
              <p className="font-bold text-[#174C3C] mt-0.5">
                ₹{order.total?.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-[#68736C] text-[10px] uppercase font-semibold">Payment Status</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white border border-[#E6E0D2] text-[#26734D]">
                {order.paymentMethod} • {order.paymentStatus || "Verified"}
              </span>
            </div>
          </div>

          {/* DYNAMIC TIMELINE INTEGRATION */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#202824] mb-2.5 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#174C3C]" />
              <span>Real-Time Progress Timeline</span>
            </h4>
            <OrderTrackingTimeline order={order} />
          </div>

          {/* Order Items Snapshot */}
          <div className="p-4 rounded-2xl border border-[#E6E0D2] bg-white">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#202824] mb-3">
              Items in this Package ({order.items?.length || 0})
            </h5>
            <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover border border-[#E6E0D2] bg-[#F8F5EC]"
                    />
                    <div>
                      <p className="font-semibold text-[#202824] line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-[#68736C]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#174C3C]">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Destination Details */}
          <div className="p-3.5 rounded-xl bg-[#F8F5EC] border border-[#E6E0D2] flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-[#174C3C] mt-0.5 shrink-0" />
            <div className="text-[#68736C] leading-snug">
              <strong className="text-[#202824]">{order.shippingAddress?.name}</strong> •{" "}
              {order.shippingAddress?.line1}, {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.state} - {order.shippingAddress?.pincode} • Phone:{" "}
              {order.shippingAddress?.phone}
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E6E0D2] bg-[#F8F5EC] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[#E6E0D2] bg-white text-xs font-semibold text-[#202824] hover:bg-[#E8EFE8] transition"
          >
            Continue Shopping
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onViewOrders) onViewOrders(order._id);
              }}
              className="px-5 py-2.5 rounded-full bg-[#174C3C] text-white hover:bg-[#0f3429] text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#D5B779]" />
              <span>Track My Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

