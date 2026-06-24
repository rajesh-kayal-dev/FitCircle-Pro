import React, { useState, useEffect } from "react";
import { ShoppingCart, Star, Plus, Search, TrendingUp, Package, ShieldCheck, Loader2, Sparkles, X, Brain } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../app/components/ui";
import { toast } from "sonner";
import { productCategories } from "../data/products";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { searchProducts } from "../api/endpoints";
import { CartDrawer } from "./store/CartDrawer";
import { CheckoutModal } from "./store/CheckoutModal";
import { PaymentModal } from "./store/PaymentModal";
import { OrderSuccessModal } from "./store/OrderSuccessModal";
import { askGemini } from "../api/endpoints";
import ReactMarkdown from "react-markdown";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiResults, setApiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // AI Recommender state
  const [showRecommender, setShowRecommender] = useState(false);
  const [recFormData, setRecFormData] = useState({ goal: "Muscle Gain", weight: "", experience: "Beginner" });
  const [recLoading, setRecLoading] = useState(false);
  const [recResult, setRecResult] = useState(null);

  const handleRecommend = async (e) => {
    e.preventDefault();
    setRecLoading(true);
    try {
      const prompt = `Recommend 3 supplements for a person weighing ${recFormData.weight}kg with a goal of ${recFormData.goal} and ${recFormData.experience} experience. Explain why and best usage. Format in markdown.`;
      const { data } = await askGemini(prompt); // Using the generic askGemini which uses Groq under the hood based on previous backend implementation
      setRecResult(data.answer);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate recommendations");
    } finally {
      setRecLoading(false);
    }
  };

  // Always fetch based on search query or active category
  useEffect(() => {
    const query = searchQuery.trim() || (activeCategory === "all" ? "supplements" : activeCategory);

    const timer = setTimeout(async () => {
      setLoading(true);
      setSearchError(null);
      try {
        const { data } = await searchProducts(query);
        setApiResults(data.foods || []);
      } catch (err) {
        setSearchError(err.response?.data?.message || err.message);
        setApiResults(null);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory]);

  // Store flow modal state
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [address, setAddress] = useState(null);
  const [orderId, setOrderId] = useState("");

  const { addItem, totalItems } = useCart();

  const filteredProducts = apiResults || [];

  const handleAddToCart = (product, e) => {
    if (e) e.preventDefault();
    addItem(product);
    toast.success(`${product.name || product.food_name} added to cart!`);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleAddressDone = (addr) => {
    setAddress(addr);
    setCheckoutOpen(false);
    setPaymentOpen(true);
  };

  const handleOrderSuccess = (id) => {
    setPaymentOpen(false);
    setOrderId(id);
    setSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    setOrderId("");
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 px-4 md:px-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-brand-text tracking-tight">Store</h1>
            <p className="text-brand-muted text-sm mt-1 font-medium">Premium supplements &amp; performance gear</p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative px-5 py-3 bg-white border border-gray-200 rounded-2xl flex items-center gap-2 hover:border-brand-orange hover:shadow-md transition-all group shadow-sm w-fit"
          >
            <ShoppingCart size={22} className="text-brand-text group-hover:text-brand-orange transition-colors" />
            <span className="text-sm font-bold text-brand-text">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-black shadow-md border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-32 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-brand-text placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all shadow-sm"
          />
          <button 
            onClick={() => setShowRecommender(true)}
            className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white rounded-xl px-4 font-bold text-xs flex items-center gap-2 hover:bg-brand-orange transition-colors"
          >
            <Sparkles className="w-4 h-4 text-brand-orange group-hover:text-white" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300",
                activeCategory === cat.id
                  ? "bg-brand-text text-white shadow-md shadow-black/10 scale-105"
                  : "bg-white text-gray-500 hover:text-brand-text border border-transparent shadow-sm hover:shadow-md"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <Loader2 size={32} className="animate-spin text-brand-orange" />
          </div>
        )}

        {/* Search Error */}
        {searchError && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-red-200 shadow-sm">
            <div className="text-brand-text font-black text-xl tracking-tight mb-2">Search Unavailable</div>
            <p className="text-brand-muted font-medium">{searchError}</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !searchError && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-brand-orange/30 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* API search result card */}
                <>
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-square relative overflow-hidden bg-gray-50 p-4 shrink-0 flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                            <Package size={28} className="text-brand-orange" />
                          </div>
                        </div>
                      )}
                      {product.brand && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">{product.brand}</span>
                        </div>
                      )}
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-text shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-orange hover:text-white border border-gray-100"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between border-t border-gray-50">
                      <h3 className="font-black text-sm text-brand-text mb-2 leading-tight line-clamp-2">{product.name}</h3>
                      <div className="space-y-1 mb-3">
                        {product.nutrition?.calories ? (
                          <p className="text-xs font-bold text-brand-muted">{product.nutrition.calories} cal</p>
                        ) : null}
                        <div className="flex gap-2 text-[10px] font-bold text-brand-muted">
                          {product.nutrition?.protein ? <span>P: {product.nutrition.protein}g</span> : null}
                          {product.nutrition?.carbs ? <span>C: {product.nutrition.carbs}g</span> : null}
                          {product.nutrition?.fat ? <span>F: {product.nutrition.fat}g</span> : null}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                        <span className="font-black text-brand-text">$29.99</span>
                        <div className="flex items-center gap-1 text-xs font-bold text-green-500">
                          <Star size={12} fill="currentColor" />
                          <span>4.5</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !searchError && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div className="text-brand-text font-black text-xl tracking-tight mb-2">No Products Found</div>
            <p className="text-brand-muted font-medium">Try searching for something else</p>
          </div>
        )}

        {/* Trust Badges */}
        <section className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-brand-orange/10 transition-all">
                <ShieldCheck size={28} className="text-brand-text group-hover:text-brand-orange transition-colors" />
              </div>
              <h4 className="font-black text-brand-text mb-1 tracking-tight">Authentic Products</h4>
              <p className="text-xs font-medium text-brand-muted">100% genuine from authorized brands</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-brand-green/10 transition-all">
                <Package size={28} className="text-brand-text group-hover:text-brand-green transition-colors" />
              </div>
              <h4 className="font-black text-brand-text mb-1 tracking-tight">Free Delivery</h4>
              <p className="text-xs font-medium text-brand-muted">Express shipping across India</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-blue-50 transition-all">
                <TrendingUp size={28} className="text-brand-text group-hover:text-blue-500 transition-colors" />
              </div>
              <h4 className="font-black text-brand-text mb-1 tracking-tight">Best Prices</h4>
              <p className="text-xs font-medium text-brand-muted">Competitive rates guaranteed</p>
            </div>
          </div>
        </section>
      </div>

      {/* Store Flow Modals */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onContinue={handleAddressDone} />
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} address={address} onSuccess={handleOrderSuccess} />
      <OrderSuccessModal open={successOpen} orderId={orderId} onClose={handleSuccessClose} />
    </>
  );
}
