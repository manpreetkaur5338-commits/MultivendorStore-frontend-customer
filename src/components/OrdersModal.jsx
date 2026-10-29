import { useState } from "react";
import {
  X,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  Truck,
  RotateCcw,
} from "lucide-react";
import OrderTrackingTimeline from "./OrderTrackingTimeline";

export default function OrdersModal({
  isOpen,
  onClose,
  orders = [],
  onCancelOrder,
  refreshOrders,
  selectedOrderId = null,
}) {
  const [cancellingId, setCancellingId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(selectedOrderId);
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleManualRefresh = async () => {
    if (!refreshOrders) return;
    setRefreshing(true);
    try {
      await refreshOrders();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleCancelClick = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order? Inventory will be restored immediately."))
      return;
    setCancellingId(orderId);
    try {
      await onCancelOrder(orderId, "Customer requested cancellation");
      if (refreshOrders) refreshOrders();
    } catch (e) {
      alert(e.message || "Could not cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-[#E6E0D2] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E0D2]">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#174C3C]">
                Customer Account
              </span>
              <h3 className="font-serif-heading text-2xl font-bold text-[#202824]">
                My Orders & Tracking ({orders.length})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={refreshing}
              title="Refresh order statuses from server"
              className="p-2 rounded-full border border-[#E6E0D2] text-[#174C3C] hover:bg-[#E8EFE8] transition"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-[#68736C] hover:text-[#202824] hover:bg-[#E6E0D2] transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 flex-1 overflow-y-auto space-y-5 pr-1">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#E8EFE8] flex items-center justify-center text-[#174C3C] mx-auto mb-3.5 border border-[#174C3C]/10 shadow-xs">
                <Package className="w-8 h-8" />
              </div>
              <p className="font-serif-heading text-xl font-bold text-[#202824]">
                No orders placed yet
              </p>
              <p className="text-xs sm:text-sm text-[#68736C] mt-1 max-w-sm mx-auto">
                Discover handcrafted artisan finds and track real-time fulfillment right here.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const orderId = order._id || order.orderNumber;
              const isExpanded = expandedOrderId === orderId || orders.length === 1;
              const isCancellable =
                order.status === "placed" || order.status === "confirmed";
              const isCancelled = order.status === "cancelled";

              return (
                <div
                  key={orderId}
                  className="rounded-2xl border border-[#E6E0D2] bg-white shadow-xs overflow-hidden transition-all duration-200"
                >
                  {/* Order Summary Row */}
                  <div
                    onClick={() => toggleExpand(orderId)}
                    className="p-4 sm:p-5 bg-[#F8F5EC]/50 hover:bg-[#F8F5EC] cursor-pointer transition flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#174C3C]">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-[#68736C]">•</span>
                        <span className="text-[11px] text-[#68736C]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-[#68736C] mt-1">
                        {order.items?.length || 0} item(s) • Total:{" "}
                        <strong className="text-[#202824]">
                          ₹{order.total?.toLocaleString("en-IN")}
                        </strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                          isCancelled
                            ? "bg-red-100 text-[#C0392B]"
                            : order.status === "delivered"
                            ? "bg-emerald-100 text-[#26734D]"
                            : "bg-[#174C3C] text-[#D5B779]"
                        }`}
                      >
                        {order.status || "Placed"}
                      </span>

                      <div className="text-[#68736C] p-1">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[#174C3C]" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Tracker & Details */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 border-t border-[#E6E0D2] space-y-5 bg-white animate-in fade-in duration-200">
                      {/* DYNAMIC TIMELINE */}
                      <div>
                        <OrderTrackingTimeline order={order} />
                      </div>

                      {/* Items Snapshot */}
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-[#202824] mb-2.5">
                          Ordered Items
                        </h5>
                        <div className="space-y-2 border border-[#E6E0D2] rounded-xl p-3 bg-[#F8F5EC]/30">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs py-1.5 border-b border-[#F0ECE1] last:border-0"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    item.image ||
                                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
                                  }
                                  alt={item.title}
                                  className="w-10 h-10 rounded-lg object-cover bg-white border border-[#E6E0D2]"
                                />
                                <div>
                                  <p className="font-semibold text-[#202824] line-clamp-1">
                                    {item.title}
                                  </p>
                                  <p className="text-[10px] text-[#68736C]">
                                    Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>
                              <span className="font-bold text-[#174C3C]">
                                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address & Actions */}
                      <div className="flex flex-wrap items-center justify-between text-xs pt-2 gap-3">
                        <div className="text-[11px] text-[#68736C] max-w-sm">
                          <strong className="text-[#202824]">Delivery Address:</strong>{" "}
                          {order.shippingAddress?.name}, {order.shippingAddress?.line1},{" "}
                          {order.shippingAddress?.city} ({order.shippingAddress?.pincode})
                        </div>

                        {isCancellable && !isCancelled && (
                          <button
                            type="button"
                            disabled={cancellingId === order._id}
                            onClick={() => handleCancelClick(order._id)}
                            className="px-3.5 py-1.5 rounded-lg border border-[#C0392B] text-[#C0392B] hover:bg-red-50 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
                          >
                            {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
