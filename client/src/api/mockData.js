export const feedData = [
  {
    id: 1,
    user: {
      name: "Vikram 'The Beast' Singh",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      role: "Pro Bodybuilder"
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-in-the-gym-427-large.mp4",
    likes: 1240,
    comments: 89,
    caption: "Focus on the squeeze! 🇮🇳 Today's leg day was brutal but necessary. Remember, real strength comes from the foundation. #FitIndia #DesiBodybuilding #LegDay"
  },
  {
    id: 2,
    user: {
      name: "Ananya Iyer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      role: "Yoga & Mindfulness Coach"
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-on-a-mat-431-large.mp4",
    likes: 3500,
    comments: 156,
    caption: "Aligning the Chakras this morning at Rishikesh. Yoga is not just about flexibility, it's about the connection between breath and movement.  #YogaLife #VinyasaFlow #IndianFitness"
  },
  {
    id: 3,
    user: {
      name: "Rohan Mehra",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
      role: "HIIT Specialist"
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-a-man-running-on-the-beach-466-large.mp4",
    likes: 892,
    comments: 42,
    caption: "Quick 15 min fat burner you can do anywhere! No equipment needed. Tag a friend who needs to start today!  #FatLoss #IndianFitnessCommunity #HIITWorkout"
  },
  {
    id: 4,
    user: {
      name: "Sneha Kapoor",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      role: "Nutritionist & Athlete"
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-box-jumps-at-the-gym-430-large.mp4",
    likes: 2105,
    comments: 112,
    caption: "Athleticism is the peak of human performance. Focus on explosive movements to build real-world power.  #AthleteLife #CrossfitIndia #PowerTraining"
  }
];

export const workouts = [
  {
    id: 1,
    title: "The Akhada Build",
    category: "Strength",
    duration: "45 min",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    tags: ["Compound", "Heavy", "Desi Strength"],
    exercises: 8,
    calories: 450
  },
  {
    id: 2,
    title: "Bollywood Beach Lean",
    category: "HIIT",
    duration: "20 min",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    tags: ["No Equipment", "Fast", "Fat Loss"],
    exercises: 12,
    calories: 320
  },
  {
    id: 3,
    title: "Himalayan Flow",
    category: "Yoga",
    duration: "30 min",
    difficulty: "All Levels",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    tags: ["Mindfulness", "Flexibility", "Relaxation"],
    exercises: 15,
    calories: 150
  },
  {
    id: 4,
    title: "Bengaluru Shred",
    category: "Cardio",
    duration: "25 min",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80",
    tags: ["Running", "Endurance"],
    exercises: 1,
    calories: 400
  }
];

export const dietPlans = [
  {
    id: 1,
    name: "Pure Veg Muscle Gain",
    calories: 2200,
    protein: "140g",
    carbs: "250g",
    fats: "65g",
    meals: [
      { name: "Breakfast", items: "Paneer Bhurji (150g) + 2 Multi-grain Toast + Whey Shake" },
      { name: "Lunch", items: "Thick Dal Tadka + Brown Rice (1 cup) + Mixed Vegetable Sabzi + Curd" },
      { name: "Evening", items: "Roasted Makhana (1 bowl) + Green Tea" },
      { name: "Dinner", items: "Soya Chunks Curry + 1 Roti + Large Salad Bowl" }
    ]
  },
  {
    id: 2,
    name: "Keto Desi Style",
    calories: 1800,
    protein: "120g",
    carbs: "40g",
    fats: "130g",
    meals: [
      { name: "Breakfast", items: "3 Egg Omelette with Butter + Avocado half" },
      { name: "Lunch", items: "Grilled Chicken Breast (200g) + Buttered Spinach + Ghee" },
      { name: "Evening", items: "Almonds (10-12) + Bulletproof Coffee" },
      { name: "Dinner", items: "Fish Tikka + Sautéed Cauliflower + Olive Oil Drizzle" }
    ]
  }
];

export const stats = {
  activeUsers: "42.5k",
  workoutsCompleted: "1.2M",
  totalWeightLifted: "850 Tons",
  avgCaloriesBurned: "320 kcal"
};
