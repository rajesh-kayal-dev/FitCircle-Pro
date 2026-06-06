import { Camera, Search, Utensils, Flame, Zap, TrendingUp, Plus, X, Scan, RefreshCcw, CheckCircle } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../app/components/ui";
import { toast } from "sonner";

const foodItems = [
  { id: 1, name: "Grilled Chicken Breast", calories: 165, protein: "31g", carbs: "0g", fats: "3.6g", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop" },
  { id: 2, name: "Brown Rice Bowl", calories: 216, protein: "5g", carbs: "45g", fats: "1.6g", image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=200&h=200&fit=crop" },
  { id: 3, name: "Avocado Toast", calories: 350, protein: "12g", carbs: "38g", fats: "18g", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&h=200&fit=crop" },
  { id: 4, name: "Protein Smoothie", calories: 280, protein: "32g", carbs: "24g", fats: "8g", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=200&h=200&fit=crop" },
];

const mealPlan = {
  breakfast: { time: "08:00 AM", meal: "Scrambled Eggs + Whole Wheat Toast", calories: 420, protein: "28g" },
  lunch: { time: "01:00 PM", meal: "Grilled Chicken + Brown Rice + Veggies", calories: 650, protein: "45g" },
  snack: { time: "04:00 PM", meal: "Protein Shake + Banana", calories: 320, protein: "30g" },
  dinner: { time: "08:00 PM", meal: "Salmon + Quinoa + Salad", calories: 520, protein: "38g" },
};

export default function DietPlanner() {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedFood, setScannedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleScanFood = () => {
    setShowScanner(true);
    setTimeout(() => {
      setScannedFood({
        name: "Paneer Tikka",
        calories: 240,
        protein: "18g",
        carbs: "12g",
        fats: "15g",
        confidence: "94%"
      });
      setShowScanner(false);
      toast.success("Food scanned successfully!");
    }, 2500);
  };

  const handleGeneratePlan = (goal) => {
    setSelectedGoal(goal);
    setIsGenerating(true);
    setTimeout(() => {
      setShowGenerator(true);
      setIsGenerating(false);
      toast.success("AI Diet Plan generated!");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">

      {/* Nutrition Hero Card */}
      <div className="bg-gradient-to-br from-brand-orange to-brand-red rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-brand-orange/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Utensils size={180} className="translate-x-10 -translate-y-10" strokeWidth={1} />
        </div>

        <div className="relative z-10 flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight drop-shadow-sm">Nutrition</h2>
            <p className="text-white/80 text-sm mt-1 font-medium">Daily intake summary</p>
          </div>
          <div className="bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-inner text-right">
            <div className="text-3xl font-black tracking-tighter leading-none mb-1">1,910</div>
            <div className="text-xs text-white/70 uppercase tracking-widest font-bold">/ 2,200 cal</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-6 bg-black/10 backdrop-blur-sm p-5 rounded-[1.5rem] border border-white/10">
          <div>
            <div className="text-2xl font-black tracking-tighter mb-1">135g</div>
            <div className="text-xs text-white/70 uppercase tracking-wider font-bold">Protein</div>
          </div>
          <div className="w-px bg-white/20 rounded-full my-1 justify-self-center pointer-events-none" />
          <div>
            <div className="text-2xl font-black tracking-tighter mb-1">180g</div>
            <div className="text-xs text-white/70 uppercase tracking-wider font-bold">Carbs</div>
          </div>
          <div className="w-px bg-white/20 rounded-full my-1 justify-self-center pointer-events-none hidden md:block" />
          <div className="col-span-3 md:col-span-1 border-t border-white/10 md:border-0 pt-3 md:pt-0 mt-2 md:mt-0">
            <div className="text-2xl font-black tracking-tighter mb-1">65g</div>
            <div className="text-xs text-white/70 uppercase tracking-wider font-bold">Fats</div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleScanFood}
          className="flex-1 bg-gradient-to-r from-brand-orange to-brand-red text-white rounded-[1.5rem] p-5 flex items-center justify-center gap-3 font-black shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg group"
        >
          <Camera size={26} className="group-hover:scale-110 transition-transform" />
          Scan Food
        </button>
        <button
          onClick={() => { setSelectedGoal(null); setShowGenerator(false); }}
          className="flex-1 bg-white border border-gray-200 text-brand-text rounded-[1.5rem] p-5 flex items-center justify-center gap-3 font-black shadow-sm hover:border-brand-orange transition-all text-lg group"
        >
          <Zap size={26} className="text-brand-orange group-hover:scale-110 transition-transform" />
          AI Diet Plan
        </button>
      </div>

      {/* Modals & Scanning States */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-sm aspect-[3/4] border-2 border-brand-orange/50 rounded-3xl overflow-hidden shadow-2xl shadow-brand-orange/20 mx-4">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=800&fit=crop')] bg-cover opacity-40 mix-blend-luminosity" />

              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
                <Scan size={64} className="text-brand-orange mb-6 animate-pulse" />
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Scanning Food...</h3>
                <p className="text-white/60 text-sm font-medium">Keep camera steady</p>
              </div>

              {/* Fake scanning beam */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-brand-orange shadow-[0_0_20px_2px_#F97316] z-20"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <button onClick={() => setShowScanner(false)} className="mt-8 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
              <X size={24} />
            </button>
          </motion.div>
        )}

        {scannedFood && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-2xl relative z-40 my-6"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-green to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-green/20">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-brand-text leading-tight">{scannedFood.name}</h3>
                  <p className="text-sm font-bold text-brand-muted mt-1">AI Match: {scannedFood.confidence}</p>
                </div>
              </div>
              <button onClick={() => setScannedFood(null)} className="p-2 text-gray-400 hover:text-brand-text bg-gray-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-black text-brand-text mb-1">{scannedFood.calories}</div>
                <div className="text-xs font-bold text-brand-muted uppercase tracking-wider">Calories</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-brand-orange/20 shadow-inner">
                <div className="text-2xl font-black text-brand-orange mb-1">{scannedFood.protein}</div>
                <div className="text-xs font-bold text-brand-orange/80 uppercase tracking-wider">Protein</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-black text-brand-text mb-1">{scannedFood.carbs}</div>
                <div className="text-xs font-bold text-brand-muted uppercase tracking-wider">Carbs</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-black text-brand-text mb-1">{scannedFood.fats}</div>
                <div className="text-xs font-bold text-brand-muted uppercase tracking-wider">Fats</div>
              </div>
            </div>

            <button onClick={() => setScannedFood(null)} className="w-full bg-brand-text hover:bg-gray-800 text-white p-4 rounded-xl font-black tracking-wide shadow-lg transition-all active:scale-[0.98]">
              Add to Diary
            </button>
          </motion.div>
        )}

        {/* AI Diet Plan Generator Section */}
        {selectedGoal === null && !showGenerator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-brand-orange fill-brand-orange/20" size={28} />
              <h3 className="text-xl font-black text-brand-text tracking-tight">AI Plan Generator</h3>
            </div>
            <p className="text-sm font-medium text-brand-muted mb-6">Select your primary fitness goal and let our AI craft the perfect macronutrient-balanced daily meal plan for you.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "loss", label: "Weight Loss", desc: "Caloric deficit focus", icon: TrendingUp, color: "from-brand-red to-pink-500" },
                { id: "gain", label: "Muscle Gain", desc: "High protein surplus", icon: Zap, color: "from-brand-orange to-brand-red" },
                { id: "maintain", label: "Maintain", desc: "Baseline maintenance", icon: Flame, color: "from-brand-green to-emerald-500" },
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGeneratePlan(goal.id)}
                  disabled={isGenerating}
                  className="p-5 rounded-[1.5rem] border border-gray-100 bg-gray-50 text-left hover:border-brand-orange hover:shadow-md transition-all group disabled:opacity-50"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                    <goal.icon size={24} className="text-white" />
                  </div>
                  <h4 className="font-black text-brand-text mb-1">{goal.label}</h4>
                  <p className="text-xs font-medium text-brand-muted">{goal.desc}</p>
                </button>
              ))}
            </div>

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCcw className="animate-spin text-brand-orange mb-4" size={32} />
                <p className="font-bold text-brand-text animate-pulse">AI is crafting your perfect plan...</p>
              </div>
            )}
          </motion.div>
        )}

        {showGenerator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-brand-text tracking-tight">Your AI Plan</h3>
              <button className="text-sm font-bold text-brand-orange hover:text-brand-red transition-colors" onClick={() => setSelectedGoal(null)}>
                Regenerate
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(mealPlan).map(([key, meal], index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={key}
                  className="bg-gray-50 rounded-[1.5rem] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-100 hover:border-brand-orange/20 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 shrink-0 text-lg">
                      {key === 'breakfast' && '🍳'}
                      {key === 'lunch' && '🥗'}
                      {key === 'snack' && '🍎'}
                      {key === 'dinner' && '🥩'}
                    </div>
                    <div>
                      <div className="text-sm font-black text-brand-text mb-1 uppercase tracking-wider">{key} <span className="text-brand-muted text-xs font-bold lowercase bg-white px-2 py-0.5 rounded ml-2 border border-gray-100">{meal.time}</span></div>
                      <div className="text-sm font-medium text-brand-text/90 leading-tight">{meal.meal}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-2 md:mt-0 w-full md:w-auto justify-end">
                    <div className="text-right">
                      <div className="text-sm font-black text-brand-text">{meal.calories} <span className="text-xs text-brand-muted font-bold">cal</span></div>
                    </div>
                    <div className="text-right bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100/50">
                      <div className="text-sm font-black text-brand-orange">{meal.protein} <span className="text-xs font-bold text-brand-orange/70">protein</span></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-6 bg-brand-text hover:bg-gray-800 text-white p-4 rounded-xl font-black tracking-wide shadow-md transition-all">
              Save Plan to Diary
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-brand-text mb-6">Food Database</h3>
        <div className="relative mb-8">
          <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search thousands of foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-[1.5rem] text-sm font-bold text-brand-text placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {foodItems.map((food) => (
            <div key={food.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-brand-orange/30 transition-all cursor-pointer group flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 p-2">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-sm text-brand-text mb-2 leading-tight tracking-tight group-hover:text-brand-orange transition-colors">{food.name}</h4>
                  <p className="text-xs font-bold text-brand-muted mb-4 bg-gray-50 inline-block px-2 py-1 rounded">{food.calories} cal</p>
                </div>
                <button className="w-full bg-gray-50 hover:bg-gradient-to-r hover:from-brand-orange hover:to-brand-red hover:text-white border border-gray-100 text-brand-text py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-md">
                  <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
