import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Play, Clock, Flame, Dumbbell, Zap, Waves, Brain, Filter, ChevronRight, Activity, Music } from "lucide-react";
import { motion } from "motion/react";

const workouts = [
  { id: 1, title: "Lower Body Blast", category: "Strength", duration: "45m", level: "Int", kcal: "450", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600", color: "text-accent-orange" },
  { id: 2, title: "Cardio Shred", category: "Cardio", duration: "30m", level: "Adv", kcal: "600", image: "https://images.unsplash.com/photo-1518611012118-29fa75a28420?auto=format&fit=crop&q=80&w=600", color: "text-accent-red" },
  { id: 3, title: "Mindful Flow", category: "Yoga", duration: "50m", level: "Beg", kcal: "200", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600", color: "text-accent-green" },
  { id: 4, title: "Core Power", category: "Abs", duration: "15m", level: "All", kcal: "180", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600", color: "text-accent-orange" },
  { id: 5, title: "Full Body Ignite", category: "HIIT", duration: "40m", level: "Adv", kcal: "550", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600", color: "text-accent-red" },
  { id: 6, title: "Strength & Conditioning", category: "Power", duration: "60m", level: "Int", kcal: "720", image: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?auto=format&fit=crop&q=80&w=600", color: "text-accent-orange" },
];

const categories = [
  { name: "Strength", icon: Dumbbell },
  { name: "Cardio", icon: Zap },
  { name: "Yoga", icon: Brain },
  { name: "Swimming", icon: Waves },
];

export default function Workout() {
  const [activeTab, setActiveTab] = useState("Strength");
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-xl mx-auto p-4 lg:p-8">
      {/* ─── VIBES BANNER ─── */}
      <div className="mb-8 bg-gradient-to-r from-accent-orange to-accent-red rounded-3xl p-6 lg:p-8 relative overflow-hidden group cursor-pointer shadow-xl shadow-accent-orange/20" onClick={() => navigate('/vibes')}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        <div className="absolute right-0 top-0 w-64 h-full">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop" alt="Music" className="w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-red to-transparent" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                <Music className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/90 text-[10px] font-black uppercase tracking-widest">Vibe Zone</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white mb-2 tracking-tight">Train with Music</h2>
            <p className="text-white/80 font-medium text-sm">Listen to curated tracks to fuel your sessions</p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-accent-orange transition-all duration-300 text-white shadow-lg">
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">My Workouts</h1>
          <p className="text-slate-500 font-medium">Ready to break your limits today?</p>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 lg:pb-0 w-full lg:w-auto px-1">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(cat.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${activeTab === cat.name
                  ? "bg-white text-slate-900 border-slate-200"
                  : "bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100"
                }`}
            >
              <cat.icon className={`w-4 h-4 ${activeTab === cat.name ? "text-accent-orange" : "text-slate-400"}`} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
          <button className="text-accent-orange font-bold text-sm flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workouts.map((workout) => (
            <motion.div
              key={workout.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md shadow-slate-200/50 flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img src={workout.image} alt={workout.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
                  <Activity className="w-3 h-3 text-accent-red" />
                  {workout.kcal} KCAL
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl">
                    <Play className="w-6 h-6 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${workout.color}`}>{workout.category}</span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold">{workout.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-6">{workout.title}</h3>

                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Level</span>
                      <span className="text-sm font-black text-slate-900">{workout.level}</span>
                    </div>
                    <div className="h-6 w-[1px] bg-slate-100" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Type</span>
                      <span className="text-sm font-black text-slate-900">Video</span>
                    </div>
                  </div>

                  <button className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-accent-orange transition-colors shadow-lg shadow-slate-200">
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tighter">Personal Training</h2>
          <p className="text-slate-400 mb-8 font-medium leading-relaxed">Get a customized workout plan tailored specifically for your body and goals by our elite AI coaches.</p>
          <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-accent-orange hover:text-white transition-all shadow-xl shadow-black/20">
            Start AI Evaluation
          </button>
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400" alt="Trainer" className="w-full h-full object-cover opacity-50 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}
