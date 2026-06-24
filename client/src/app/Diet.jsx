import React, { useState, useEffect, useRef } from "react";
import { Search, Sparkles, Plus, ChevronRight, Activity, Zap, Flame, Target, Utensils, X, Loader2, Download, CheckCircle2, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchFoods, generateDietPlan, analyzeFood, addMeal, autoCorrectFoodQuery } from "../api/endpoints";
import ReactMarkdown from "react-markdown";

export default function Diet() {
  // Generator State
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorStep, setGeneratorStep] = useState(1);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("");
  const [formData, setFormData] = useState({
    age: "", gender: "Male", weight: "", height: "", targetWeight: "", goal: "Weight Loss", activityLevel: "Moderate", dietType: "Non Veg", allergies: "", budget: "", mealsPerDay: "3"
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Search & Tracking State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [bestMatch, setBestMatch] = useState(null);
  const [matchType, setMatchType] = useState(null);
  const [correctedQuery, setCorrectedQuery] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [quickInsight, setQuickInsight] = useState("");
  const [showInsight, setShowInsight] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Modal State
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodAnalysis, setFoodAnalysis] = useState(null);

  // User Goals & Daily Log State
  const [recentMeals, setRecentMeals] = useState([
    { id: 1, name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, type: "Lunch", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=300" }
  ]);
  const [nutritionGoals, setNutritionGoals] = useState({
    calories: { current: 1840, target: 2400 },
    protein: { current: 142, target: 180 },
    carbs: { current: 210, target: 300 },
    fat: { current: 55, target: 80 }
  });

  useEffect(() => {
    const saved = localStorage.getItem("recentDietSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem("recentDietSearches", JSON.stringify(updated));
  };

  const handleSearch = async (queryToSearch = searchQuery) => {
    if (!queryToSearch.trim()) return;
    setIsSearchFocused(false);
    setIsSearching(true);
    setQuickInsight("");
    setShowInsight(true);
    setSearchResults([]);
    setBestMatch(null);
    setCorrectedQuery(null);
    saveRecentSearch(queryToSearch);

    try {
      const { data } = await searchFoods(queryToSearch);
      if (data) {
        setBestMatch(data.bestMatch || null);
        setMatchType(data.matchType || null);
        setSearchResults(data.foods || []);
        if (data.insight) setQuickInsight(data.insight);
        if (data.correctedQuery) setCorrectedQuery(data.correctedQuery);
      }
    } catch (err) {
      console.error("Food search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const openFoodModal = async (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
    setFoodAnalysis(null);
    setIsAnalyzing(true);

    try {
      const { data } = await analyzeFood(food);
      if (data && data.analysis) {
        setFoodAnalysis(data.analysis);
      }
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddMeal = async (mealType) => {
    if (!selectedFood) return;

    // Optimistic UI update
    const newMeal = {
      id: Date.now(),
      name: selectedFood.name,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fat: selectedFood.fat,
      type: mealType,
      image: selectedFood.image
    };

    setRecentMeals(prev => [newMeal, ...prev]);
    setNutritionGoals(prev => ({
      calories: { ...prev.calories, current: prev.calories.current + (selectedFood.calories || 0) },
      protein: { ...prev.protein, current: prev.protein.current + (selectedFood.protein || 0) },
      carbs: { ...prev.carbs, current: prev.carbs.current + (selectedFood.carbs || 0) },
      fat: { ...prev.fat, current: prev.fat.current + (selectedFood.fat || 0) },
    }));

    setIsModalOpen(false);

    try {
      await addMeal({
        name: selectedFood.name,
        calories: selectedFood.calories,
        protein: selectedFood.protein,
        carbs: selectedFood.carbs,
        fat: selectedFood.fat,
        servingSize: selectedFood.servingSize
      });
    } catch (error) {
      console.error("Failed to save meal to backend", error);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationMessage("Analyzing dietary needs...");

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return prev;
        const jump = Math.floor(Math.random() * 15) + 5;
        const next = prev + jump;
        if (next > 30 && prev <= 30) setGenerationMessage("Calculating daily macros...");
        if (next > 60 && prev <= 60) setGenerationMessage("Selecting optimal ingredients...");
        if (next > 80 && prev <= 80) setGenerationMessage("Finalizing meal timeline...");
        return next > 90 ? 90 : next;
      });
    }, 400);

    try {
      const { data } = await generateDietPlan({
        age: Number(formData.age),
        gender: formData.gender,
        height: Number(formData.height),
        weight: Number(formData.weight),
        targetWeight: Number(formData.targetWeight) || Number(formData.weight),
        goal: formData.goal,
        activityLevel: formData.activityLevel,
        dietType: formData.dietType,
        allergies: formData.allergies,
        budget: formData.budget,
        mealsPerDay: Number(formData.mealsPerDay) || 3
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationMessage("Plan ready!");

      setTimeout(() => {
        setGeneratedPlan(data.plan.planData || data.plan.markdownPlan || data.plan);
        setIsGenerating(false);
      }, 600);
    } catch (err) {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="max-w-screen-xl mx-auto p-4 lg:p-8">
        <div className="mb-12">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Diet Tracker</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Search Bar */}
              <div className="relative z-20" ref={searchContainerRef}>
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                  className="flex items-center gap-4"
                >
                  <div className={`flex-1 flex items-center gap-3 bg-white border ${isSearchFocused ? 'border-accent-orange ring-4 ring-accent-orange/10' : 'border-slate-200'} rounded-2xl px-4 py-4 shadow-sm transition-all relative`}>
                    <Search className={`w-5 h-5 ${isSearchFocused ? 'text-accent-orange' : 'text-slate-400'}`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      placeholder="Search foods, meals, or scan barcode..."
                      className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-accent-orange transition-all shadow-lg shadow-slate-200 flex items-center justify-center"
                  >
                    {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                  </button>
                </form>

                {/* Smart Search Dropdown */}
                <AnimatePresence>
                  {isSearchFocused && (recentSearches.length > 0 || searchQuery) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-[4.5rem] mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {!searchQuery && recentSearches.map((term, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSearchQuery(term);
                              handleSearch(term);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-left transition-colors"
                          >
                            <History className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">{term}</span>
                          </button>
                        ))}
                        {searchQuery && (
                          <button
                            onClick={() => handleSearch(searchQuery)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-left transition-colors"
                          >
                            <Search className="w-4 h-4 text-accent-orange" />
                            <span className="text-sm font-medium text-slate-700">Search for "{searchQuery}"</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick AI Insight */}
              <AnimatePresence>
                {quickInsight && showInsight && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-accent-orange/10 to-transparent border border-accent-orange/20 rounded-2xl p-4 flex gap-4 items-start relative mb-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
                        <Sparkles className="w-5 h-5 text-accent-orange" />
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className="text-xs font-black text-accent-orange uppercase tracking-wider mb-1">AI Quick Insight</h4>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">{quickInsight}</p>
                      </div>
                      <button onClick={() => setShowInsight(false)} className="p-1 hover:bg-white rounded-lg text-slate-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search Results: Best Match + Related Foods */}
              {(bestMatch || searchResults.length > 0) ? (
                <section className="space-y-6">
                  {/* Corrected Query Notice */}
                  {correctedQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 flex items-center gap-3"
                    >
                      <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                      <p className="text-sm font-medium text-blue-700">
                        Showing results for "<strong>{correctedQuery}</strong>"
                      </p>
                    </motion.div>
                  )}

                  {/* Section 1: BEST MATCH */}
                  {bestMatch && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-orange">Best Match</span>
                        {matchType === 'exact' && (
                          <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-white bg-accent-orange px-2 py-1 rounded-md">Exact Match</span>
                        )}
                        {matchType === 'phrase' && (
                          <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-700 px-2 py-1 rounded-md">Dish Match</span>
                        )}
                        <div className="h-px flex-1 bg-gradient-to-r from-accent-orange/30 to-transparent" />
                      </div>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        onClick={() => openFoodModal(bestMatch)}
                        className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white cursor-pointer hover:shadow-2xl hover:shadow-slate-900/30 transition-all group overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Utensils className="w-4 h-4 text-accent-orange" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-orange/80">Best Match</span>
                              </div>
                              <h3 className="text-2xl md:text-3xl font-black tracking-tight">{bestMatch.name}</h3>
                              <p className="text-slate-400 font-medium text-sm mt-1">{bestMatch.brand || "Generic"} &bull; {bestMatch.serving || "100g"}</p>
                            </div>
                            {bestMatch.image && (
                              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 shrink-0 bg-white/5">
                                <img src={bestMatch.image} alt={bestMatch.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-3 mt-6">
                            <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                              <span className="text-2xl font-black text-white">{bestMatch.calories || 0}</span>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Kcal</p>
                            </div>
                            <div className="bg-accent-orange/20 rounded-2xl p-4 text-center backdrop-blur-sm">
                              <span className="text-2xl font-black text-accent-orange">{bestMatch.protein || 0}g</span>
                              <p className="text-[10px] text-accent-orange/70 font-bold uppercase tracking-wider mt-1">Protein</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                              <span className="text-2xl font-black text-white">{bestMatch.carbs || 0}g</span>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Carbs</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                              <span className="text-2xl font-black text-white">{bestMatch.fat || 0}g</span>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Fat</p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent-orange opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to view details <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Section 2: Related Foods (Branded) */}
                  {searchResults.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Related Foods</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                      </div>
                      <div className="space-y-3">
                        {searchResults.map((food, idx) => (
                          <motion.div
                            key={food.id || idx}
                            initial={{ x: -10, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            onClick={() => openFoodModal(food)}
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-50 shrink-0 bg-slate-100 flex items-center justify-center text-slate-400">
                                {food.image ? (
                                  <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Utensils className="w-5 h-5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 text-sm truncate">{food.name}</h4>
                                <p className="text-xs text-slate-400 font-medium truncate">
                                  {food.brand ? `${food.brand} • ` : ""}{food.servingSize || "100g"} &bull; {food.calories || 0} kcal
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 shrink-0 ml-2">
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col items-center">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase">Pro</span>
                                  <span className="text-xs font-black text-slate-800">{food.protein || 0}g</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase">Carb</span>
                                  <span className="text-xs font-black text-slate-800">{food.carbs || 0}g</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase">Fat</span>
                                  <span className="text-xs font-black text-slate-800">{food.fat || 0}g</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              ) : isSearching && !bestMatch && searchResults.length === 0 ? (
                <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
              ) : searchQuery && !isSearching && !bestMatch && searchResults.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
                  <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No nutrition data found.</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">We couldn't find exact matches in our primary database.</p>
                  <button onClick={() => handleSearch(searchQuery)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 text-sm flex items-center gap-2 mx-auto">
                    <Sparkles className="w-4 h-4" /> Search the web with AI
                  </button>
                </div>
              ) : (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Recent Meals</h2>
                    <button className="text-accent-orange font-bold text-sm">Clear All</button>
                  </div>
                  <div className="space-y-4">
                    {recentMeals.map((food, idx) => (
                      <motion.div
                        key={food.id || idx}
                        initial={{ x: -10, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-50 shrink-0 bg-slate-100 flex items-center justify-center text-slate-400">
                            {food.image ? (
                              <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                            ) : (
                              <Utensils className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 line-clamp-1">{food.name}</h4>
                            <p className="text-xs text-slate-400 font-medium">
                              {food.type ? `${food.type} • ` : ''}{food.servingSize || "100g"} &bull; {food.calories || 0} kcal
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                          <div className="hidden sm:flex items-center gap-6">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Pro</span>
                              <span className="text-sm font-black text-slate-800">{food.protein || 0}g</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Carb</span>
                              <span className="text-sm font-black text-slate-800">{food.carbs || 0}g</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Fat</span>
                              <span className="text-sm font-black text-slate-800">{food.fat || 0}g</span>
                            </div>
                          </div>
                          <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* AI Generator Banner */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowGenerator(true)}
                className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50 border border-slate-200 overflow-hidden group cursor-pointer shadow-sm shadow-slate-100 mt-12"
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

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 text-slate-900">Nutrition Goals</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calories</span>
                      <span className="text-sm font-black text-slate-900">{nutritionGoals.calories.current} / {nutritionGoals.calories.target} kcal</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent-orange rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (nutritionGoals.calories.current / nutritionGoals.calories.target) * 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Protein</span>
                      <span className="text-sm font-black text-slate-900">{nutritionGoals.protein.current}g</span>
                      <div className="h-1 w-full bg-accent-red/20 mt-2 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-accent-red rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (nutritionGoals.protein.current / nutritionGoals.protein.target) * 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Carbs</span>
                      <span className="text-sm font-black text-slate-900">{nutritionGoals.carbs.current}g</span>
                      <div className="h-1 w-full bg-accent-green/20 mt-2 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-accent-green rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (nutritionGoals.carbs.current / nutritionGoals.carbs.target) * 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Fat</span>
                      <span className="text-sm font-black text-slate-900">{nutritionGoals.fat.current}g</span>
                      <div className="h-1 w-full bg-accent-orange/20 mt-2 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-accent-orange rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (nutritionGoals.fat.current / nutritionGoals.fat.target) * 100)}%` }} />
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
      </div>

      {/* NUTRITION MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 lg:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row relative"
            >
              {/* Left Column: Image & Macros */}
              <div className="w-full md:w-2/5 bg-slate-50 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-100">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 bg-slate-200 flex items-center justify-center">
                  {selectedFood.image ? (
                    <img src={selectedFood.image} alt={selectedFood.name} className="w-full h-full object-cover" />
                  ) : (
                    <Utensils className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <h2 className="text-2xl font-black text-slate-900 text-center mb-1">{selectedFood.name}</h2>
                <p className="text-sm font-bold text-slate-400 mb-6">{selectedFood.brand || 'Generic'} • {selectedFood.servingSize || "100g"}</p>

                <div className="w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Calories</span>
                    <span className="text-xl font-black text-slate-900">{selectedFood.calories || 0}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase">Protein</span>
                    <span className="text-sm font-black text-accent-orange">{selectedFood.protein || 0}g</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase">Carbs</span>
                    <span className="text-sm font-black text-accent-green">{selectedFood.carbs || 0}g</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase">Fat</span>
                    <span className="text-sm font-black text-slate-900">{selectedFood.fat || 0}g</span>
                  </div>
                  {(selectedFood.fiber || selectedFood.sugar || selectedFood.sodium) && (
                    <div className="pt-3 border-t border-slate-50 space-y-2 mt-2">
                      {selectedFood.fiber > 0 && (
                        <div className="flex justify-between text-xs font-medium text-slate-500">
                          <span>Fiber</span><span>{selectedFood.fiber}g</span>
                        </div>
                      )}
                      {selectedFood.sugar > 0 && (
                        <div className="flex justify-between text-xs font-medium text-slate-500">
                          <span>Sugar</span><span>{selectedFood.sugar}g</span>
                        </div>
                      )}
                      {selectedFood.sodium > 0 && (
                        <div className="flex justify-between text-xs font-medium text-slate-500">
                          <span>Sodium</span><span>{selectedFood.sodium}mg</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: AI Analysis & Actions */}
              <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 bg-accent-orange/10 rounded-lg text-accent-orange">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-accent-orange">AI Analysis</span>
                </div>

                {isAnalyzing ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-accent-orange mb-4" />
                    <p className="font-bold text-slate-900">Analyzing nutrition profile...</p>
                    <p className="text-xs text-slate-400 mt-2">Generating benefits and fitness recommendations.</p>
                  </div>
                ) : foodAnalysis ? (
                  <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-slate-700 font-medium leading-relaxed">{foodAnalysis.summary}</p>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Key Benefits</h4>
                      <ul className="space-y-2">
                        {foodAnalysis.benefits?.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Best For</h4>
                      <div className="flex flex-wrap gap-2">
                        {foodAnalysis.bestFor?.map((b, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-slate-400 text-sm">Analysis failed to load.</p>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider text-center md:text-left">Add To Meal</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {["Breakfast", "Lunch", "Dinner", "Snack"].map(type => (
                      <button
                        key={type}
                        onClick={() => handleAddMeal(type)}
                        disabled={isAnalyzing}
                        className="py-3 px-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-accent-orange transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI PLAN GENERATOR (Existing) */}
      <AnimatePresence>
        {showGenerator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative my-8"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center text-accent-orange">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">AI Diet Generator</h2>
                </div>
                <button
                  onClick={() => setShowGenerator(false)}
                  className="p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                {generatedPlan ? (
                  typeof generatedPlan === "string" ? (
                    <div className="prose prose-slate max-w-none">
                      <ReactMarkdown>{generatedPlan}</ReactMarkdown>
                      <button
                        onClick={() => setGeneratedPlan(null)}
                        className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
                      >
                        Generate New Plan
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                      {/* Header Section */}
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Your Personalized Plan</h3>
                        <p className="text-slate-500 font-medium">{generatedPlan.explanation}</p>
                      </div>

                      {/* Stat Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
                          <Activity className="w-6 h-6 text-accent-red mb-2" />
                          <span className="text-2xl font-black text-slate-900">{generatedPlan.meals?.reduce((acc, m) => acc + (m.calories || 0), 0) || 0}</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calories</span>
                        </div>
                        <div className="bg-accent-orange/5 rounded-2xl p-4 border border-accent-orange/10 flex flex-col items-center justify-center text-center">
                          <Target className="w-6 h-6 text-accent-orange mb-2" />
                          <span className="text-2xl font-black text-accent-orange">{generatedPlan.meals?.reduce((acc, m) => acc + (m.protein || 0), 0) || 0}g</span>
                          <span className="text-xs font-bold text-accent-orange uppercase tracking-widest">Protein</span>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
                          <Zap className="w-6 h-6 text-yellow-500 mb-2" />
                          <span className="text-2xl font-black text-slate-900">{generatedPlan.meals?.reduce((acc, m) => acc + (m.carbs || 0), 0) || 0}g</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carbs</span>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
                          <Flame className="w-6 h-6 text-orange-500 mb-2" />
                          <span className="text-2xl font-black text-slate-900">{generatedPlan.meals?.reduce((acc, m) => acc + (m.fat || 0), 0) || 0}g</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fat</span>
                        </div>
                      </div>

                      {/* Meal Timeline */}
                      <div>
                        <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                          <Utensils className="w-5 h-5 text-accent-orange" />
                          Meal Timeline
                        </h4>
                        <div className="space-y-4">
                          {generatedPlan.meals?.map((meal, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-200/50 flex flex-col md:flex-row gap-4 md:items-center">
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl shrink-0 border border-slate-100">
                                {meal.icon || "🍽️"}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-black text-slate-900 text-lg">{meal.name}</h5>
                                <ul className="mt-2 space-y-1">
                                  {meal.ingredients?.map((ing, i) => (
                                    <li key={i} className="text-slate-600 font-medium text-sm flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-accent-orange mt-1.5 shrink-0" />
                                      {ing}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex flex-row md:flex-col gap-4 md:gap-1 items-center md:items-end bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl shrink-0">
                                <span className="font-black text-accent-orange">{meal.protein}g <span className="text-xs text-slate-400 font-bold uppercase">Protein</span></span>
                                <span className="font-black text-slate-900">{meal.calories} <span className="text-xs text-slate-400 font-bold uppercase">Kcal</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shopping & Hydration */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                          <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-orange/20 rounded-full blur-2xl" />
                          <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent-orange" />
                            Shopping List
                          </h4>
                          <ul className="space-y-2 relative z-10">
                            {generatedPlan.shoppingList?.map((item, idx) => (
                              <li key={idx} className="text-slate-300 font-medium text-sm flex items-center gap-2">
                                <div className="w-4 h-4 rounded border border-slate-600 flex items-center justify-center shrink-0">
                                  <div className="w-2 h-2 rounded-sm bg-accent-orange opacity-0" />
                                </div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col justify-center items-center text-center">
                          <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
                            💧
                          </div>
                          <h4 className="text-lg font-black text-slate-900 mb-1">Hydration Goal</h4>
                          <p className="text-blue-600 font-bold">{generatedPlan.hydration || "3.5 Litres / Day"}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => window.print()}
                          className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                        >
                          <Download className="w-4 h-4" /> Save PDF
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([generatedPlan.markdownExport || ""], { type: "text/markdown" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "FitCircle-Diet-Plan.md";
                            a.click();
                          }}
                          className="flex-1 px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                        >
                          <Download className="w-4 h-4" /> Download Markdown
                        </button>
                        <button
                          onClick={() => setGeneratedPlan(null)}
                          className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                        >
                          Close
                        </button>
                      </div>

                    </div>
                  )
                ) : (
                  <form onSubmit={handleGeneratePlan} className="space-y-6">
                    {generatorStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg text-slate-900">Step 1: What's your goal?</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {["Weight Loss", "Muscle Gain", "Maintenance", "Fat Loss"].map(g => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setFormData({ ...formData, goal: g })}
                              className={`p-4 rounded-xl border text-left font-bold transition-all ${formData.goal === g ? "border-accent-orange bg-accent-orange/5 text-accent-orange" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-end pt-4">
                          <button type="button" onClick={() => setGeneratorStep(2)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Continue</button>
                        </div>
                      </div>
                    )}

                    {generatorStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg text-slate-900">Step 2: Physical Attributes</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Age</label>
                            <input type="number" placeholder="e.g. 25" required value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-accent-orange outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Gender</label>
                            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-accent-orange outline-none">
                              <option>Male</option>
                              <option>Female</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Height (cm)</label>
                            <input type="number" placeholder="e.g. 175" required value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-accent-orange outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Weight (kg)</label>
                            <input type="number" placeholder="e.g. 70" required value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-accent-orange outline-none" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Weight (kg)</label>
                            <input type="number" value={formData.targetWeight} onChange={e => setFormData({ ...formData, targetWeight: e.target.value })} placeholder="e.g. 65 (Optional)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-accent-orange outline-none" />
                          </div>
                        </div>
                        <div className="flex justify-between pt-4">
                          <button type="button" onClick={() => setGeneratorStep(1)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900">Back</button>
                          <button type="button" onClick={() => setGeneratorStep(3)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Continue</button>
                        </div>
                      </div>
                    )}

                    {generatorStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg text-slate-900">Step 3: Activity Level</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {["Sedentary", "Light", "Moderate", "Active"].map(a => (
                            <button
                              key={a}
                              type="button"
                              onClick={() => setFormData({ ...formData, activityLevel: a })}
                              className={`p-4 rounded-xl border text-left font-bold transition-all ${formData.activityLevel === a ? "border-accent-orange bg-accent-orange/5 text-accent-orange" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between pt-4">
                          <button type="button" onClick={() => setGeneratorStep(2)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900">Back</button>
                          <button type="button" onClick={() => setGeneratorStep(4)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Continue</button>
                        </div>
                      </div>
                    )}

                    {generatorStep === 4 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg text-slate-900">Step 4: Diet Preference</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {["Vegetarian", "Non Vegetarian", "Vegan"].map(d => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setFormData({ ...formData, dietType: d })}
                              className={`p-4 rounded-xl border text-left font-bold transition-all ${formData.dietType === d ? "border-accent-orange bg-accent-orange/5 text-accent-orange" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between pt-4">
                          <button type="button" onClick={() => setGeneratorStep(3)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900">Back</button>
                          <button type="button" onClick={() => setGeneratorStep(5)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Continue</button>
                        </div>
                      </div>
                    )}

                    {generatorStep === 5 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg text-slate-900">Step 5: Additional Info</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Allergies</label>
                            <input type="text" placeholder="e.g. Nuts, Dairy" value={formData.allergies} onChange={e => setFormData({ ...formData, allergies: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-accent-orange outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Budget</label>
                            <input type="text" placeholder="e.g. Low, Medium, High" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-accent-orange outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Meals Per Day</label>
                            <select value={formData.mealsPerDay} onChange={e => setFormData({ ...formData, mealsPerDay: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-accent-orange outline-none">
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-between pt-4">
                          <button type="button" onClick={() => setGeneratorStep(4)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900">Back</button>
                          <button type="submit" disabled={isGenerating} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-sm shadow-xl shadow-slate-900/20 flex items-center justify-center hover:bg-slate-800 disabled:opacity-50">
                            Generate Plan
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Progress Overlay */}
                    {isGenerating && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center rounded-[2rem]">
                        <Loader2 className="w-12 h-12 text-accent-orange animate-spin mb-6" />
                        <h3 className="text-xl font-black text-slate-900 mb-2">{generationMessage}</h3>
                        <div className="w-full max-w-xs bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                          <motion.div
                            className="bg-accent-orange h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${generationProgress}%` }}
                            transition={{ ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-sm font-bold text-slate-400">{generationProgress}%</p>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
