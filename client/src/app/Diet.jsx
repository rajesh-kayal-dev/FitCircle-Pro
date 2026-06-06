import React, { useState } from "react";
import { Search, Camera, Sparkles, Plus, Clock, Info, ChevronRight, Activity, Zap, Flame, Target, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const foodItems = [
  { id: 1, name: "Grilled Chicken Breast", kcal: "165", protein: "31g", carbs: "0g", fats: "3.6g", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=300" },
  { id: 2, name: "Oatmeal with Berries", kcal: "210", protein: "6g", carbs: "42g", fats: "4g", image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=300" },
  { id: 3, name: "Quinoa Salad", kcal: "220", protein: "8g", carbs: "39g", fats: "5g", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300" },
];

export default function Diet() {
  const [isScanning, setIsScanning] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <div className="max-w-screen-xl mx-auto p-4 lg:p-8">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Diet Tracker</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm focus-within:border-accent-orange transition-colors">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 500,000+ foods..."
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
                />
              </div>
              <button
                onClick={() => setIsScanning(true)}
                className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-accent-orange transition-all shadow-lg shadow-slate-200"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Recent Meals</h2>
                <button className="text-accent-orange font-bold text-sm">Clear All</button>
              </div>

              <div className="space-y-4">
                {foodItems.map((food) => (
                  <motion.div
                    key={food.id}
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-50">
                        <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{food.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">Serving: 100g • {food.kcal} kcal</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="hidden sm:flex items-center gap-6">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Pro</span>
                          <span className="text-xs font-black text-slate-800">{food.protein}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Carb</span>
                          <span className="text-xs font-black text-slate-800">{food.carbs}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Fat</span>
                          <span className="text-xs font-black text-slate-800">{food.fats}</span>
                        </div>
                      </div>
                      <button className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-accent-green group-hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setShowGenerator(true)}
              className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50 border border-slate-200 overflow-hidden group cursor-pointer shadow-sm shadow-slate-100"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-accent-orange/10 rounded-xl text-accent-orange">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent-orange">Powered by AI</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">AI Diet Generator</h3>
                <p className="text-slate-500 font-medium max-w-sm mb-6">Create a personalized 30-day meal plan based on your current weight, activity, and goals.</p>
                <div className="flex items-center text-slate-900 font-bold text-sm">
                  Generate My Plan <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
              <div className="absolute top-4 right-4 text-slate-100 group-hover:text-accent-orange/5 transition-colors">
                <Utensils className="w-48 h-48" />
              </div>
            </motion.div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 text-slate-900">Nutrition Goals</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calories</span>
                    <span className="text-sm font-black text-slate-900">1,840 / 2,400 kcal</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-orange w-[75%] rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Protein</span>
                    <span className="text-sm font-black text-slate-900">142g</span>
                    <div className="h-1 w-full bg-accent-red/20 mt-2 rounded-full">
                      <div className="h-full bg-accent-red w-[80%] rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Carbs</span>
                    <span className="text-sm font-black text-slate-900">210g</span>
                    <div className="h-1 w-full bg-accent-green/20 mt-2 rounded-full">
                      <div className="h-full bg-accent-green w-[60%] rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Fat</span>
                    <span className="text-sm font-black text-slate-900">55g</span>
                    <div className="h-1 w-full bg-accent-orange/20 mt-2 rounded-full">
                      <div className="h-full bg-accent-orange w-[45%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Target className="w-5 h-5 text-accent-green" />
                </div>
                <h3 className="font-bold">Next Goal</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4 font-medium leading-relaxed">Reach your protein target 7 days in a row to unlock the "Iron Gut" badge.</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <div key={d} className={`h-1.5 flex-1 rounded-full ${d < 5 ? "bg-accent-green" : "bg-white/10"}`} />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-3 uppercase tracking-widest text-right">4 / 7 DAYS</p>
            </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white"
          >
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-[3rem] overflow-hidden border-4 border-white/20">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400" alt="Scan" className="w-full h-full object-cover grayscale opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-accent-green rounded-3xl relative">
                  <motion.div
                    animate={{ y: [0, 256, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-[2px] bg-accent-green shadow-[0_0_15px_rgba(34,197,94,0.8)]"
                  />
                </div>
              </div>
              <div className="absolute bottom-12 left-0 w-full px-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-xs font-bold text-accent-green uppercase mb-1">Detecting...</p>
                  <p className="text-lg font-black">Mediterranean Bowl</p>
                  <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-300">
                    <span>420 KCAL</span>
                    <span>22G PROTEIN</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-slate-400 font-medium">Keep food within the frame</p>

            <button
              onClick={() => setIsScanning(false)}
              className="mt-12 px-12 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm"
            >
              Cancel Scan
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
