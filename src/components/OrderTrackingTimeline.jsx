import React from "react";
import {
  ShoppingBag,
  CheckCircle,
  Package,
  Truck,
  Navigation,
  CheckCheck,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

/**
 * Stages definition according to requirements:
 * 1. Order Placed
 * 2. Order Confirmed
 * 3. Processing / Packed
 * 4. Shipped
 * 5. Out for Delivery
 * 6. Delivered
 */
const TRACKING_STAGES = [
  {
    key: "placed",
    label: "Order Placed",
    sublabel: "We have received your order",
    icon: ShoppingBag,
    aliases: ["placed", "order placed"],
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    sublabel: "Order verified & accepted",
    icon: CheckCircle,
    aliases: ["confirmed", "order confirmed"],
  },
  {
    key: "processing",
    label: "Processing / Packed",
    sublabel: "Carefully inspected & boxed",
    icon: Package,
    aliases: ["processing", "packed", "in packing", "packaged"],
  },
  {
    key: "shipped",
    label: "Shipped",
    sublabel: "Handed over to carrier",
    icon: Truck,
    aliases: ["shipped", "in transit", "dispatched"],
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    sublabel: "Courier on the way to you",
    icon: Navigation,
    aliases: ["out_for_delivery", "out for delivery", "with courier"],
  },
  {
    key: "delivered",
    label: "Delivered",
    sublabel: "Delivered to your address",
    icon: CheckCheck,
    aliases: ["delivered", "completed"],
  },
];

/**
 * Computes active step index (0 to 5) based on real order status.
 * Returns -1 if cancelled.
 */
export const getActiveStageIndex = (status) => {
  if (!status) return 0;
  const s = String(status).toLowerCase().trim();

  if (s === "cancelled") return -1;
  if (s === "delivered" || s === "completed") return 5;
  if (s === "out_for_delivery" || s === "out for delivery" || s === "with courier") return 4;
  if (s === "shipped" || s === "in transit" || s === "dispatched") return 3;
  if (s === "processing" || s === "packed" || s === "in packing") return 2;
  if (s === "confirmed" || s === "order confirmed") return 1;
  return 0; // "placed"
};

/**
 * Finds timestamp for a specific stage from order.statusHistory or timestamps
 */
export const getStageTimestamp = (order, stageKey) => {
  if (!order) return null;

  // Check statusHistory array first
  if (Array.isArray(order.statusHistory)) {
    const entry = order.statusHistory.find((h) => {
      const hStatus = String(h.status || "").toLowerCase().trim();
      const stage = TRACKING_STAGES.find((st) => st.key === stageKey);
      return stage?.aliases.includes(hStatus) || hStatus === stageKey;
    });

    if (entry && entry.timestamp) {
      return entry.timestamp;
    }
  }

  // Fallback to order created/updated dates for initial stage
  if (stageKey === "placed" && order.createdAt) {
    return order.createdAt;
  }

  // Fallback if current active status matches
  const activeIdx = getActiveStageIndex(order.status);
  const thisIdx = TRACKING_STAGES.findIndex((s) => s.key === stageKey);
  if (activeIdx === thisIdx && order.updatedAt) {
    return order.updatedAt;
  }

  return null;
};

export default function OrderTrackingTimeline({ order, compact = false }) {
  if (!order) return null;

  const isCancelled = order.status === "cancelled";
  const activeIndex = getActiveStageIndex(order.status);

  // Cancellation State UI
  if (isCancelled) {
    const cancelHistory = Array.isArray(order.statusHistory)
      ? order.statusHistory.find((h) => h.status === "cancelled")
      : null;
    const cancelDate = cancelHistory?.timestamp || order.updatedAt || order.createdAt;

    return (
      <div className="bg-red-50/70 border border-red-200 rounded-2xl p-5 sm:p-6 text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-100 text-[#C0392B] flex items-center justify-center mx-auto mb-3 shadow-xs">
          <XCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h4 className="font-serif-heading text-lg sm:text-xl font-bold text-[#C0392B]">
          Order Cancelled
        </h4>
        <p className="text-xs sm:text-sm text-[#68736C] mt-1 max-w-md mx-auto">
          {order.cancellationReason || "This order was cancelled and inventory has been restored."}
        </p>
        {cancelDate && (
          <p className="text-[11px] text-[#68736C] mt-2 font-medium">
            Cancelled on{" "}
            {new Date(cancelDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    );
  }

  const formatTimestamp = (ts) => {
    if (!ts) return null;
    try {
      const d = new Date(ts);
      return {
        date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
    } catch {
      return null;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-[#E6E0D2] shadow-sm p-5 sm:p-7 transition-all">
      {/* Top Banner Status Bar */}
      <div className="flex flex-wrap items-center justify-between pb-5 mb-6 border-b border-[#F0ECE1] gap-2">
        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#174C3C]">
            Live Shipment Tracker
          </span>
          <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#202824]">
            Order #{order.orderNumber}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              activeIndex === 5
                ? "bg-[#26734D]/10 text-[#26734D] border border-[#26734D]/30"
                : "bg-[#174C3C] text-[#D5B779] shadow-xs"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeIndex === 5 ? "bg-[#26734D]" : "bg-[#D5B779] animate-pulse"
              }`}
            />
            <span>
              {activeIndex === 5
                ? "Delivered"
                : activeIndex >= 3
                ? "In Transit"
                : "Confirmed & In Progress"}
            </span>
          </span>

          {order.estimatedDeliveryDate && (
            <span className="hidden sm:inline-block text-[11px] text-[#68736C] font-medium bg-[#F8F5EC] px-2.5 py-1 rounded-lg border border-[#E6E0D2]">
              Est. Arrival:{" "}
              <strong className="text-[#202824]">
                {new Date(order.estimatedDeliveryDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </strong>
            </span>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* DESKTOP & TABLET HORIZONTAL TRACKER (6 Steps)                  */}
      {/* ============================================================== */}
      <div className="hidden md:block py-3">
        <div className="relative flex items-start justify-between">
          {/* Connecting Dotted Line across all icons */}
          <div
            className="absolute top-6 left-8 right-8 h-0.5 border-t-2 border-dotted -z-0 pointer-events-none"
            style={{ borderColor: "#D5B779" }}
          />

          {TRACKING_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isUpcoming = idx > activeIndex;
            const rawTs = getStageTimestamp(order, stage.key);
            const ts = formatTimestamp(rawTs);

            return (
              <div
                key={stage.key}
                className="relative z-10 flex flex-col items-center text-center flex-1 px-1 group"
              >
                {/* Step Circle with Icon */}
                <div
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#174C3C] text-white shadow-md border-2 border-[#174C3C]"
                      : isCurrent
                      ? "bg-[#174C3C] text-[#D5B779] shadow-lg ring-4 ring-[#D5B779]/40 border-2 border-[#D5B779] scale-105"
                      : "bg-[#F8F5EC] text-[#68736C]/60 border-2 border-[#E6E0D2]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7 text-[#D5B779]" />
                  ) : (
                    <Icon
                      className={`w-5 h-5 lg:w-6 lg:h-6 ${
                        isCurrent ? "text-[#D5B779] animate-bounce-subtle" : "text-[#68736C]/60"
                      }`}
                    />
                  )}
                </div>

                {/* Stage Title */}
                <div className="mt-3.5">
                  <p
                    className={`text-xs font-bold tracking-tight leading-tight transition-colors ${
                      isCurrent
                        ? "text-[#174C3C]"
                        : isCompleted
                        ? "text-[#202824]"
                        : "text-[#68736C]/70"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-[10px] text-[#68736C] mt-0.5 line-clamp-1 max-w-[110px]">
                    {stage.sublabel}
                  </p>
                </div>

                {/* Actual Saved Timestamp (if available) */}
                {ts ? (
                  <div className="mt-1.5 px-2 py-0.5 rounded-md bg-[#F8F5EC] border border-[#E6E0D2] text-[10px] font-medium text-[#174C3C]">
                    <span>{ts.date}</span>
                    <span className="text-[#68736C] ml-1">{ts.time}</span>
                  </div>
                ) : isCurrent ? (
                  <span className="mt-1.5 inline-block text-[9px] uppercase tracking-wider font-extrabold text-[#A66B12] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    In Progress
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE VERTICAL TIMELINE                                       */}
      {/* ============================================================== */}
      <div className="md:hidden space-y-0 relative pl-4 pr-1">
        {/* Vertical Dotted Line connecting circles */}
        <div
          className="absolute left-9 top-4 bottom-8 w-0.5 border-l-2 border-dotted pointer-events-none"
          style={{ borderColor: "#D5B779" }}
        />

        {TRACKING_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isUpcoming = idx > activeIndex;
          const rawTs = getStageTimestamp(order, stage.key);
          const ts = formatTimestamp(rawTs);

          return (
            <div
              key={stage.key}
              className={`relative z-10 flex items-start gap-4 pb-6 last:pb-1 ${
                isUpcoming ? "opacity-75" : "opacity-100"
              }`}
            >
              {/* Circle Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isCompleted
                    ? "bg-[#174C3C] text-white shadow-xs border-2 border-[#174C3C]"
                    : isCurrent
                    ? "bg-[#174C3C] text-[#D5B779] shadow-md ring-3 ring-[#D5B779]/40 border-2 border-[#D5B779]"
                    : "bg-[#F8F5EC] text-[#68736C]/60 border-2 border-[#E6E0D2]"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-[#D5B779]" />
                ) : (
                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent ? "text-[#D5B779]" : "text-[#68736C]/60"
                    }`}
                  />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h5
                    className={`text-xs sm:text-sm font-bold ${
                      isCurrent
                        ? "text-[#174C3C]"
                        : isCompleted
                        ? "text-[#202824]"
                        : "text-[#68736C]"
                    }`}
                  >
                    {stage.label}
                  </h5>
                  {isCurrent && (
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#A66B12] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                      Current
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#68736C] mt-0.5">{stage.sublabel}</p>

                {ts && (
                  <p className="text-[10px] text-[#174C3C] font-medium mt-1 inline-flex items-center gap-1 bg-[#F8F5EC] px-2 py-0.5 rounded border border-[#E6E0D2]">
                    <Clock className="w-3 h-3 text-[#A66B12]" />
                    <span>
                      {ts.date} at {ts.time}
                    </span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Courier & Tracking Footer info */}
      <div className="mt-5 pt-4 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between text-xs text-[#68736C] gap-2">
        <div className="flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-[#174C3C]" />
          <span>
            Fulfilled by{" "}
            <strong className="text-[#202824]">
              {order.courier?.carrierName || "MarketNest Express Logistics"}
            </strong>
          </span>
        </div>

        {order.courier?.trackingNumber ? (
          <span className="font-mono text-[11px] bg-[#F8F5EC] px-2.5 py-1 rounded border border-[#E6E0D2]">
            AWB: <strong className="text-[#174C3C]">{order.courier.trackingNumber}</strong>
          </span>
        ) : (
          <span className="text-[11px] text-[#68736C] italic">
            Tracking details will appear when your order is shipped.
          </span>
        )}
      </div>
    </div>
  );
}

