import { Dumbbell, Flame, Wind, Heart, Activity, Zap, Clock, Play, TrendingUp, Filter, Headphones, ArrowRight, X, ChevronRight, Loader2, Download } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../app/components/ui";
import { toast } from "sonner";

const workoutCategories = [
  { id: "all", label: "All", icon: Activity, color: "from-gray-500 to-gray-700" },
  { id: "hiit", label: "HIIT", icon: Flame, color: "from-brand-orange to-brand-red" },
  { id: "strength", label: "Strength", icon: Dumbbell, color: "from-brand-text to-gray-700" },
  { id: "yoga", label: "Yoga", icon: Wind, color: "from-brand-green to-emerald-600" },
  { id: "cardio", label: "Cardio", icon: Heart, color: "from-blue-500 to-cyan-600" },
];

const workoutGoals = [
  { id: "muscle_gain", label: "Muscle Gain", desc: "Build size and strength", icon: Zap, color: "from-brand-orange to-brand-red" },
  { id: "weight_loss", label: "Weight Loss", desc: "Burn fat and tone up", icon: TrendingUp, color: "from-brand-red to-pink-500" },
  { id: "strength", label: "Strength", desc: "Increase pure power", icon: Dumbbell, color: "from-brand-text to-gray-700" },
  { id: "endurance", label: "Endurance", desc: "Improve stamina", icon: Heart, color: "from-blue-500 to-cyan-600" },
];

const experienceLevels = [
  { id: "beginner", label: "Beginner", desc: "New to training" },
  { id: "intermediate", label: "Intermediate", desc: "1-2 years experience" },
  { id: "advanced", label: "Advanced", desc: "3+ years experience" },
];

import { Link } from "react-router";
import { getExercises, generateWorkoutPlan } from "../api/endpoints";

export default function Workouts() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAssessment, setShowAssessment] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: "muscle_gain", age: "", height: "", weight: "",
    location: "gym", daysPerWeek: 4, level: "intermediate"
  });
  const [planLoading, setPlanLoading] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [showPlan, setShowPlan] = useState(false);

  const updateForm = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    try {
      const { data } = await generateWorkoutPlan({
        goal: formData.goal,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        location: formData.location,
        daysPerWeek: Number(formData.daysPerWeek),
        level: formData.level
      });
      setPlanData(data.plan);
      setShowPlan(true);
      setShowAssessment(false);
      setStep(1);
      toast.success("AI Workout Plan generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate plan");
    } finally {
      setPlanLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-brand-text">What's your primary goal?</h3>
            <div className="grid grid-cols-2 gap-3">
              {workoutGoals.map(g => (
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
              <div><label className="text-xs font-bold text-brand-muted block mb-1.5">Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={e => updateForm("weight", e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" /></div>
              <div className="col-span-2"><label className="text-xs font-bold text-brand-muted block mb-1.5">Height (cm)</label>
                <input type="number" value={formData.height} onChange={e => updateForm("height", e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" /></div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-brand-text">Where do you workout?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "gym", label: "Gym", icon: "🏢" },
                { id: "home", label: "Home", icon: "🏠" }
              ].map(loc => (
                <button key={loc.id} onClick={() => updateForm("location", loc.id)}
                  className={cn("p-4 rounded-2xl border text-center transition-all", formData.location === loc.id ? "border-brand-orange bg-brand-orange/5 shadow-md" : "border-gray-100 bg-gray-50 hover:border-brand-orange/30")}>
                  <div className="text-3xl mb-2">{loc.icon}</div>
                  <h4 className="font-black text-sm text-brand-text">{loc.label}</h4>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-brand-text">Days per week</h3>
            <div className="grid grid-cols-4 gap-3">
              {[3, 4, 5, 6].map(days => (
                <button key={days} onClick={() => updateForm("daysPerWeek", days)}
                  className={cn("p-4 rounded-2xl border text-center transition-all", formData.daysPerWeek === days ? "border-brand-orange bg-brand-orange/5 shadow-md" : "border-gray-100 bg-gray-50 hover:border-brand-orange/30")}>
                  <h4 className="font-black text-xl text-brand-text">{days}</h4>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-brand-text">Experience Level</h3>
            <div className="space-y-3">
              {experienceLevels.map(lvl => (
                <button key={lvl.id} onClick={() => updateForm("level", lvl.id)}
                  className={cn("w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4", formData.level === lvl.id ? "border-brand-orange bg-brand-orange/5 shadow-md" : "border-gray-100 bg-gray-50 hover:border-brand-orange/30")}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg", formData.level === lvl.id ? "bg-brand-orange text-white" : "bg-gray-200 text-gray-500")}>
                    {lvl.id === "beginner" ? "🌱" : lvl.id === "intermediate" ? "⚡" : "🔥"}
                  </div>
                  <div><h4 className="font-black text-sm text-brand-text capitalize">{lvl.label}</h4><p className="text-[11px] font-medium text-brand-muted">{lvl.desc}</p></div>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  React.useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        // map UI categories to ExerciseDB body parts or targets
        let queryParams = {};
        if (activeCategory !== "all") {
          queryParams.bodyPart = activeCategory;
        }
        queryParams.limit = 20; // limit to 20 for UI responsiveness
        
        const { data } = await getExercises(queryParams);
        setExercises(data.exercises || []);
      } catch (err) {
        console.error("Failed to fetch exercises", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [activeCategory]);

  const filteredWorkouts = exercises;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Vibes Music Banner ── */}
      <div className="flex flex-col md:flex-row gap-4 px-4 md:px-0">
        <Link to="/vibes" className="flex-1 block">
          <div className="relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-purple to-indigo-600 p-6 flex flex-col justify-center items-start shadow-xl shadow-brand-purple/20 group transition-transform hover:scale-[1.01] active:scale-[0.98]">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=3269&auto=format&fit=crop')] mix-blend-overlay opacity-30 object-cover object-center pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Headphones size={20} className="text-white" />
              </div>
              <span className="text-white/90 font-black tracking-widest uppercase text-xs">Vibe Zone</span>
            </div>

            <h2 className="relative z-10 text-xl font-black text-white tracking-tight mt-1">
              Train with Music
            </h2>
            <div className="relative z-10 mt-4 flex items-center gap-2 text-white font-black text-sm group-hover:gap-3 transition-all">
              Explore Vibes <ArrowRight size={16} />
            </div>
          </div>
        </Link>
        <button onClick={() => { setShowAssessment(true); setStep(1); }} className="flex-1 block">
          <div className="relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-orange to-brand-red p-6 flex flex-col justify-center items-start shadow-xl shadow-brand-orange/20 group transition-transform hover:scale-[1.01] active:scale-[0.98]">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-white/90 font-black tracking-widest uppercase text-xs">AI Coach</span>
            </div>

            <h2 className="relative z-10 text-xl font-black text-white tracking-tight mt-1">
              Generate AI Plan
            </h2>
            <div className="relative z-10 mt-4 flex items-center gap-2 text-white font-black text-sm group-hover:gap-3 transition-all">
              Create Plan <ArrowRight size={16} />
            </div>
          </div>
        </button>
      </div>

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
        {loading ? (
          <div className="col-span-full py-10 flex justify-center items-center">
            <span className="text-brand-muted font-bold animate-pulse">Loading exercises...</span>
          </div>
        ) : (
          filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                <img
                  src={workout.gifUrl || workout.image}
                  alt={workout.name || workout.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-xs font-black text-white tracking-wider shadow-sm border border-white/20">
                    {(workout.target || workout.category || "").toUpperCase()}
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
                  <h3 className="text-xl font-black text-brand-text mb-3 leading-tight tracking-tight group-hover:text-brand-orange transition-colors capitalize">
                    {workout.name || workout.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-brand-muted bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Dumbbell size={16} className="text-brand-text" />
                      <span className="text-sm font-bold capitalize">{workout.equipment || "Bodyweight"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                    {workout.bodyPart || workout.level}
                  </span>
                  <span className="text-sm font-black text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                    Start Training →
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {!loading && filteredWorkouts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mx-4 md:mx-0">
          <div className="text-brand-text font-black text-xl tracking-tight mb-2">No Workouts Found</div>
          <p className="text-brand-muted font-medium">Try selecting a different category or clearing filters</p>
        </div>
      )}

      {/* AI Assessment Modal */}
      <AnimatePresence>
        {showAssessment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b border-gray-100 flex items-center justify-between rounded-t-[2rem]">
                <div className="flex items-center gap-3">
                  {step > 1 && <button onClick={() => setStep(s => s - 1)} className="p-2 hover:bg-gray-50 rounded-xl"><ArrowRight size={20} className="rotate-180" /></button>}
                  <div>
                    <h3 className="font-black text-brand-text">Workout AI</h3>
                    <p className="text-xs font-bold text-brand-muted">Step {step} of 5</p>
                  </div>
                </div>
                <button onClick={() => setShowAssessment(false)} className="p-2 hover:bg-gray-50 rounded-xl"><X size={20} /></button>
              </div>
              <div className="p-6">{renderStep()}</div>
              <div className="p-6 pt-0 flex gap-3">
                {step < 5 ? (
                  <button onClick={() => setStep(s => Math.min(s + 1, 5))} className="flex-1 bg-brand-text text-white p-3.5 rounded-xl font-black tracking-wide hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    Continue <ChevronRight size={18} />
                  </button>
                ) : (
                  <button onClick={handleGeneratePlan} disabled={planLoading} className="flex-1 bg-gradient-to-r from-brand-orange to-brand-red text-white p-3.5 rounded-xl font-black tracking-wide hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    {planLoading ? <Loader2 size={18} className="animate-spin" /> : <><Zap size={18} /> Generate Plan</>}
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm mx-4 md:mx-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-brand-text tracking-tight">Your Custom Workout Plan</h3>
                <p className="text-sm font-bold text-brand-muted mt-1 capitalize">
                  {planData.daysPerWeek} Days/Week · {planData.location} · {planData.level}
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
              <button onClick={() => { setShowPlan(false); toast.success("Plan saved to history!"); }} className="flex-1 bg-white border border-gray-200 text-brand-text p-3.5 rounded-xl font-black tracking-wide hover:border-brand-orange transition-all flex items-center justify-center gap-2">
                <Clock size={18} /> Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
