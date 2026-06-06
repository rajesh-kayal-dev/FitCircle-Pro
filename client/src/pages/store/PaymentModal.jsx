import React, { useState } from "react";
import { X, CreditCard, Banknote, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../../context/CartContext";
import { cn } from "../../app/components/ui";

const paymentOptions = [
  {
    id: "online",
    label: "Online Payment",
    desc: "Pay securely via UPI, Cards, or Net Banking",
    icon: CreditCard,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    desc: "Pay when you receive your order",
    icon: Banknote,
  },
];

export function PaymentModal({ open, onClose, address, onSuccess }) {
  const [selected, setSelected] = useState("online");
  const { totalPrice, placeOrder, cart } = useCart();

  const handleConfirm = () => {
    const orderId = placeOrder(address, selected);
    onSuccess(orderId);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[50%] -translate-y-[50%] sm:inset-auto sm:left-[50%] sm:top-[50%] sm:-translate-x-[50%] sm:-translate-y-[50%] sm:w-[480px] bg-white rounded-[2rem] z-[81] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                  <CreditCard size={18} className="text-brand-orange" />
                </div>
                <h2 className="text-lg font-black text-brand-text tracking-tight">Payment</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <X size={20} className="text-brand-muted" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-brand-muted uppercase tracking-wider">Order Summary</span>
                  <span className="text-xs font-bold text-brand-muted">{cart.length} items</span>
                </div>
                <div className="space-y-2 mb-3">
                  {cart.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-text truncate max-w-[200px]">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-sm font-bold text-brand-text">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <p className="text-xs text-brand-muted font-medium">+{cart.length - 3} more items</p>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-sm font-black text-brand-text">Total</span>
                  <span className="text-xl font-black text-brand-text tracking-tighter">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Options */}
              <div>
                <h3 className="text-xs font-black text-brand-text uppercase tracking-wider mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                  {paymentOptions.map(opt => {
                    const Icon = opt.icon;
                    const isActive = selected === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelected(opt.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                          isActive
                            ? "border-brand-orange bg-brand-orange/5 shadow-md"
                            : "border-gray-100 bg-white hover:border-gray-200"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          isActive ? "bg-brand-orange/10" : "bg-gray-50"
                        )}>
                          <Icon size={22} className={isActive ? "text-brand-orange" : "text-brand-muted"} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-brand-text text-sm">{opt.label}</div>
                          <div className="text-xs font-medium text-brand-muted mt-0.5">{opt.desc}</div>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all",
                          isActive ? "border-brand-orange" : "border-gray-200"
                        )}>
                          {isActive && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <ShieldCheck size={14} className="text-brand-green" />
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Secure & Encrypted</span>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-orange text-white rounded-2xl font-black hover:bg-brand-text transition-all shadow-lg shadow-brand-orange/20 active:scale-[0.98]"
              >
                Confirm Order — ₹{totalPrice.toLocaleString()}
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
