import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

export function StatCard({ title, value, change, isPositive, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
            }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}%
          </div>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
    </motion.div>
  );
}
