import React, { useState } from "react";
import { Search as SearchIcon, X, TrendingUp, Users, Utensils, Dumbbell } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../app/components/ui";

const filters = [
  { id: "all", label: "All", icon: TrendingUp },
  { id: "workouts", label: "Workouts", icon: Dumbbell },
  { id: "trainers", label: "Trainers", icon: Users },
  { id: "food", label: "Food", icon: Utensils },
];

const searchResults = {
  workouts: [
    { id: 1, name: "Full Body Shred", category: "HIIT", duration: "45 min", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop" },
    { id: 2, name: "Morning Yoga Flow", category: "Yoga", duration: "30 min", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop" },
    { id: 3, name: "Power Lift Session", category: "Strength", duration: "60 min", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop" },
    { id: 4, name: "Core Burner", category: "Abs", duration: "20 min", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop" },
  ],
  trainers: [
    { id: 1, name: "Sahil Khan", specialty: "Bodybuilding", followers: "2.4M", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop" },
    { id: 2, name: "Yasmin Karachiwala", specialty: "Pilates", followers: "1.8M", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop" },
    { id: 3, name: "Rahul Saini", specialty: "Strength", followers: "890K", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" },
  ],
  food: [
    { id: 1, name: "Grilled Chicken Bowl", calories: 420, protein: "45g", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop" },
    { id: 2, name: "Protein Smoothie", calories: 280, protein: "32g", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300&h=300&fit=crop" },
    { id: 3, name: "Avocado Toast", calories: 350, protein: "12g", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=300&fit=crop" },
  ],
};

const trendingSearches = [
  "HIIT Workouts",
  "Weight Loss Diet",
  "Muscle Building",
  "Yoga for Beginners",
  "Protein Supplements",
];

export default function Search() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const getResults = () => {
    if (activeFilter === "all") {
      return [
        ...searchResults.workouts.slice(0, 2),
        ...searchResults.trainers.slice(0, 2),
        ...searchResults.food.slice(0, 2),
      ];
    }
    return searchResults[activeFilter] || [];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="sticky top-0 z-10 bg-brand-bg/90 backdrop-blur-xl pb-4 -mt-4 pt-4 px-4 md:px-0">
        <h2 className="text-2xl font-black text-brand-text tracking-tight mb-4">Explore</h2>

        {/* Smart Search Bar */}
        <div className={cn(
          "relative transition-all duration-300",
          isFocused ? "scale-[1.02] shadow-xl shadow-brand-orange/10" : "shadow-sm"
        )}>
          <SearchIcon
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted"
          />
          <input
            type="text"
            placeholder="Search workouts, trainers, food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-14 pr-14 py-4 bg-white border border-gray-200 rounded-3xl text-sm font-bold text-brand-text placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-text transition-colors bg-gray-100 rounded-full p-1"
            >
              <X size={16} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-3 mt-6 overflow-x-auto hide-scrollbar pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300",
                activeFilter === filter.id
                  ? "bg-brand-text text-white shadow-md shadow-brand-text/30"
                  : "bg-white text-gray-500 hover:text-brand-text border border-gray-200 hover:border-gray-300"
              )}
            >
              <filter.icon size={18} className={cn(activeFilter === filter.id ? "text-brand-orange" : "")} />
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {!searchQuery && (
        <section className="px-4 md:px-0">
          <h3 className="text-sm font-black text-brand-text uppercase tracking-wider mb-4 opacity-80">Trending Searches</h3>
          <div className="flex flex-wrap gap-3">
            {trendingSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(term)}
                className="px-5 py-2.5 bg-white border border-gray-100 shadow-sm rounded-xl text-sm font-bold text-brand-text hover:border-brand-orange hover:text-brand-orange transition-all"
              >
                <TrendingUp size={16} className="inline mr-2 text-brand-orange" />
                {term}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 md:px-0 pb-8">
        <h3 className="text-xl font-black text-brand-text mb-6 tracking-tight">
          {activeFilter === "all" ? "Recommended For You" : filters.find(f => f.id === activeFilter)?.label}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {getResults().map((item, index) => (
            <motion.div
              key={`${activeFilter}-${item.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="font-black text-lg text-white mb-1 leading-tight tracking-tight">{item.name}</h4>
                  <p className="text-sm font-medium text-white/80">
                    {item.category || item.specialty || `${item.calories} cal`}
                  </p>
                </div>
              </div>
              <div className="px-4 py-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between text-xs font-bold text-brand-muted">
                  {item.duration && <span>{item.duration}</span>}
                  {item.followers && <span>{item.followers} followers</span>}
                  {item.protein && <span>{item.protein} protein</span>}
                  <span className="text-brand-orange">Explore →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
