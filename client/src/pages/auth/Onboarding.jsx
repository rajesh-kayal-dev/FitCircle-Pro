import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Check,
  Loader2,
  Dumbbell,
  Apple,
  Target,
  Zap,
  Home,
  Activity,
  User,
  Flame,
  Trophy,
  Sprout,
  TrendingUp,
  Award,
  Calendar,
  Leaf,
  Utensils,
  UserCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "../../app/components/Logo";
import { useAuth } from "../../context/AuthContext";

/* ─── Step config ───────────────────────────────────────────── */
const STEPS = [
  { id: "basic", title: "Let's get to know you", subtitle: "Tell us a bit about yourself" },
  {
    id: "goal",
    title: "What's your goal?",
    subtitle: "Pick what matters most right now",
    field: "goal",
    options: [
      { label: "Lose Weight", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
      { label: "Gain Muscle", icon: Dumbbell, color: "text-blue-500", bg: "bg-blue-50" },
      { label: "Stay Fit", icon: Activity, color: "text-red-500", bg: "bg-red-50" },
      { label: "Improve Strength", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
      { label: "Home Workout", icon: Home, color: "text-indigo-500", bg: "bg-indigo-50" },
      { label: "Athletic Training", icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
    ],
  },
  {
    id: "level",
    title: "Your fitness level?",
    subtitle: "Be honest — we'll match your plan",
    field: "level",
    options: [
      { label: "Beginner", desc: "Just starting out", icon: Sprout, color: "text-green-500", bg: "bg-green-50" },
      { label: "Intermediate", desc: "Working out sometimes", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
      { label: "Advanced", desc: "Regular training", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
    ],
  },
  {
    id: "days",
    title: "How many days can you train?",
    subtitle: "Choose a realistic schedule",
    field: "workoutDays",
    options: [
      { label: "2–3 days/week", desc: "Light commitment", icon: Calendar, color: "text-rose-500", bg: "bg-rose-50" },
      { label: "3–5 days/week", desc: "Moderate", icon: Calendar, color: "text-orange-500", bg: "bg-orange-50" },
      { label: "5–6 days/week", desc: "High intensity", icon: Activity, color: "text-red-600", bg: "bg-red-50" },
    ],
  },
  {
    id: "type",
    title: "Preferred workout type?",
    subtitle: "Where will you train?",
    field: "workoutType",
    options: [
      { label: "Gym", icon: Dumbbell, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Home", icon: Home, color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "Both", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    ],
  },
  {
    id: "diet",
    title: "Your diet preference",
    subtitle: "We'll personalize your meal plan",
    field: "dietType",
    options: [
      { label: "Vegetarian", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-50" },
      { label: "Non-Vegetarian", icon: Utensils, color: "text-rose-500", bg: "bg-rose-50" },
      { label: "Eggetarian", icon: Utensils, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Vegan", icon: Sprout, color: "text-green-600", bg: "bg-green-50" },
    ],
  },
  { id: "body", title: "Body details", subtitle: "Optional — helps personalize your plan" },
  { id: "finish", title: "You're all set!", subtitle: "Let's build your personalized plan" },
];

const TOTAL = STEPS.length;

/* ─── Slide animation ───────────────────────────────────────── */
const slide = {
  enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d < 0 ? "100%" : "-100%", opacity: 0 }),
};
const trans = { duration: 0.32, ease: [0.4, 0, 0.2, 1] };

/* ─── Option Card ───────────────────────────────────────────── */
function OptionCard({ icon: Icon, color, bg, label, desc, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-3.5 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-[0.98]",
        selected
          ? "border-[#F97316] bg-orange-50/30"
          : "border-gray-200 bg-white hover:border-gray-300",
      ].join(" ")}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm ${selected ? "text-[#F97316]" : "text-gray-800"}`}>
          {label}
        </p>
        {desc && <p className="text-[11px] text-gray-400 font-medium mt-0.5">{desc}</p>}
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-[#F97316] flex items-center justify-center shrink-0">
          <Check size={11} className="text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

/* ─── Loading Overlay ───────────────────────────────────────── */
function LoadingOverlay() {
  const messages = [
    "Analyzing your fitness goals...",
    "Building your workout plan...",
    "Personalizing your diet...",
    "Almost ready...",
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setMsgIndex((i) => Math.min(i + 1, messages.length - 1)),
      900
    );
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-8 px-8"
    >
      {/* Pulsing logo */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Logo size="lg" />
      </motion.div>

      {/* Spinner ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#F97316]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-center text-gray-600 font-medium text-sm max-w-xs"
        >
          {messages[msgIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Onboarding Component ─────────────────────────────── */
export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    name: "",
    age: "",
    gender: "",
    goal: "",
    level: "",
    workoutDays: "",
    workoutType: "",
    dietType: "",
    height: "",
    weight: "",
  });
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const step = STEPS[currentStep];

  const goNext = () => {
    if (currentStep < TOTAL - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const handleSelectOption = (field, value) => {
    setField(field, value);
    // Auto-advance after short delay
    setTimeout(goNext, 350);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await completeOnboarding(data);
      await new Promise((r) => setTimeout(r, 3200)); // show loading animation
      toast.success("Your plan is ready! Let's go 💪");
      navigate("/home", { replace: true });
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  /* ── Basic info validation ── */
  const basicValid = data.name.trim().length >= 2;

  /* ── Body details validation (optional) ── */
  const canFinish = true;

  if (saving) return <LoadingOverlay />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-orange-100/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-16 w-64 h-64 rounded-full bg-orange-50/60 blur-3xl" />

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full px-5 py-8 relative z-10">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-6">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all -ml-2"
            >
              <ChevronLeft size={22} />
            </button>
          ) : (
            <div className="w-9" />
          )}

          <span className="text-xs font-semibold text-gray-400">
            {currentStep + 1} / {TOTAL}
          </span>

          {step.id !== "finish" && step.id !== "basic" && step.id !== "body" && (
            <button
              type="button"
              onClick={goNext}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip
            </button>
          )}
          {(step.id === "finish" || step.id === "basic" || step.id === "body") && (
            <div className="w-8" />
          )}
        </div>

        {/* ── Progress bar ── */}
        <div className="h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-[#F97316] rounded-full"
            animate={{ width: `${((currentStep + 1) / TOTAL) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* ── Step content ── */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step.id}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={trans}
              className="flex flex-col gap-6"
            >
              {/* Title */}
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">
                  {step.title}
                </h2>
                <p className="text-sm text-gray-500">{step.subtitle}</p>
              </div>

              {/* ── SCREEN 1: Basic info ── */}
              {step.id === "basic" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 ml-1">Your name</label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="e.g. Arjun Sharma"
                      autoFocus
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-[#F97316] transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 ml-1">Age</label>
                    <input
                      type="number"
                      value={data.age}
                      onChange={(e) => setField("age", e.target.value)}
                      placeholder="e.g. 24"
                      min={13}
                      max={80}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-[#F97316] transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 ml-1">Gender</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { value: "male", label: "Male", icon: User, color: "text-blue-500", bg: "bg-blue-50" },
                        { value: "female", label: "Female", icon: UserCircle, color: "text-pink-500", bg: "bg-pink-50" },
                        { value: "other", label: "Prefer not", icon: User, color: "text-gray-500", bg: "bg-gray-50" },
                      ].map((g) => (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => setField("gender", g.value)}
                          className={[
                            "flex flex-col items-center gap-2 py-3.5 rounded-2xl border-2 transition-all active:scale-[0.97]",
                            data.gender === g.value
                              ? "border-[#F97316] bg-orange-50/40 shadow-sm"
                              : "border-gray-100 bg-white hover:border-gray-200",
                          ].join(" ")}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${g.bg} ${g.color}`}>
                            <g.icon size={20} strokeWidth={2.5} />
                          </div>
                          <span
                            className={`text-[11px] font-bold ${data.gender === g.value ? "text-[#F97316]" : "text-gray-600"
                              }`}
                          >
                            {g.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!basicValid}
                    className="w-full h-12 bg-[#F97316] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:bg-orange-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    Next <ChevronLeft size={18} className="rotate-180" />
                  </button>
                </div>
              )}

              {/* ── SCREENS 2-6: Selection ── */}
              {step.field && step.options && (
                <div className="space-y-2.5">
                  {step.options.map((opt) => (
                    <OptionCard
                      key={opt.label}
                      icon={opt.icon}
                      color={opt.color}
                      bg={opt.bg}
                      label={opt.label}
                      desc={opt.desc}
                      selected={data[step.field] === opt.label}
                      onClick={() => handleSelectOption(step.field, opt.label)}
                    />
                  ))}
                </div>
              )}

              {/* ── SCREEN 7: Body details ── */}
              {step.id === "body" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 ml-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={data.height}
                      onChange={(e) => setField("height", e.target.value)}
                      placeholder="e.g. 175"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-[#F97316] transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 ml-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={data.weight}
                      onChange={(e) => setField("weight", e.target.value)}
                      placeholder="e.g. 72"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-[#F97316] transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={goNext}
                      className="flex-1 h-12 bg-gray-100 text-gray-600 font-semibold rounded-2xl hover:bg-gray-200 active:scale-[0.98] transition-all text-sm"
                    >
                      Skip for now
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="flex-1 h-12 bg-[#F97316] text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-500 active:scale-[0.98] transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* ── SCREEN 8: Finish ── */}
              {step.id === "finish" && (
                <div className="flex flex-col items-center gap-6 text-center py-4">
                  {/* Summary cards */}
                  <div className="w-full grid grid-cols-2 gap-2.5">
                    {[
                      { icon: Target, label: "Goal", value: data.goal || "—", color: "text-orange-500", bg: "bg-orange-50" },
                      { icon: Zap, label: "Level", value: data.level || "—", color: "text-purple-500", bg: "bg-purple-50" },
                      { icon: Dumbbell, label: "Training", value: data.workoutType || "—", color: "text-blue-500", bg: "bg-blue-50" },
                      { icon: Apple, label: "Diet", value: data.dietType || "—", color: "text-green-500", bg: "bg-green-50" },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                      <div
                        key={label}
                        className={`${bg} rounded-2xl p-3.5 text-left border border-white/80`}
                      >
                        <Icon size={16} className={`${color} mb-1.5`} />
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          {label}
                        </p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5 truncate">{value}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    We'll use this to build your personalized fitness plan, workout recommendations,
                    and diet guide.
                  </p>

                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={saving}
                    className="w-full h-13 bg-[#F97316] text-white font-bold rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-500 active:scale-[0.98] transition-all text-base flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{ height: "52px" }}
                  >
                    {saving ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      "Create My Plan 🚀"
                    )}
                  </button>

                  {data.name && (
                    <p className="text-xs text-gray-400">
                      Ready to go, <span className="font-semibold text-gray-700">{data.name}</span>!
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
