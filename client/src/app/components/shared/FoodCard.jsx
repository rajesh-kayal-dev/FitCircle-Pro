import React from "react";
import { Flame, Apple, Beef, Wheat } from "lucide-react";

export function FoodCard({ food, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer group"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {food.name}
        </h3>

        {food.portion && (
          <p className="text-xs text-slate-500 mb-3">{food.portion}</p>
        )}

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Flame size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-tight">Calories</p>
              <p className="text-sm font-bold text-slate-900">{food.calories}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
              <Beef size={16} className="text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-tight">Protein</p>
              <p className="text-sm font-bold text-slate-900">{food.protein}g</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Wheat size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-tight">Carbs</p>
              <p className="text-sm font-bold text-slate-900">{food.carbs}g</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Apple size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-tight">Fat</p>
              <p className="text-sm font-bold text-slate-900">{food.fat}g</p>
            </div>
          </div>
        </div>

        {food.tags && (
          <div className="flex flex-wrap gap-1.5">
            {food.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
