import React from "react";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../../context/CartContext";
import { cn } from "../../app/components/ui";

export function CartDrawer({ open, onClose, onCheckout }) {
  const { cart, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[71] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-brand-orange" />
                <h2 className="text-lg font-black text-brand-text tracking-tight">
                  Your Cart
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-bold text-brand-muted">({totalItems} items)</span>
                  )}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <X size={20} className="text-brand-muted" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-black text-brand-text mb-2">Cart is empty</h3>
                  <p className="text-sm text-brand-muted font-medium">Browse the store and add some products!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100 group"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-brand-text truncate mb-1">{item.name}</h4>
                        <p className="text-base font-black text-brand-text">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-brand-muted hover:bg-gray-50 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-brand-muted hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs font-bold text-brand-muted hover:text-brand-red transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-brand-muted">Subtotal</span>
                  <span className="text-2xl font-black text-brand-text tracking-tighter">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-brand-orange text-white rounded-2xl font-black hover:bg-brand-text transition-all shadow-lg shadow-brand-orange/20 active:scale-[0.98]"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
