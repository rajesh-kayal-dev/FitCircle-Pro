import { Dumbbell, Flame, Wind, Heart, Activity, Zap, Clock, Play, TrendingUp, Filter, Headphones, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../app/components/ui";

const workoutCategories = [
  { id: "all", label: "All", icon: Activity, color: "from-gray-500 to-gray-700" },
  { id: "hiit", label: "HIIT", icon: Flame, color: "from-brand-orange to-brand-red" },
  { id: "strength", label: "Strength", icon: Dumbbell, color: "from-brand-text to-gray-700" },
  { id: "yoga", label: "Yoga", icon: Wind, color: "from-brand-green to-emerald-600" },
  { id: "cardio", label: "Cardio", icon: Heart, color: "from-blue-500 to-cyan-600" },
];

const workouts = [
  { id: 1, title: "Upper Body Blast", category: "strength", level: "Intermediate", duration: "45m", kcal: 320, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop" },
  { id: 2, title: "Core Crusher", category: "strength", level: "Beginner", duration: "20m", kcal: 180, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop" },
  { id: 3, title: "Sunrise Vinyasa", category: "yoga", level: "Advanced", duration: "60m", kcal: 240, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop" },
  { id: 4, title: "Endurance Run", category: "cardio", level: "All Levels", duration: "30m", kcal: 450, image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop" },
  { id: 5, title: "HIIT Shred", category: "hiit", level: "Pro", duration: "25m", kcal: 510, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop" },
  { id: 6, title: "Power Yoga", category: "yoga", level: "Intermediate", duration: "40m", kcal: 280, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop" },
];

import { Link } from "react-router";

export default function Workouts() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredWorkouts = activeCategory === "all"
    ? workouts
    : workouts.filter(w => w.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Vibes Music Banner ── */}
      <Link to="/vibes" className="block px-4 md:px-0">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-purple to-indigo-600 p-6 md:p-8 flex flex-col justify-center items-start shadow-xl shadow-brand-purple/20 group transition-transform hover:scale-[1.01] active:scale-[0.98]">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=3269&auto=format&fit=crop')] mix-blend-overlay opacity-30 object-cover object-center pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Headphones size={20} className="text-white" />
            </div>
            <span className="text-white/90 font-black tracking-widest uppercase text-xs">Vibe Zone</span>
          </div>

          <h2 className="relative z-10 text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
            Train with Music
          </h2>
          <p className="relative z-10 text-white/80 font-medium text-sm md:text-base mt-2 max-w-sm">
            Listen to your favorite high-energy workout vibes right here on FitCircle.
          </p>

          <div className="relative z-10 mt-6 flex items-center gap-2 text-white font-black text-sm group-hover:gap-3 transition-all">
            Explore Vibes <ArrowRight size={16} />
          </div>
        </div>
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 md:px-0 pt-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text tracking-tight">Workouts</h1>
          <p className="text-brand-muted text-sm mt-1 font-medium">500+ premium classes for every goal</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none justify-center px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-text hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center shadow-sm">
            <Filter size={16} className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Changed to flex-wrap to prevent horizontal scrolling */}
      <div className="flex flex-wrap gap-2 px-4 md:px-0">
        {workoutCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-[1.25rem] transition-all duration-300 font-bold text-sm flex-grow md:flex-grow-0 justify-center",
              activeCategory === cat.id
                ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-black/10 scale-105 z-10`
                : "bg-white text-gray-500 hover:text-brand-text hover:bg-gray-50 border border-gray-100 shadow-sm"
            )}
          >
            <cat.icon size={16} className={cn("transition-transform", activeCategory === cat.id && "scale-110")} />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {filteredWorkouts.map((workout, index) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col"
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
              <img
                src={workout.image}
                alt={workout.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-xs font-black text-white tracking-wider shadow-sm border border-white/20">
                  {workout.category.toUpperCase()}
                </span>
              </div>

              <div className="absolute top-4 right-4">
                <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-brand-red/80 transition-colors">
                  <Heart size={16} className="text-white" />
                </button>
              </div>

              <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                  <Play className="fill-brand-text text-brand-text translate-x-0.5" size={24} />
                </div>
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-brand-text mb-3 leading-tight tracking-tight group-hover:text-brand-orange transition-colors">{workout.title}</h3>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-brand-muted bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Clock size={16} className="text-brand-text" />
                    <span className="text-sm font-bold">{workout.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-muted bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Flame size={16} className="text-brand-orange" />
                    <span className="text-sm font-bold">{workout.kcal} cal</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                  {workout.level}
                </span>
                <span className="text-sm font-black text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                  Start Training →
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mx-4 md:mx-0">
          <div className="text-brand-text font-black text-xl tracking-tight mb-2">No Workouts Found</div>
          <p className="text-brand-muted font-medium">Try selecting a different category or clearing filters</p>
        </div>
      )}
    </div>
  );
}
