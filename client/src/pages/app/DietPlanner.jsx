import React, { useState } from "react";
import { Target, Activity, UtensilsCrossed, ChevronRight, Flame, Coffee, Sun, Sunset, Moon, Apple, Beef, Wheat, Plus, Check, Sparkles, Zap, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, Button, Badge } from "../../components/ui";
import { FoodCard } from "../../components/shared/FoodCard";
import { toast } from "sonner";

const GOALS = [
  { id: "fat-loss", label: "Fat Loss", icon: "", description: "Reduce body fat & lean out" },
  { id: "muscle-gain", label: "Mass Gain", icon: "💪", description: "Build elite muscle mass" },
  { id: "maintenance", label: "Conditioning", icon: "", description: "Maintain current performance" },
];

const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", description: "Office work, low movement" },
  { id: "light", label: "Tactical", description: "Exercise 1-3 times/week" },
  { id: "moderate", label: "Athlete", description: "Exercise 4-5 times/week" },
  { id: "very", label: "Elite", description: "Exercise 6-7 times/week" },
];

const DIET_PREFERENCES = [
  { id: "vegetarian", label: "Veg", icon: "🥗" },
  { id: "non-veg", label: "Non-Veg", icon: "🍗" },
  { id: "vegan", label: "Plant", icon: "🌱" },
];

const SAMPLE_MEAL_PLANS = {
  "fat-loss": {
    breakfast: [
      {
        id: 1,
        name: "Steel-Cut Oats with Berries",
        image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=400&fit=crop",
        portion: "1 bowl",
        calories: 280,
        protein: 10,
        carbs: 45,
        fat: 6,
        tags: ["High Fiber", "Low GI"]
      },
    ],
    lunch: [
      {
        id: 2,
        name: "Grilled Paneer & Quinoa",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
        portion: "250g serving",
        calories: 320,
        protein: 42,
        carbs: 12,
        fat: 10,
        tags: ["High Protein", "Indian"]
      },
    ],
    snack: [
      {
        id: 3,
        name: "Greek Yogurt",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
        portion: "150g",
        calories: 150,
        protein: 15,
        carbs: 18,
        fat: 3,
        tags: ["Protein", "Gut Health"]
      },
    ],
    dinner: [
      {
        id: 4,
        name: "Lean Chicken Tikka Salad",
        image: "https://images.unsplash.com/photo-1599481238640-4c1288750d7a?w=400&h=400&fit=crop",
        portion: "1 bowl",
        calories: 450,
        protein: 52,
        carbs: 10,
        fat: 12,
        tags: ["Keto Friendly", "Elite"]
      },
    ],
  },
};

const MEAL_TIMES = [
  { id: "breakfast", label: "Fuel I", icon: Coffee, time: "07:00" },
  { id: "lunch", label: "Fuel II", icon: Sun, time: "13:00" },
  { id: "snack", label: "Fuel III", icon: Apple, time: "16:30" },
  { id: "dinner", label: "Fuel IV", icon: Moon, time: "20:00" },
];

export function DietPlanner() {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [showPlan, setShowPlan] = useState(false);

  const handleGeneratePlan = () => {
    if (!selectedGoal || !selectedActivity || !selectedDiet) {
      toast.error("Protocol incomplete. Verify parameters.");
      return;
    }
    setShowPlan(true);
    toast.success("AI Nutrition Protocol Synchronized");
  };

  const resetPlan = () => {
    setStep(1);
    setSelectedGoal(null);
    setSelectedActivity(null);
    setSelectedDiet(null);
    setShowPlan(false);
  };

  const currentMealPlan = SAMPLE_MEAL_PLANS[selectedGoal] || SAMPLE_MEAL_PLANS["fat-loss"];
  const totalCalories = currentMealPlan ?
    Object.values(currentMealPlan).flat().reduce((sum, meal) => sum + (meal?.calories || 0), 0) : 0;
  const totalProtein = currentMealPlan ?
    Object.values(currentMealPlan).flat().reduce((sum, meal) => sum + (meal?.protein || 0), 0) : 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-1000 max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Invisible AI Optimization</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">Nutrition <span className="text-primary italic">Protocol</span></h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl font-medium text-lg">Engineering peak metabolic performance with Indian-centric nutrition data.</p>
      </div>

      {!showPlan ? (
        <div className="space-y-12">
          {/* Progress Steps */}
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900/50 p-2 rounded-sm border border-border/40">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-3 px-6 py-3 flex-1 justify-center transition-all">
                  <div
                    className={`w-7 h-7 rounded-sm flex items-center justify-center font-black text-[10px] transition-all border ${step >= s
                      ? "bg-primary border-primary text-white"
                      : "bg-white dark:bg-[#0f172a] border-border text-slate-400"
                      }`}
                  >
                    {step > s ? <Check size={14} strokeWidth={4} /> : `0${s}`}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step >= s ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                    {s === 1 ? "Goal" : s === 2 ? "Activity" : "Protocol"}
                  </span>
                </div>
                {s < 3 && <div className="w-px h-6 bg-border/40" />}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Goal Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`p-10 rounded-sm text-left transition-all border group relative overflow-hidden ${selectedGoal === goal.id
                      ? "bg-primary border-primary text-white shadow-2xl shadow-primary/20"
                      : "bg-white dark:bg-[#0f172a] border-border/40 hover:border-primary/50 text-slate-900 dark:text-white"
                      }`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Target size={120} />
                    </div>
                    <div className="text-4xl mb-6">{goal.icon}</div>
                    <h3 className="font-black text-xl uppercase tracking-tighter mb-2">{goal.label}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedGoal === goal.id ? "text-blue-100" : "text-slate-400"}`}>
                      {goal.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedGoal}
                  className="h-16 px-12 rounded-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 text-xs"
                >
                  Confirm Goal <ChevronRight size={18} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Activity Level */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ACTIVITY_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedActivity(level.id)}
                    className={`p-8 rounded-sm text-left transition-all border group ${selectedActivity === level.id
                      ? "bg-primary border-primary text-white shadow-2xl shadow-primary/20"
                      : "bg-white dark:bg-[#0f172a] border-border/40 hover:border-primary/50 text-slate-900 dark:text-white"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-xl uppercase tracking-tighter">{level.label}</h3>
                      <Activity size={20} className={selectedActivity === level.id ? "text-white" : "text-primary"} />
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedActivity === level.id ? "text-blue-100" : "text-slate-400"}`}>
                      {level.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-16 px-10 rounded-sm font-black uppercase tracking-widest border-2 text-[10px]"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedActivity}
                  className="h-16 px-10 rounded-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 text-[10px]"
                >
                  Initialize Analysis
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Diet Preference */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DIET_PREFERENCES.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => setSelectedDiet(pref.id)}
                    className={`p-10 rounded-sm text-center transition-all border group ${selectedDiet === pref.id
                      ? "bg-primary border-primary text-white shadow-2xl shadow-primary/20"
                      : "bg-white dark:bg-[#0f172a] border-border/40 hover:border-primary/50 text-slate-900 dark:text-white"
                      }`}
                  >
                    <div className="text-5xl mb-6 drop-shadow-lg">{pref.icon}</div>
                    <h3 className="font-black text-xl uppercase tracking-tighter">{pref.label}</h3>
                    <p className={`text-[9px] font-black uppercase tracking-widest mt-2 ${selectedDiet === pref.id ? "text-blue-100" : "text-slate-400"}`}>Source Selection</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 justify-end pt-10 border-t border-border/5">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="h-16 px-10 rounded-sm font-black uppercase tracking-widest border-2 text-[10px]"
                >
                  Back
                </Button>
                <Button
                  onClick={handleGeneratePlan}
                  disabled={!selectedDiet}
                  className="h-16 px-12 rounded-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/40 text-[10px]"
                >
                  Generate AI Protocol <Zap size={16} className="ml-2 fill-current" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-12 pb-24"
        >
          {/* Plan Header */}
          <Card className="p-10 bg-gradient-to-br from-slate-900 via-[#0f172a] to-primary border-none text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/20 blur-[100px] pointer-events-none" />
            <div className="absolute -top-10 -left-10 opacity-10">
              <UtensilsCrossed size={200} />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-300">Synchronized Protocol v1.4</span>
                  </div>
                  <h2 className="text-4xl font-black mb-1 uppercase tracking-tighter">Performance Matrix</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200/60">
                    {GOALS.find(g => g.id === selectedGoal)?.label} • {DIET_PREFERENCES.find(d => d.id === selectedDiet)?.label} Source
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetPlan}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-sm font-black uppercase tracking-widest text-[9px] px-6"
                >
                  Reset Interface
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-1">
                  <p className="text-4xl font-black tracking-tighter">{totalCalories}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-200/60">Target kcal / Day</p>
                </div>
                <div className="flex flex-col gap-1 border-l border-white/10 pl-8">
                  <p className="text-4xl font-black tracking-tighter">{totalProtein}g</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-200/60">Amino Acid Intake</p>
                </div>
                <div className="flex flex-col gap-1 border-l border-white/10 pl-8">
                  <p className="text-4xl font-black tracking-tighter">04</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-200/60">Nutrient Windows</p>
                </div>
                <div className="flex flex-col gap-1 border-l border-white/10 pl-8">
                  <p className="text-4xl font-black tracking-tighter">98%</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-200/60">AI Accuracy Rating</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-12">
              {MEAL_TIMES.map((mealTime) => {
                const Icon = mealTime.icon;
                const meals = currentMealPlan[mealTime.id] || [];

                return (
                  <div key={mealTime.id} className="relative">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 border border-border/40 rounded-sm flex items-center justify-center relative">
                        <Icon size={20} className="text-primary" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(30,64,175,0.8)]" />
                      </div>
                      <div>
                        <h3 className="font-black text-xl uppercase tracking-tighter text-slate-900 dark:text-white leading-none mb-1">{mealTime.label}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mealTime.time} HRS WINDOW</p>
                      </div>
                    </div>

                    <div className="space-y-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-6">
                      {meals.map((meal) => (
                        <Card key={meal.id} className="p-6 bg-white dark:bg-[#0f172a] border-border/40 hover:border-primary/50 transition-all cursor-pointer shadow-sm relative overflow-hidden group">
                          <div className="absolute right-0 top-0 bottom-0 w-24 opacity-20 pointer-events-none overflow-hidden">
                            <img src={meal.image} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                          </div>
                          <div className="relative z-10 flex items-center justify-between pr-20">
                            <div>
                              <h4 className="font-black text-lg uppercase tracking-tighter text-slate-900 dark:text-white mb-2">{meal.name}</h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-[9px] font-bold uppercase py-0.5 border-border/50">{meal.portion}</Badge>
                                <Badge variant="outline" className="text-[9px] font-bold uppercase py-0.5 border-border/50 text-primary">{meal.calories} KCAL</Badge>
                                <Badge variant="outline" className="text-[9px] font-bold uppercase py-0.5 border-border/50 text-green-600">{meal.protein}P</Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50">
                              <Info size={16} className="text-slate-400" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-8">
              <Card className="p-8 border-2 border-dashed border-border/40 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-[#0f172a] rounded-sm border border-border/40 shadow-sm flex items-center justify-center mb-6">
                  <Plus size={24} className="text-slate-400" />
                </div>
                <h4 className="font-black text-xl uppercase tracking-tighter text-slate-900 dark:text-white mb-2">Supplement Stack</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 max-w-xs mb-8">AI analysis of micronutrient deficiencies based on selection.</p>
                <Button variant="outline" className="w-full h-14 rounded-sm font-black uppercase text-[10px] tracking-widest border-2">Unlock Supplement Engine</Button>
              </Card>

              <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-primary opacity-10">
                  <Target size={120} />
                </div>
                <div className="relative z-10">
                  <h4 className="font-black text-lg uppercase tracking-tighter text-slate-900 dark:text-white mb-2">Pro Coaching Tip</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic border-l-4 border-primary pl-4 py-2">
                    "Consistency beats perfection. If you miss a meal window, do not double the next dose. Maintain the metabolic fire at a steady rate."
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white" />
                    <div>
                      <p className="text-[11px] font-black uppercase text-slate-900 dark:text-white leading-none mb-1">Coach Vikram S.</p>
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Master Protocol Designer</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
