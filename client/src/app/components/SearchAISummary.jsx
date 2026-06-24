import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, X } from 'lucide-react';

export default function SearchAISummary({ title, summary, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative flex items-start gap-4 mb-6"
        style={{
          background: '#FFF7F1',
          border: '1px solid #FFE2CF',
          borderRadius: '16px',
          padding: '16px',
          minHeight: '80px',
        }}
      >
        <div className="flex-shrink-0 mt-1">
          <Zap size={24} className="text-brand-orange" />
        </div>
        <div className="flex-1 pr-8">
          <h3 className="font-black text-brand-orange text-sm mb-1">{title || "Quick Answer"}</h3>
          <p className="text-brand-text text-sm font-medium leading-relaxed line-clamp-2">
            {summary}
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-muted hover:text-brand-text transition-colors p-1"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
