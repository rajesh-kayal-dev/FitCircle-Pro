import React, { useState } from "react";
import { ShoppingCart, Star, Plus, Minus, X, Search, TrendingUp, Package, ShieldCheck, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../app/components/ui";
import { toast } from "sonner";

import { products, productCategories } from "../data/products";
import { Link } from "react-router";

export default function Buy() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-text tracking-tight">Store</h1>
          <p className="text-brand-muted text-sm mt-1 font-medium">Premium supplements & performance gear</p>
        </div>
        <div className="flex items-center gap-4 relative z-50">
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative px-5 py-3 bg-white border border-gray-200 rounded-2xl flex items-center gap-2 hover:border-brand-orange hover:shadow-md transition-all group shadow-sm"
          >
            <ShoppingCart size={22} className="text-brand-text group-hover:text-brand-orange transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-red text-white rounded-full flex items-center justify-center text-xs font-black shadow-md border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
          {cartCount > 0 && (
            <button className="px-6 py-3 bg-brand-text text-white rounded-2xl font-black hover:bg-gray-800 transition-colors shadow-md flex items-center">
              Checkout
              <ChevronRight size={18} className="ml-1 opacity-70" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCart && cart.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute right-4 md:right-auto md:w-[400px] z-50 bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-gray-100 mt-2"
              style={{ originX: 1, originY: 0 }}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-black text-brand-text tracking-tight flex items-center">
                  <ShoppingCart className="mr-2 text-brand-orange" size={20} />
                  Your Cart
                </h3>
                <button onClick={() => setShowCart(false)} className="p-2 bg-gray-50 text-gray-400 hover:text-brand-text rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto hide-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white p-2 rounded-2xl group">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="font-bold text-sm text-brand-text truncate leading-tight group-hover:text-brand-orange transition-colors">{item.name}</h4>
                      <p className="text-sm font-black text-brand-text mt-1">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-brand-text hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-xs font-black text-brand-text bg-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-brand-text hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-300 hover:text-brand-red hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-6 mt-4 flex items-end justify-between">
                <div>
                  <span className="text-sm font-bold text-brand-muted uppercase tracking-wider block mb-1">Total</span>
                  <span className="text-3xl font-black text-brand-text tracking-tighter">₹{cartTotal.toLocaleString()}</span>
                </div>
                <button className="bg-brand-orange hover:bg-brand-text text-white px-6 py-3 rounded-xl font-black transition-colors shadow-md">
                  Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative">
        <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] text-sm font-bold text-brand-text placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all shadow-sm"
        />
      </div>

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-brand-orange/30 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
          >
            <Link to={`/product/${product.slug}`} className="aspect-square relative overflow-hidden bg-gray-50 p-4 shrink-0 block">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-wider text-brand-text shadow-sm border border-gray-100">
                  {product.tag}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-text shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-orange hover:text-white"
              >
                <Plus size={24} />
              </button>
            </Link>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <Link to={`/product/${product.slug}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-2">{product.category}</div>
                <h3 className="font-black text-brand-text mb-2 leading-tight group-hover:text-brand-orange transition-colors">{product.name}</h3>
              </Link>
              <div className="flex items-center gap-1.5 mb-4 bg-gray-50 inline-flex px-2 py-1 rounded-lg border border-gray-100">
                <Star size={14} className="fill-brand-orange text-brand-orange" />
                <span className="text-xs font-black text-brand-text">{product.rating}</span>
                <span className="text-xs font-bold text-brand-muted">({product.reviews})</span>
              </div>

              <div className="flex items-end justify-between mt-2">
                <div className="text-2xl font-black tracking-tighter text-brand-text">₹{product.price.toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
          <div className="text-brand-text font-black text-xl tracking-tight mb-2">No Products Found</div>
          <p className="text-brand-muted font-medium">Try searching for something else</p>
        </div>
      )}

      <section className="mt-12 bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/20 transition-all">
              <ShieldCheck size={32} className="text-brand-text group-hover:text-brand-orange transition-colors" />
            </div>
            <h4 className="font-black text-lg text-brand-text mb-2 tracking-tight">Authentic Products</h4>
            <p className="text-sm font-medium text-brand-muted">100% genuine from authorized brands</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-brand-green/10 group-hover:border-brand-green/20 transition-all">
              <Package size={32} className="text-brand-text group-hover:text-brand-green transition-colors" />
            </div>
            <h4 className="font-black text-lg text-brand-text mb-2 tracking-tight">Free Delivery</h4>
            <p className="text-sm font-medium text-brand-muted">Express shipping across India</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all">
              <TrendingUp size={32} className="text-brand-text group-hover:text-blue-500 transition-colors" />
            </div>
            <h4 className="font-black text-lg text-brand-text mb-2 tracking-tight">Best Prices</h4>
            <p className="text-sm font-medium text-brand-muted">Competitive rates guaranteed</p>
          </div>
        </div>
      </section>
    </div>
  );
}
