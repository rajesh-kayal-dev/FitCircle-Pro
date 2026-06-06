import React, { useState } from "react";
import { X, MapPin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function CheckoutModal({ open, onClose, onContinue }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const isValid = form.name && form.phone && form.address && form.city && form.pincode;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) onContinue(form);
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
                  <MapPin size={18} className="text-brand-orange" />
                </div>
                <h2 className="text-lg font-black text-brand-text tracking-tight">Delivery Address</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <X size={20} className="text-brand-muted" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-black text-brand-text uppercase tracking-wider mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-brand-text placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-brand-text uppercase tracking-wider mb-2 block">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-brand-text placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-brand-text uppercase tracking-wider mb-2 block">Address</label>
                <textarea
                  value={form.address}
                  onChange={e => update("address", e.target.value)}
                  placeholder="House no, Street, Locality"
                  rows={2}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-brand-text placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-brand-text uppercase tracking-wider mb-2 block">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => update("city", e.target.value)}
                    placeholder="Mumbai"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-brand-text placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-brand-text uppercase tracking-wider mb-2 block">Pincode</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={e => update("pincode", e.target.value)}
                    placeholder="400001"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-brand-text placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-orange text-white rounded-2xl font-black hover:bg-brand-text transition-all shadow-lg shadow-brand-orange/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                Continue to Payment
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
