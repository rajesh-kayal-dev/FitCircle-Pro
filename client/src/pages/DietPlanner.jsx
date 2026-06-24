import { Camera, Search, Utensils, Flame, Zap, TrendingUp, Plus, X, Scan, RefreshCcw, CheckCircle, Loader2, Bot, ArrowLeft, ChevronRight, Download, Clock, MessageCircle } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../app/components/ui";
import { toast } from "sonner";
import { calculateDietTargets, generateDietPlan as apiGenerateDietPlan, getDietPlanHistory, searchFoods, logFood, getTodayFoodLog, askDietAI } from "../api/endpoints";

const goals = [
  { id: "weight_loss", label: "Weight Loss", desc: "Caloric deficit focus", icon: TrendingUp, color: "from-brand-red to-pink-500" },
  { id: "muscle_gain", label: "Muscle Gain", desc: "High protein surplus", icon: Zap, color: "from-brand-orange to-brand-red" },
  { id: "maintenance", label: "Maintenance", desc: "Baseline maintenance", icon: Flame, color: "from-brand-green to-emerald-500" },
  { id: "fat_loss", label: "Fat Loss", desc: "Targeted fat reduction", icon: Flame, color: "from-amber-500 to-orange-500" },
];

const activityLevels = [
  { id: "sedentary", label: "Sedentary", desc: "Desk job, little exercise" },
  { id: "light", label: "Light", desc: "1-3 days/week" },
  { id: "moderate", label: "Moderate", desc: "3-5 days/week" },
  { id: "active", label: "Active", desc: "6-7 days/week" },
];

const dietTypes = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "non_veg", label: "Non Vegetarian" },
  { id: "vegan", label: "Vegan" },
];

export default function DietPlanner() {
  // Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [scannedFood, setScannedFood] = useState(null);

  // Food search state
  const [searchQuery, setSearchQuery] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [foodLoading, setFoodLoading] = useState(false);

  // AI assessment modal state
  const [showAssessment, setShowAssessment] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: "", age: "", gender: "", height: "", weight: "", targetWeight: "",
    activityLevel: "", dietType: "", allergies: "", budget: "medium", mealsPerDay: "4",
  });
  const [calculating, setCalculating] = useState(false);
  const [targets, setTargets] = useState(null);

  // Generated plan state
  const [showPlan, setShowPlan] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  // Food log state
  const [foodLog, setFoodLog] = useState({ logs: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } });
  const [logTargets, setLogTargets] = useState(null);

  // AI chat state
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Debounced food search
  useEffect(() => {
    if (!searchQuery.trim()) { setFoodResults([]); return; }
    const timer = setTimeout(async () => {
      setFoodLoading(true);
      try {
        const { data } = await searchFoods(searchQuery);
        setFoodResults(data.foods || []);
      } catch { setFoodResults([]) }
      finally { setFoodLoading(false) }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch today's food log
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getTodayFoodLog();
        setFoodLog(data);
      } catch {}
    })();
  }, []);

  const handleScanFood = () => {
    setShowScanner(true);
    setTimeout(() => {
      setScannedFood({
        name: "Paneer Tikka", calories: 240, protein: "18g", carbs: "12g", fats: "15g", confidence: "94%",
      });
      setShowScanner(false);
      toast.success("Food scanned successfully!");
    }, 2500);
  };

  const updateForm = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const { data } = await calculateDietTargets({
        age: Number(formData.age), gender: formData.gender, height: Number(formData.height),
        weight: Number(formData.weight), targetWeight: Number(formData.targetWeight) || Number(formData.weight),
        activityLevel: formData.activityLevel, goal: formData.goal, dietType: formData.dietType,
        allergies: formData.allergies, budget: formData.budget, mealsPerDay: Number(formData.mealsPerDay),
      });
      setTargets(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Calculation failed");
    } finally {
      setCalculating(false);
    }
  };

  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    try {
      const { data } = await apiGenerateDietPlan({
        age: Number(formData.age), gender: formData.gender, height: Number(formData.height),
        weight: Number(formData.weight), targetWeight: Number(formData.targetWeight) || Number(formData.weight),
        activityLevel: formData.activityLevel, goal: formData.goal, dietType: formData.dietType,
        allergies: formData.allergies, budget: formData.budget, mealsPerDay: Number(formData.mealsPerDay),
      });
      setPlanData(data.plan);
      setShowPlan(true);
      setShowAssessment(false);
      setStep(1);
      toast.success("AI Diet Plan generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate plan");
    } finally {
      setPlanLoading(false);
    }
  };

  const handleLogFood = async (food) => {
    try {
      await logFood({
        name: food.food_name, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat,
      });
      const { data } = await getTodayFoodLog();
      setFoodLog(data);
      toast.success(`${food.food_name} logged!`);
    } catch { toast.error("Failed to log food"); }
  };

  const handleAskAI = async () => {
    if (!chatInput.trim()) return;
    const question = chatInput;
    setChatMessages(prev => [...prev, { role: "user", text: question }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const { data } = await askDietAI(question);
      setChatMessages(prev => [...prev, { role: "ai", text: data.answer }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "ai", text: "Sorry, I couldn't answer that." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-brand-text">What's your goal?</h3>
            <div className="grid grid-cols-2 gap-3">
              {goals.map(g => (
                <button key={g.id} onClick={() => updateForm("goal", g.id)}
                  className={cn("p-4 rounded-2xl border text-left transition-all", formData.goal === g.id ? "border-brand-orange bg-brand-orange/5 shadow-md" : "border-gray-100 bg-gray-50 hover:border-brand-orange/30")}>
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", g.color)}>
                    <g.icon size={20} className="text-white" />
                  </div>
                  <h4 className="font-black text-sm text-brand-text">{g.label}</h4>
                  <p className="text-[11px] font-medium text-brand-muted mt-0.5">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-brand-text">Tell us about yourself</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-brand-muted block mb-1.5">Age</label>
                <input type="number" value={formData.age} onChange={e => updateForm("age", e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" /></div>
              <div><label className="text-xs font-bold text-brand-muted block mb-1.5">Gender</label>
                <select value={formData.gender} onChange={e => updateForm("gender", e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold">
                  <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
                </select></div>
              <div><label className="text-xs font-bold text-brand-muted block mb-1.5">Height (cm)</label>
                <input type="number" value={formData.height} onChange={e => updateForm("height", e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" /></div>
              <div><label className="text-xs font-bold text-brand-muted block mb-1.5">Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={e => updateForm("weight", e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" /></div>
              <div className="col-span-2"><label className="text-xs font-bold text-brand-muted block mb-1.5">Target Weight (kg)</label>
                <input type="number" value={formData.targetWeight} onChange={e => updateForm("targetWeight", e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" /></div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-brand-text">Activity Level</h3>
            <div className="space-y-3">
              {activityLevels.map(a => (
                <button key={a.id} onClick={() => updateForm("activityLevel", a.id)}
                  className={cn("w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4", formData.activityLevel === a.id ? "border-brand-orange bg-brand-orange/5 shadow-md" : "border-gray-100 bg-gray-50 hover:border-brand-orange/30")}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg", formData.activityLevel === a.id ? "bg-brand-orange text-white" : "bg-gray-200 text-gray-500")}>
                    {a.id === "sedentary" ? "🪑" : a.id === "light" ? "🚶" : a.id === "moderate" ? "🏃" : "🏋️"}
                  </div>
                  <div><h4 className="font-black text-sm text-brand-text">{a.label}</h4><p className="text-[11px] font-medium text-brand-muted">{a.desc}</p></div>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-brand-text">Diet Preference</h3>
            <div className="grid grid-cols-3 gap-3">
              {dietTypes.map(d => (
                <button key={d.id} onClick={() => updateForm("dietType", d.id)}
                  className={cn("p-4 rounded-2xl border text-center transition-all", formData.dietType === d.id ? "border-brand-orange bg-brand-orange/5 shadow-md" : "border-gray-100 bg-gray-50 hover:border-brand-orange/30")}>
                  <div className="text-2xl mb-2">{d.id === "vegetarian" ? "🥬" : d.id === "non_veg" ? "🍗" : "🌱"}</div>
                  <h4 className="font-black text-xs text-brand-text">{d.label}</h4>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-brand-text">Final Details</h3>
            <div><label className="text-xs font-bold text-brand-muted block mb-1.5">Allergies / Restrictions</label>
              <input value={formData.allergies} onChange={e => updateForm("allergies", e.target.value)} placeholder="e.g. lactose, nuts" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" /></div>
            <div><label className="text-xs font-bold text-brand-muted block mb-1.5">Budget</label>
              <select value={formData.budget} onChange={e => updateForm("budget", e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select></div>
            <div><label className="text-xs font-bold text-brand-muted block mb-1.5">Meals Per Day</label>
              <select value={formData.mealsPerDay} onChange={e => updateForm("mealsPerDay", e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold">
                {[3, 4, 5, 6].map(n => <option key={n} value={n}>{n} meals</option>)}
              </select></div>
            {targets && (
              <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-4">
                <h4 className="font-black text-sm text-brand-text mb-3">Your Targets</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div><div className="text-lg font-black text-brand-orange">{targets.calories}</div><div className="text-[10px] font-bold text-brand-muted">Calories</div></div>
                  <div><div className="text-lg font-black text-brand-text">{targets.protein}g</div><div className="text-[10px] font-bold text-brand-muted">Protein</div></div>
                  <div><div className="text-lg font-black text-brand-text">{targets.carbs}g</div><div className="text-[10px] font-bold text-brand-muted">Carbs</div></div>
                  <div><div className="text-lg font-black text-brand-text">{targets.fat}g</div><div className="text-[10px] font-bold text-brand-muted">Fat</div></div>
                </div>
              </div>
            )}
          </div>
        );
    }
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
            <div className="text-3xl font-black tracking-tighter leading-none mb-1">{foodLog.totals.calories}</div>
            <div className="text-xs text-white/70 uppercase tracking-widest font-bold">{logTargets?.calories || 2200} cal goal</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-6 bg-black/10 backdrop-blur-sm p-5 rounded-[1.5rem] border border-white/10">
          <div>
            <div className="text-2xl font-black tracking-tighter mb-1">{Math.round(foodLog.totals.protein)}g</div>
            <div className="text-xs text-white/70 uppercase tracking-wider font-bold">Protein</div>
          </div>
          <div className="w-px bg-white/20 rounded-full my-1 justify-self-center pointer-events-none" />
          <div>
            <div className="text-2xl font-black tracking-tighter mb-1">{Math.round(foodLog.totals.carbs)}g</div>
            <div className="text-xs text-white/70 uppercase tracking-wider font-bold">Carbs</div>
          </div>
          <div className="col-span-3 md:col-span-1 border-t border-white/10 md:border-0 pt-3 md:pt-0 mt-2 md:mt-0">
            <div className="text-2xl font-black tracking-tighter mb-1">{Math.round(foodLog.totals.fat)}g</div>
            <div className="text-xs text-white/70 uppercase tracking-wider font-bold">Fats</div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={handleScanFood} className="flex-1 bg-gradient-to-r from-brand-orange to-brand-red text-white rounded-[1.5rem] p-5 flex items-center justify-center gap-3 font-black shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg group">
          <Camera size={26} className="group-hover:scale-110 transition-transform" />
          Scan Food
        </button>
        <button onClick={() => { setShowAssessment(true); setStep(1); setTargets(null); }} className="flex-1 bg-white border border-gray-200 text-brand-text rounded-[1.5rem] p-5 flex items-center justify-center gap-3 font-black shadow-sm hover:border-brand-orange transition-all text-lg group">
          <Zap size={26} className="text-brand-orange group-hover:scale-110 transition-transform" />
          Generate My Plan
        </button>
        <button onClick={() => setShowChat(true)} className="flex-1 bg-white border border-gray-200 text-brand-text rounded-[1.5rem] p-5 flex items-center justify-center gap-3 font-black shadow-sm hover:border-brand-orange transition-all text-lg group">
          <MessageCircle size={26} className="text-brand-orange group-hover:scale-110 transition-transform" />
          Ask Nutrition AI
        </button>
      </div>

      {/* AI Assessment Modal */}
      <AnimatePresence>
        {showAssessment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b border-gray-100 flex items-center justify-between rounded-t-[2rem]">
                <div className="flex items-center gap-3">
                  {step > 1 && <button onClick={() => setStep(s => s - 1)} className="p-2 hover:bg-gray-50 rounded-xl"><ArrowLeft size={20} /></button>}
                  <div>
                    <h3 className="font-black text-brand-text">AI Assessment</h3>
                    <p className="text-xs font-bold text-brand-muted">Step {step} of 5</p>
                  </div>
                </div>
                <button onClick={() => setShowAssessment(false)} className="p-2 hover:bg-gray-50 rounded-xl"><X size={20} /></button>
              </div>
              <div className="p-6">{renderStep()}</div>
              <div className="p-6 pt-0 flex gap-3">
                {step < 5 ? (
                  <button onClick={() => { if (step === 4) handleCalculate(); setStep(s => Math.min(s + 1, 5)); }} disabled={calculating} className="flex-1 bg-brand-text text-white p-3.5 rounded-xl font-black tracking-wide hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    {calculating ? <Loader2 size={18} className="animate-spin" /> : <>Continue <ChevronRight size={18} /></>}
                  </button>
                ) : (
                  <button onClick={handleGeneratePlan} disabled={planLoading} className="flex-1 bg-gradient-to-r from-brand-orange to-brand-red text-white p-3.5 rounded-xl font-black tracking-wide hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    {planLoading ? <Loader2 size={18} className="animate-spin" /> : <><Zap size={18} /> Generate My Plan</>}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Plan Display */}
      <AnimatePresence>
        {showPlan && planData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-brand-text tracking-tight">Your Diet Plan</h3>
                <p className="text-sm font-bold text-brand-muted mt-1">
                  {planData.calories} cal · {planData.protein}g protein · {planData.carbs}g carbs · {planData.fat}g fat
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setShowPlan(false); setPlanData(null); }} className="p-2 text-gray-400 hover:text-brand-text bg-gray-50 rounded-xl transition-colors"><X size={20} /></button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none font-medium text-brand-text/90 [&_h2]:font-black [&_h2]:text-brand-text [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-black [&_h3]:text-brand-text [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:text-brand-text whitespace-pre-wrap bg-gray-50 rounded-2xl p-6 border border-gray-100">
              {planData.markdownPlan}
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-brand-text text-white p-3.5 rounded-xl font-black tracking-wide hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                <Download size={18} /> Download PDF
              </button>
              <button className="flex-1 bg-white border border-gray-200 text-brand-text p-3.5 rounded-xl font-black tracking-wide hover:border-brand-orange transition-all flex items-center justify-center gap-2">
                <Clock size={18} /> Save Plan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanner & Scanned Food Modals */}
      <AnimatePresence>
        {showScanner && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="relative w-full max-w-sm aspect-[3/4] border-2 border-brand-orange/50 rounded-3xl overflow-hidden shadow-2xl shadow-brand-orange/20 mx-4">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=800&fit=crop')] bg-cover opacity-40 mix-blend-luminosity" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
                <Scan size={64} className="text-brand-orange mb-6 animate-pulse" />
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Scanning Food...</h3>
                <p className="text-white/60 text-sm font-medium">Keep camera steady</p>
              </div>
              <motion.div className="absolute left-0 right-0 h-1 bg-brand-orange shadow-[0_0_20px_2px_#F97316] z-20"
                animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
            </div>
            <button onClick={() => setShowScanner(false)} className="mt-8 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"><X size={24} /></button>
          </motion.div>
        )}
        {scannedFood && (
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-2xl relative z-40 my-6">
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
              <button onClick={() => setScannedFood(null)} className="p-2 text-gray-400 hover:text-brand-text bg-gray-50 rounded-full transition-colors"><X size={20} /></button>
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
            <button onClick={() => setScannedFood(null)} className="w-full bg-brand-text hover:bg-gray-800 text-white p-4 rounded-xl font-black tracking-wide shadow-lg transition-all active:scale-[0.98]">Add to Diary</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-white w-full sm:max-w-lg sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl max-h-[80vh] flex flex-col">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center"><Bot size={20} className="text-white" /></div>
                  <div><h3 className="font-black text-brand-text text-sm">Nutrition AI</h3><p className="text-[11px] font-bold text-brand-muted">Ask anything about diet</p></div>
                </div>
                <button onClick={() => setShowChat(false)} className="p-2 hover:bg-gray-50 rounded-xl"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px]">
                {chatMessages.length === 0 && (
                  <div className="text-center py-10">
                    <Bot size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-brand-muted">Ask me about nutrition, diets, or meal planning!</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {["Can I eat rice during weight loss?", "Best protein source for vegetarians?", "High protein breakfast ideas?"].map((q, i) => (
                        <button key={i} onClick={() => { setChatInput(q); }} className="text-xs font-bold text-brand-orange bg-brand-orange/5 border border-brand-orange/20 px-3 py-1.5 rounded-full hover:bg-brand-orange/10 transition-colors">{q}</button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[80%] p-3.5 rounded-2xl text-sm font-medium", msg.role === "user" ? "bg-brand-text text-white rounded-br-md" : "bg-gray-50 text-brand-text border border-gray-100 rounded-bl-md")}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-md p-3.5">
                      <Loader2 size={16} className="animate-spin text-brand-orange" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3 shrink-0">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAskAI()} placeholder="Ask a nutrition question..." className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-orange" />
                <button onClick={handleAskAI} disabled={chatLoading || !chatInput.trim()} className="px-5 bg-brand-text text-white rounded-xl font-black hover:bg-gray-800 transition-all disabled:opacity-50"><Zap size={18} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food Database Section */}
      <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-brand-text mb-6">Food Database</h3>
        <div className="relative mb-8">
          <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input type="text" placeholder="Search 500,000+ foods..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-[1.5rem] text-sm font-bold text-brand-text placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all" />
        </div>
        {foodLoading && <div className="flex justify-center py-8"><Loader2 size={28} className="animate-spin text-brand-orange" /></div>}
        {!foodLoading && foodResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {foodResults.map((food, i) => (
              <div key={food.food_id || i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-brand-orange/30 transition-all group flex flex-col">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <Utensils size={32} className="text-gray-300 mx-auto mb-1" />
                    {food.brand_name && <p className="text-[10px] font-bold text-brand-muted">{food.brand_name}</p>}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4 className="font-black text-sm text-brand-text mb-2 leading-tight line-clamp-2">{food.food_name}</h4>
                  <div className="flex gap-2 mb-3 text-[10px] font-bold text-brand-muted">
                    {food.calories != null && <span className="bg-brand-orange/5 px-2 py-0.5 rounded">{food.calories} cal</span>}
                    {food.protein != null && <span className="bg-blue-50 px-2 py-0.5 rounded">P {food.protein}g</span>}
                    {food.carbs != null && <span className="bg-amber-50 px-2 py-0.5 rounded">C {food.carbs}g</span>}
                    {food.fat != null && <span className="bg-red-50 px-2 py-0.5 rounded">F {food.fat}g</span>}
                  </div>
                  <button onClick={() => handleLogFood(food)} className="w-full bg-gray-50 hover:bg-gradient-to-r hover:from-brand-orange hover:to-brand-red hover:text-white border border-gray-100 text-brand-text py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-md">
                    <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
                    Add To Today
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!foodLoading && searchQuery && foodResults.length === 0 && (
          <div className="text-center py-10 text-brand-muted font-bold">No foods found. Try a different search.</div>
        )}
        {!searchQuery && (
          <div className="text-center py-10 text-brand-muted font-medium">Search thousands of foods from our database</div>
        )}
      </section>
    </div>
  );
}
