import React, { useState } from "react";
import { Dumbbell, Filter, TrendingUp, Clock, Flame } from "lucide-react";
import { motion } from "motion/react";
import { Button, Input, Card } from "../../app/components/ui";
import { WorkoutCard } from "../../app/components/shared/WorkoutCard";
import { useNavigate } from "react-router";

const CATEGORIES = [
  { id: "all", label: "All Workouts", icon: Dumbbell },
  { id: "strength", label: "Strength", icon: Dumbbell },
  { id: "hypertrophy", label: "Hypertrophy", icon: TrendingUp },
  { id: "cardio", label: "Cardio", icon: Flame },
  { id: "recovery", label: "Recovery", icon: Clock },
];

const WORKOUTS = [
  {
    id: 1,
    title: "Full Body Power Workout",
    description: "Build strength with compound movements. Perfect for beginners to intermediate lifters focusing on overall power development.",
    category: "strength",
    difficulty: "Intermediate",
    duration: "45 min",
    calories: 420,
    image: "https://images.unsplash.com/photo-1758875570185-eaed16371474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXNoJTIwdXBzJTIwc3RyZW5ndGglMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQwMjcxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: true,
    trainer: {
      name: "Sachin Gokhale",
      image: "https://images.unsplash.com/photo-1583500178689-665d1f77e67d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBtYW4lMjBneW0lMjB3b3Jrb3V0JTIwZml0bmVzc3xlbnwxfHx8fDE3NzQwMjY5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: 2,
    title: "Deadlift Mastery Program",
    description: "Master the king of all lifts. Learn proper form and progressively build your deadlift strength with this comprehensive program.",
    category: "strength",
    difficulty: "Advanced",
    duration: "60 min",
    calories: 550,
    image: "https://images.unsplash.com/photo-1744551472900-d23f4997e1cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWFkbGlmdCUyMHBvd2VybGlmdGluZyUyMGd5bXxlbnwxfHx8fDE3NzQwMjcxMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: true,
    trainer: {
      name: "Yash Anand",
      image: "https://images.unsplash.com/photo-1693214099504-7f254801d0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBib2R5YnVpbGRlciUyMG11c2NsZXxlbnwxfHx8fDE3NzQwMjY5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: 3,
    title: "Muscle Building Blueprint",
    description: "Scientific approach to hypertrophy. Volume-based training designed to maximize muscle growth with optimal recovery.",
    category: "hypertrophy",
    difficulty: "Intermediate",
    duration: "75 min",
    calories: 480,
    image: "https://images.unsplash.com/photo-1642267221102-15e7a4c39cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5YnVpbGRpbmclMjBtdXNjbGUlMjBoeXBlcnRyb3BoeXxlbnwxfHx8fDE3NzQwMjcxMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: true,
    trainer: {
      name: "Guru Mann",
      image: "https://images.unsplash.com/photo-1640504409849-da005a55cbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBhdGhsZXRlJTIwcnVubmluZyUyMGV4ZXJjaXNlfGVufDF8fHx8MTc3NDAyNjk4NHww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: 4,
    title: "HIIT Cardio Blast",
    description: "High-intensity interval training to torch calories and improve cardiovascular endurance. Get results in less time!",
    category: "cardio",
    difficulty: "Intermediate",
    duration: "30 min",
    calories: 380,
    image: "https://images.unsplash.com/photo-1761971974992-6df33df97c3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaW8lMjBydW5uaW5nJTIwdHJlYWRtaWxsfGVufDF8fHx8MTc3Mzk4MjEwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: false,
    trainer: {
      name: "Rohit Khatri",
      image: "https://images.unsplash.com/photo-1507398941214-57f5bd6293db?q=80&w=1470&auto=format&fit=crop"
    }
  },
  {
    id: 5,
    title: "Recovery & Mobility Flow",
    description: "Active recovery session focusing on mobility, flexibility, and muscle recovery. Essential for preventing injuries.",
    category: "recovery",
    difficulty: "Beginner",
    duration: "35 min",
    calories: 150,
    image: "https://images.unsplash.com/photo-1593204075264-0b7994458bf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwc3RyZXRjaGluZyUyMHJlY292ZXJ5fGVufDF8fHx8MTc3NDAyNzExN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: false,
    trainer: {
      name: "Radhika Bose",
      image: "https://images.unsplash.com/photo-1650116384974-a8e4ae69c884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB3b21hbiUyMHlvZ2ElMjBmaXRuZXNzfGVufDF8fHx8MTc3NDAyNjk4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: 6,
    title: "Upper Body Pump",
    description: "Intense upper body workout focusing on chest, back, shoulders, and arms. Build a powerful upper body physique.",
    category: "hypertrophy",
    difficulty: "Intermediate",
    duration: "55 min",
    calories: 450,
    image: "https://images.unsplash.com/photo-1583500178689-665d1f77e67d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBtYW4lMjBneW0lMjB3b3Jrb3V0JTIwZml0bmVzc3xlbnwxfHx8fDE3NzQwMjY5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: true,
    trainer: {
      name: "Abhinav Mahajan",
      image: "https://images.unsplash.com/photo-1623941731728-6d9901ee23cd?q=80&w=1470&auto=format&fit=crop"
    }
  },
  {
    id: 7,
    title: "Fat Burn Zone",
    description: "Steady-state cardio optimized for fat burning. Perfect for morning workouts or active recovery days.",
    category: "cardio",
    difficulty: "Beginner",
    duration: "40 min",
    calories: 320,
    image: "https://images.unsplash.com/photo-1640504409849-da005a55cbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBhdGhsZXRlJTIwcnVubmluZyUyMGV4ZXJjaXNlfGVufDF8fHx8MTc3NDAyNjk4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: false,
    trainer: {
      name: "Virat Kohli",
      image: "https://images.unsplash.com/photo-1640504409849-da005a55cbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBhdGhsZXRlJTIwcnVubmluZyUyMGV4ZXJjaXNlfGVufDF8fHx8MTc3NDAyNjk4NHww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: 8,
    title: "Core Crusher Circuit",
    description: "Targeted core training to build a strong, stable midsection. Improve your overall strength and athletic performance.",
    category: "strength",
    difficulty: "Intermediate",
    duration: "25 min",
    calories: 200,
    image: "https://images.unsplash.com/photo-1758875570185-eaed16371474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXNoJTIwdXBzJTIwc3RyZW5ndGglMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQwMjcxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: true,
    trainer: {
      name: "Manoj Smesh",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
    }
  }
];

export function WorkoutList() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredWorkouts = WORKOUTS.filter(workout => {
    const matchesCategory = selectedCategory === "all" || workout.category === selectedCategory;
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.trainer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleWorkoutClick = (workout) => {
    navigate("/app/execution", { state: { workout } });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Workout Library</h1>
          <p className="text-slate-500">Discover workouts from top Indian fitness trainers</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search workouts, trainers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl">
            <Filter size={20} />
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => {
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
      </div>

      {/* Stats Banner */}
      <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 border-none text-white">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold mb-1">{WORKOUTS.length}</p>
            <p className="text-sm text-blue-100">Total Workouts</p>
          </div>
          <div className="text-center border-l border-r border-blue-400/30">
            <p className="text-3xl font-bold mb-1">15+</p>
            <p className="text-sm text-blue-100">Expert Trainers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold mb-1">4.8</p>
            <p className="text-sm text-blue-100">Avg Rating</p>
          </div>
        </div>
      </Card>

      {/* Workouts Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {selectedCategory === "all" ? "All Workouts" : CATEGORIES.find(c => c.id === selectedCategory)?.label}
          </h2>
          <span className="text-sm text-slate-500 font-medium">{filteredWorkouts.length} workouts</span>
        </div>

        {filteredWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWorkouts.map((workout, idx) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <WorkoutCard workout={workout} onClick={() => handleWorkoutClick(workout)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No workouts found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
