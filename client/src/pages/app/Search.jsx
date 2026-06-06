import React, { useState, useRef } from "react";
import { Search as SearchIcon, Camera, X, Loader2, Sparkles, TrendingUp, Users, Dumbbell, UtensilsCrossed, ChevronRight, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, Button, Input, Avatar } from "../../components/ui";
import { FoodCard } from "../../components/shared/FoodCard";
import { WorkoutCard } from "../../components/shared/WorkoutCard";
import { toast } from "sonner";

const SEARCH_CATEGORIES = [
  { id: "all", label: "All", icon: SearchIcon },
  { id: "exercises", label: "Exercises", icon: Dumbbell },
  { id: "trainers", label: "Trainers", icon: Users },
  { id: "food", label: "Food", icon: UtensilsCrossed },
];

const TRENDING_SEARCHES = [
  "Chest workout",
  "Dal bhaat nutrition",
  "Sachin Gokhale",
  "HIIT cardio",
  "Protein shake",
  "Deadlift form"
];

const MOCK_FOODS = [
  {
    id: 1,
    name: "Dal Bhaat (Rice & Lentils)",
    image: "https://images.unsplash.com/photo-1767114915989-c6ab3c8fc42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBkYWwlMjByaWNlJTIwbWVhbHxlbnwxfHx8fDE3NzQwMjcyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    portion: "1 plate (300g)",
    calories: 380,
    protein: 12,
    carbs: 72,
    fat: 4,
    tags: ["Vegetarian", "Indian", "High Carb"]
  },
  {
    id: 2,
    name: "Chicken Tikka",
    image: "https://images.unsplash.com/photo-1588767768106-1b20e51d9d68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwdGlra2ElMjBwcm90ZWlufGVufDF8fHx8MTc3NDAyNzI0NHww&ixlib=rb-4.1.0&q=80&w=1080",
    portion: "200g serving",
    calories: 280,
    protein: 42,
    carbs: 8,
    fat: 9,
    tags: ["High Protein", "Low Carb", "Indian"]
  },
  {
    id: 3,
    name: "Paneer Butter Masala",
    image: "https://images.unsplash.com/photo-1597387216134-81e3c0e69b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjBjdXJyeSUyMHZlZ2V0YXJpYW58ZW58MXx8fHwxNzc0MDI3MjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    portion: "1 bowl (250g)",
    calories: 420,
    protein: 18,
    carbs: 15,
    fat: 32,
    tags: ["Vegetarian", "High Fat", "Indian"]
  },
  {
    id: 4,
    name: "Whole Wheat Roti",
    image: "https://images.unsplash.com/photo-1601387448308-66ae6aa1f1f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RpJTIwY2hhcGF0aSUyMGJyZWFkfGVufDF8fHx8MTc3NDAxNTM1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    portion: "1 roti (30g)",
    calories: 70,
    protein: 3,
    carbs: 15,
    fat: 0.4,
    tags: ["Vegetarian", "Whole Grain"]
  },
  {
    id: 5,
    name: "Banana",
    image: "https://images.unsplash.com/photo-1706345195100-6c3a0352a983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBmcnVpdCUyMGhlYWx0aHl8ZW58MXx8fHwxNzc0MDI3MjQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    portion: "1 medium (118g)",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    tags: ["Fruit", "Pre-workout"]
  },
  {
    id: 6,
    name: "Healthy Thali",
    image: "https://images.unsplash.com/photo-1705845580041-f04ad853617f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBoZWFsdGh5JTIwZm9vZCUyMG1lYWx8ZW58MXx8fHwxNzc0MDI2OTg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    portion: "1 full thali",
    calories: 650,
    protein: 28,
    carbs: 95,
    fat: 18,
    tags: ["Balanced", "Indian", "Complete Meal"]
  }
];

const MOCK_TRAINERS = [
  {
    id: 1,
    name: "Sachin Gokhale",
    role: "Strength Coach",
    image: "https://images.unsplash.com/photo-1583500178689-665d1f77e67d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBtYW4lMjBneW0lMjB3b3Jrb3V0JTIwZml0bmVzc3xlbnwxfHx8fDE3NzQwMjY5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    followers: "245k",
    verified: true
  },
  {
    id: 2,
    name: "Radhika Bose",
    role: "Yoga Expert",
    image: "https://images.unsplash.com/photo-1650116384974-a8e4ae69c884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB3b21hbiUyMHlvZ2ElMjBmaXRuZXNzfGVufDF8fHx8MTc3NDAyNjk4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    followers: "189k",
    verified: true
  },
  {
    id: 3,
    name: "Guru Mann",
    role: "Fitness Icon",
    image: "https://images.unsplash.com/photo-1640504409849-da005a55cbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBhdGhsZXRlJTIwcnVubmluZyUyMGV4ZXJjaXNlfGVufDF8fHx8MTc3NDAyNjk4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    followers: "512k",
    verified: true
  },
];

const MOCK_EXERCISES = [
  { id: 1, name: "Bench Press", category: "Chest", difficulty: "Intermediate" },
  { id: 2, name: "Deadlift", category: "Back", difficulty: "Advanced" },
  { id: 3, name: "Squats", category: "Legs", difficulty: "Intermediate" },
  { id: 4, name: "Pull-ups", category: "Back", difficulty: "Intermediate" },
];

export function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognizedFood, setRecognizedFood] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setRecognizedFood(MOCK_FOODS[Math.floor(Math.random() * MOCK_FOODS.length)]);
      toast.success("Food recognized successfully!");
    }, 2000);
  };

  const closeImageSearch = () => {
    setIsImageSearchOpen(false);
    setUploadedImage(null);
    setRecognizedFood(null);
    setIsAnalyzing(false);
  };

  const filteredResults = {
    foods: searchQuery ? MOCK_FOODS.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : MOCK_FOODS.slice(0, 6),
    trainers: searchQuery ? MOCK_TRAINERS.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : MOCK_TRAINERS,
    exercises: searchQuery ? MOCK_EXERCISES.filter(e =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : MOCK_EXERCISES,
  };

  const showResults = searchQuery.length > 0 || selectedCategory !== "all";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Discovery</h1>
        <p className="text-slate-500">Search exercises, trainers, workouts, and food</p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={16} className="text-slate-400" />
            </button>
          )}
        </div>

        <Button
          onClick={() => setIsImageSearchOpen(true)}
          className="rounded-2xl px-6 h-14 gap-2"
        >
          <Camera size={20} />
          <span className="hidden sm:inline">Scan Food</span>
        </Button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {SEARCH_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                }`}
            >
              <Icon size={18} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* AI Hint Card */}
      {!showResults && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Smart Search</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Search for exercises, trainers, or food. You can also scan food images to instantly get nutritional information!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Trending Searches */}
      {!showResults && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-slate-400" />
            <h3 className="font-bold text-slate-900">Trending Searches</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((trend, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(trend)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:border-blue-200 transition-all"
              >
                {trend}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {(showResults || selectedCategory === "food") && (
        <div className="space-y-8">
          {/* Food Results */}
          {(selectedCategory === "all" || selectedCategory === "food") && filteredResults.foods.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Food & Nutrition</h2>
                <span className="text-sm text-slate-500">{filteredResults.foods.length} results</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.foods.map((food) => (
                  <FoodCard key={food.id} food={food} onClick={() => toast.info("Food details coming soon!")} />
                ))}
              </div>
            </div>
          )}

          {/* Trainers Results */}
          {(selectedCategory === "all" || selectedCategory === "trainers") && filteredResults.trainers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Trainers</h2>
                <span className="text-sm text-slate-500">{filteredResults.trainers.length} results</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {filteredResults.trainers.map((trainer) => (
                  <Card
                    key={trainer.id}
                    className="p-5 border-none shadow-sm ring-1 ring-slate-100 hover:ring-blue-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar src={trainer.image} name={trainer.name} className="w-16 h-16" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {trainer.name}
                            </h3>
                            {trainer.verified && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs"></span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{trainer.role}</p>
                          <p className="text-xs text-slate-400 mt-1">{trainer.followers} followers</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        Follow
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Exercises Results */}
          {(selectedCategory === "all" || selectedCategory === "exercises") && filteredResults.exercises.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Exercises</h2>
                <span className="text-sm text-slate-500">{filteredResults.exercises.length} results</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredResults.exercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="p-5 border-none shadow-sm ring-1 ring-slate-100 hover:ring-blue-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {exercise.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs font-bold uppercase rounded">
                            {exercise.category}
                          </span>
                          <span className="text-xs text-slate-500">{exercise.difficulty}</span>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Search Modal */}
      <AnimatePresence>
        {isImageSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeImageSearch}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 w-[90%] max-w-lg z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Scan Food</h3>
                <button
                  onClick={closeImageSearch}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {!uploadedImage ? (
                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-12 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                        <Upload size={32} className="text-blue-600" />
                      </div>
                      <p className="font-bold text-slate-900 mb-1">Upload food image</p>
                      <p className="text-sm text-slate-500">Get instant nutritional information</p>
                    </div>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                    <img src={uploadedImage} alt="Uploaded food" className="w-full h-full object-cover" />
                  </div>

                  {isAnalyzing ? (
                    <div className="text-center py-8">
                      <Loader2 size={40} className="text-blue-600 animate-spin mx-auto mb-4" />
                      <p className="font-bold text-slate-900 mb-1">Analyzing image...</p>
                      <p className="text-sm text-slate-500">AI is recognizing the food</p>
                    </div>
                  ) : recognizedFood ? (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4">Recognized Food:</h4>
                      <FoodCard food={recognizedFood} onClick={closeImageSearch} />
                    </div>
                  ) : null}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
