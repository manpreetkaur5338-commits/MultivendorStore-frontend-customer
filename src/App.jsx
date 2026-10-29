import { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import ProductCard from "./components/ProductCard";
import BenefitsSection from "./components/BenefitsSection";
import SellerCTA from "./components/SellerCTA";
import Footer from "./components/Footer";
import CartModal from "./components/CartModal";
import CheckoutModal from "./components/CheckoutModal";
import OrdersModal from "./components/OrdersModal";
import ProductDetailModal from "./components/ProductDetailModal";
import AuthModal from "./components/AuthModal";
import OrderSuccessModal from "./components/OrderSuccessModal";

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
 const [sortOption, setSortOption] = useState("default");

  // User session
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Cart & Wishlist
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [createdOrderSuccess, setCreatedOrderSuccess] = useState(null);
  const [focusedOrderId, setFocusedOrderId] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Restore stored session, cart and wishlist
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }

      const savedCart = localStorage.getItem("marketnest_cart");
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("marketnest_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn("Storage restore error:", e);
    }
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem("marketnest_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.warn(e);
    }
  }, [cartItems]);

  // Save wishlist
  useEffect(() => {
    try {
      localStorage.setItem("marketnest_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn(e);
    }
  }, [wishlist]);

  // Fetch live products from Express/MongoDB
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const url = new URL("http://localhost:5000/api/products");
      if (selectedCategory && selectedCategory !== "all") {
        url.searchParams.set("category", selectedCategory);
      }
      if (searchQuery.trim()) {
        url.searchParams.set("search", searchQuery.trim());
      }
      if (sortOption && sortOption !== "default") {
        url.searchParams.set("sort", sortOption);
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setProducts(json.data);
        }
      }
    } catch (err) {
      console.error("Could not fetch live products:", err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedCategory, searchQuery, sortOption]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch live categories from Express/MongoDB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch("http://localhost:5000/api/categories");
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setCategories(json.data);
          }
        }
      } catch (err) {
        console.error("Could not fetch categories:", err.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch user orders when authenticated
  const fetchUserOrders = useCallback(async () => {
    const activeToken = token || localStorage.getItem("token");
    if (!activeToken) return;

    try {
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setOrders(json.data);
        }
      }
    } catch (err) {
      console.warn("Could not fetch orders:", err.message);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchUserOrders();
    }
  }, [user, token, fetchUserOrders]);

  // Cart operations
  const handleAddToCart = (product) => {
    const qtyToAdd = product.quantity || 1;
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + qtyToAdd }
            : item
        );
      }
      return [...prev, { ...product, quantity: qtyToAdd }];
    });
    showToast(`Added "${product.name || product.title}" to cart`);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  // Wishlist toggle
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        showToast("Removed from wishlist");
        return prev.filter((p) => p._id !== product._id);
      } else {
        showToast(`Saved "${product.name || product.title}" to wishlist`);
        return [...prev, product];
      }
    });
  };

  // Order cancellation
  const handleCancelOrder = async (orderId, reason) => {
    const activeToken = token || localStorage.getItem("token");
    if (!activeToken) throw new Error("Please log in first");

    const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeToken}`,
      },
      body: JSON.stringify({ reason }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Failed to cancel order");
    }

    showToast("Order cancelled and stock restored");
    fetchUserOrders();
    fetchProducts();
  };

  // Handle successful order placement
  const handleOrderSuccess = (createdOrder) => {
    setCartItems([]);
    showToast(`Order #${createdOrder.orderNumber} placed successfully!`);
    fetchUserOrders();
    fetchProducts();
    setCreatedOrderSuccess(createdOrder);
  };

  // Authentication login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setToken(localStorage.getItem("token"));
    showToast(`Welcome back, ${userData.name}!`);
    fetchUserOrders();
  };

  // Authentication logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setOrders([]);
    showToast("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-[#F8F5EC] text-[#202824] flex flex-col font-sans-body selection:bg-[#D5B779] selection:text-[#174C3C]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#174C3C] text-white px-5 py-3 text-xs sm:text-sm font-semibold shadow-2xl border border-[#D5B779] animate-in fade-in slide-in-from-bottom duration-300">
          <span className="text-[#D5B779]">✦</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        cartCount={cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)}
        wishlistCount={wishlist.length}
        orderCount={orders.length}
        user={user}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          setSelectedCategory("all");
          const el = document.getElementById("products");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onSearch={(query) => setSearchQuery(query)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Section */}
      <Hero onSearch={(query) => setSearchQuery(query)} />

      {/* Categories Section */}
      <CategorySection
        selectedCategory={selectedCategory}
        onSelectCategory={(catSlug) => {
          setSelectedCategory(catSlug);
          const el = document.getElementById("products");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        categories={categories}
      />

      {/* Featured Products Section */}
      <section id="products" className="py-16 sm:py-20 bg-white border-b border-[#E6E0D2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#174C3C] mb-2 block">
                Handpicked Finds
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#202824]">
                Featured Marketplace Products
              </h2>
              {searchQuery && (
                <p className="text-xs text-[#68736C] mt-1.5">
                  Showing results for &ldquo;{searchQuery}&rdquo;{" "}
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-[#C0392B] underline font-semibold ml-1 cursor-pointer"
                  >
                    Clear search
                  </button>
                </p>
              )}
            </div>

            {/* Sorting & Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E6E0D2] bg-[#F8F5EC] text-[#202824] focus:border-[#174C3C] focus:outline-hidden"
              >
                <option value="default">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setSortOption("default");
                }}
                className="text-xs sm:text-sm font-semibold text-[#174C3C] hover:text-[#0f3429] transition"
              >
                View All ({products.length}) →
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {loadingProducts ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#174C3C] border-r-transparent" />
              <p className="mt-3 text-xs sm:text-sm text-[#68736C]">
                Loading live products from MongoDB...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <p className="font-serif-heading text-xl font-bold text-[#202824]">
                No matching products found
              </p>
              <p className="text-xs text-[#68736C] mt-2">
                Try searching with different keywords or reset category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#0f3429]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 lg:gap-7">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isWishlisted={wishlist.some((w) => w._id === product._id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={(p) => setSelectedProductDetail(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Seller CTA Banner */}
      <SellerCTA onOpenSellerModal={() => setIsAuthOpen(true)} />

      {/* Footer */}
      <Footer
        onCategoryClick={(catSlug) => {
          setSelectedCategory(catSlug);
          const el = document.getElementById("products");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Slide-out Cart Drawer */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        user={user}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Customer Orders Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => {
          setIsOrdersOpen(false);
          setFocusedOrderId(null);
        }}
        orders={orders}
        onCancelOrder={handleCancelOrder}
        refreshOrders={fetchUserOrders}
        selectedOrderId={focusedOrderId}
      />

      {/* Checkout Order Success & Timeline Modal */}
      <OrderSuccessModal
        isOpen={!!createdOrderSuccess}
        onClose={() => setCreatedOrderSuccess(null)}
        order={createdOrderSuccess}
        onViewOrders={(orderId) => {
          setCreatedOrderSuccess(null);
          setFocusedOrderId(orderId);
          setIsOrdersOpen(true);
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={!!selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        product={selectedProductDetail}
        isWishlisted={wishlist.some((w) => w._id === selectedProductDetail?._id)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Authentication / Vendor Onboarding Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}