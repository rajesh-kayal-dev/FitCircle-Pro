import { ArrowRight, CheckCircle } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

export function OrderSuccessModal({ open, orderId, onClose }) {
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose();
    navigate("/products");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-x-4 top-[50%] -translate-y-[50%] sm:inset-auto sm:left-[50%] sm:top-[50%] sm:-translate-x-[50%] sm:-translate-y-[50%] sm:w-[420px] bg-white rounded-[2rem] z-[91] shadow-2xl overflow-hidden"
          >
            <div className="p-8 flex flex-col items-center text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 12 }}
                className="w-24 h-24 rounded-full bg-brand-green/10 flex items-center justify-center mb-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", damping: 10 }}
                >
                  <CheckCircle size={48} className="text-brand-green" strokeWidth={2.5} />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-black text-brand-text tracking-tight mb-2"
              >
                Order Placed! 🎉
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-brand-muted font-medium mb-2"
              >
                Your order will be delivered soon.
              </motion.p>

              {orderId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 mb-8"
                >
                  <span className="text-xs font-bold text-brand-muted">Order ID: </span>
                  <span className="text-xs font-black text-brand-text">{orderId}</span>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={handleContinue}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-orange text-white rounded-2xl font-black hover:bg-brand-text transition-all shadow-lg shadow-brand-orange/20 active:scale-[0.98]"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
