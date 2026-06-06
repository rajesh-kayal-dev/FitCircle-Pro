import React, { useState } from "react";
import { Search as SearchIcon, Filter, Play, Clock, Flame, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const filters = ["All", "Workouts", "Trainers", "Food"];

const results = [
  { id: 1, type: "Workout", title: "HIIT Blast", category: "Strength", duration: "25m", difficulty: "High", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400" },
  { id: 2, type: "Trainer", title: "Dr. Pal", category: "Nutrition", duration: "N/A", difficulty: "Expert", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400" },
  { id: 3, type: "Workout", title: "Zen Yoga", category: "Flexibility", duration: "40m", difficulty: "Beginner", image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=400" },
  { id: 4, type: "Food", title: "High Protein Bowl", category: "Diet", duration: "15m", difficulty: "Easy", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400" },
];

export default function Search() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="max-w-screen-xl mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 mb-6">Explore</h1>

        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-3xl p-3 shadow-sm mb-6 max-w-2xl">
          <SearchIcon className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search workouts, recipes, trainers..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
          />
          <button className="p-2 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar px-1 w-full">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${activeFilter === filter
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm group cursor-pointer"
          >
            <div className="aspect-[16/9] w-full overflow-hidden relative">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-slate-800">
                  {item.type}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                <div className="flex items-center gap-1 text-accent-orange">
                  <Flame className="w-3 h-3" fill="currentColor" />
                  <span className="text-[10px] font-black">{item.difficulty}</span>
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-4">{item.title}</h3>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold">{item.duration}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl text-slate-900 group-hover:bg-accent-orange group-hover:text-white transition-colors">
                  <Play className="w-4 h-4" fill="currentColor" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-black text-slate-900 mb-6">Top Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["Muscle Building", "Cardio", "Yoga", "Crossfit"].map((cat) => (
            <div
              key={cat}
              className="relative aspect-square rounded-3xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm"
            >
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors z-10" />
              <img
                src={`https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200`}
                alt={cat}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <p className="text-white font-black text-sm tracking-tight">{cat}</p>
                <div className="flex items-center text-white/80 text-[10px] font-bold">
                  Explore <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
