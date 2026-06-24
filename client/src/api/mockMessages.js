const now = Date.now();
const t = (ms) => new Date(now - ms);
const mins = (n) => t(n * 60 * 1000);
const hours = (n) => t(n * 60 * 60 * 1000);
const days = (n) => t(n * 24 * 60 * 60 * 1000);

export const CURRENT_USER_ID = "me";

export const CURRENT_USER = {
  id: "me",
  name: "You",
  avatar: "https://i.pravatar.cc/80?u=fitcircle_me",
};

// ── Human Contacts ───────────────────────────────────────────
export const mockContacts = {
  sahil: {
    id: "sahil",
    name: "Sahil Khan",
    handle: "@sahil_khan",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    status: "online",
    role: "Bodybuilding Coach",
    isTrainer: true,
    isAI: false,
  },
  yasmin: {
    id: "yasmin",
    name: "Yasmin K.",
    handle: "@yasmin_pilates",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "online",
    role: "Pilates Expert",
    isTrainer: true,
    isAI: false,
  },
  rahul: {
    id: "rahul",
    name: "Rahul Saini",
    handle: "@rahul_strength",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    status: "away",
    role: "Strength Coach",
    isTrainer: true,
    isAI: false,
  },
  nandini: {
    id: "nandini",
    name: "Nandini G.",
    handle: "@nandini_yoga",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "offline",
    role: "Yoga Expert",
    isTrainer: true,
    isAI: false,
  },
  aryan: {
    id: "aryan",
    name: "Aryan Singh",
    handle: "@aryan_hiit",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    status: "online",
    role: "HIIT Trainer",
    isTrainer: false,
    isAI: false,
  },

  // ── AI Agent Contacts ────────────────────────────────────────
  fitcoach_ai: {
    id: "fitcoach_ai",
    name: "FitCoach AI",
    handle: "@fitcoach_ai",
    avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=fitcoach&backgroundColor=ff6b35",
    status: "online",
    role: "Personal Fitness Coach • AI",
    isAI: true,
    agentId: "fitcoach_ai",
    emoji: "🏋️",
    gradient: "from-orange-500 to-red-500",
  },
  weightloss_ai: {
    id: "weightloss_ai",
    name: "WeightLoss AI",
    handle: "@weightloss_ai",
    avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=weightloss&backgroundColor=f59e0b",
    status: "online",
    role: "Fat Loss Specialist • AI",
    isAI: true,
    agentId: "weightloss_ai",
    emoji: "🔥",
    gradient: "from-amber-400 to-orange-500",
  },
  musclegain_ai: {
    id: "musclegain_ai",
    name: "MuscleGain AI",
    handle: "@musclegain_ai",
    avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=musclegain&backgroundColor=8b5cf6",
    status: "online",
    role: "Hypertrophy & Strength Expert • AI",
    isAI: true,
    agentId: "musclegain_ai",
    emoji: "💪",
    gradient: "from-purple-500 to-pink-500",
  },
  nutrition_ai: {
    id: "nutrition_ai",
    name: "Nutrition AI",
    handle: "@nutrition_ai",
    avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=nutrition&backgroundColor=10b981",
    status: "online",
    role: "Sports Nutrition Specialist • AI",
    isAI: true,
    agentId: "nutrition_ai",
    emoji: "🥗",
    gradient: "from-green-500 to-teal-500",
  },
  workout_ai: {
    id: "workout_ai",
    name: "WorkoutPlanner AI",
    handle: "@workout_ai",
    avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=workoutplanner&backgroundColor=3b82f6",
    status: "online",
    role: "Program Design Expert • AI",
    isAI: true,
    agentId: "workout_ai",
    emoji: "📋",
    gradient: "from-blue-500 to-indigo-500",
  },
  homeworkout_ai: {
    id: "homeworkout_ai",
    name: "HomeWorkout AI",
    handle: "@homeworkout_ai",
    avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=homeworkout&backgroundColor=06b6d4",
    status: "online",
    role: "No-Equipment Training Coach • AI",
    isAI: true,
    agentId: "homeworkout_ai",
    emoji: "🏠",
    gradient: "from-cyan-500 to-blue-500",
  },
  yoga_ai: {
    id: "yoga_ai",
    name: "YogaCoach AI",
    handle: "@yoga_ai",
    avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=yogacoach&backgroundColor=f43f5e",
    status: "online",
    role: "Yoga & Mindfulness Expert • AI",
    isAI: true,
    agentId: "yoga_ai",
    emoji: "🧘",
    gradient: "from-rose-400 to-purple-500",
  },
  motivation_ai: {
    id: "motivation_ai",
    name: "Motivation AI",
    handle: "@motivation_ai",
    avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=motivation&backgroundColor=eab308",
    status: "online",
    role: "Mental Strength & Mindset Coach • AI",
    isAI: true,
    agentId: "motivation_ai",
    emoji: "⚡",
    gradient: "from-yellow-400 to-orange-500",
  },
};

// ── Human Conversations ──────────────────────────────────────
export const mockConversations = [
  {
    id: "conv_sahil",
    participantId: "sahil",
    lastMessage: { text: "Great session today! Keep pushing 💪", timestamp: mins(2), isFromMe: false },
    unreadCount: 2,
  },
  {
    id: "conv_yasmin",
    participantId: "yasmin",
    lastMessage: { text: "Thanks for the nutrition advice!", timestamp: mins(45), isFromMe: true },
    unreadCount: 0,
  },
  {
    id: "conv_rahul",
    participantId: "rahul",
    lastMessage: { text: "Can we schedule a session?", timestamp: hours(2), isFromMe: false },
    unreadCount: 1,
  },
  {
    id: "conv_nandini",
    participantId: "nandini",
    lastMessage: { text: "Morning yoga at 6am tomorrow! 🧘‍♀️", timestamp: hours(5), isFromMe: false },
    unreadCount: 0,
  },
  {
    id: "conv_aryan",
    participantId: "aryan",
    lastMessage: { text: "New PR achieved! 💪", timestamp: days(1), isFromMe: true },
    unreadCount: 0,
  },

  // ── AI Agent Conversations ───────────────────────────────────
  {
    id: "conv_fitcoach_ai",
    participantId: "fitcoach_ai",
    lastMessage: { text: "Hi! I'm FitCoach AI 🏋️ — ask me anything about fitness!", timestamp: mins(1), isFromMe: false },
    unreadCount: 1,
    isAI: true,
  },
  {
    id: "conv_weightloss_ai",
    participantId: "weightloss_ai",
    lastMessage: { text: "Ready to help you burn fat and feel amazing 🔥", timestamp: mins(3), isFromMe: false },
    unreadCount: 1,
    isAI: true,
  },
  {
    id: "conv_musclegain_ai",
    participantId: "musclegain_ai",
    lastMessage: { text: "Let's build serious muscle together 💪", timestamp: mins(5), isFromMe: false },
    unreadCount: 1,
    isAI: true,
  },
  {
    id: "conv_nutrition_ai",
    participantId: "nutrition_ai",
    lastMessage: { text: "Tell me your goals and I'll build your meal plan 🥗", timestamp: mins(8), isFromMe: false },
    unreadCount: 1,
    isAI: true,
  },
  {
    id: "conv_workout_ai",
    participantId: "workout_ai",
    lastMessage: { text: "I'll design the perfect workout program for you 📋", timestamp: mins(10), isFromMe: false },
    unreadCount: 0,
    isAI: true,
  },
  {
    id: "conv_homeworkout_ai",
    participantId: "homeworkout_ai",
    lastMessage: { text: "No gym? No problem — let's train at home! 🏠", timestamp: mins(12), isFromMe: false },
    unreadCount: 0,
    isAI: true,
  },
  {
    id: "conv_yoga_ai",
    participantId: "yoga_ai",
    lastMessage: { text: "Namaste 🙏 Ready to flow and find your balance?", timestamp: mins(15), isFromMe: false },
    unreadCount: 0,
    isAI: true,
  },
  {
    id: "conv_motivation_ai",
    participantId: "motivation_ai",
    lastMessage: { text: "Your only limit is your mind ⚡ Let's GO!", timestamp: mins(20), isFromMe: false },
    unreadCount: 0,
    isAI: true,
  },
];

// ── Human Messages ────────────────────────────────────────────
export const mockMessages = {
  conv_sahil: [
    { id: "s1", senderId: "sahil", text: "Hey! How's the training going?", timestamp: hours(3), type: "text" },
    { id: "s2", senderId: "me", text: "Going great! Just finished leg day 🦵", timestamp: t(3 * 60 * 60 * 1000 - 5 * 60 * 1000), type: "text" },
    { id: "s3", senderId: "sahil", text: "Nice! Don't forget to stretch after. Mobility is key for recovery.", timestamp: hours(2.5), type: "text" },
    { id: "s4", senderId: "me", text: "Absolutely! I've been doing 15 minutes of stretching after every session.", timestamp: t(2 * 60 * 60 * 1000 + 30 * 60 * 1000), type: "text" },
    { id: "s5", senderId: "sahil", text: "That's perfect! Your progress is really showing 💪", timestamp: hours(2), type: "text" },
    { id: "s6", senderId: "me", text: "Thanks to your coaching! Hit a new squat PR today", timestamp: mins(30), type: "text" },
    { id: "s7", senderId: "sahil", text: "Great session today! Keep pushing 💪", timestamp: mins(2), type: "text" },
  ],
  conv_yasmin: [
    { id: "y1", senderId: "yasmin", text: "Hi! I noticed you've been joining the morning pilates sessions 🧘‍♀️", timestamp: hours(2), type: "text" },
    { id: "y2", senderId: "me", text: "Yes! I love it. My flexibility has improved so much.", timestamp: hours(1.5), type: "text" },
    { id: "y3", senderId: "yasmin", text: "Wonderful! Also, try adding more protein to your post-workout meal.", timestamp: t(80 * 60 * 1000), type: "text" },
    { id: "y4", senderId: "me", text: "Thanks for the nutrition advice!", timestamp: mins(45), type: "text" },
  ],
  conv_rahul: [
    { id: "r1", senderId: "me", text: "Hey Rahul, amazing squat session yesterday!", timestamp: hours(3), type: "text" },
    { id: "r2", senderId: "rahul", text: "Thank you! Your form has improved significantly.", timestamp: t(2.8 * 60 * 60 * 1000), type: "text" },
    { id: "r3", senderId: "rahul", text: "Can we schedule a session?", timestamp: hours(2), type: "text" },
  ],
  conv_nandini: [
    { id: "n1", senderId: "nandini", text: "Namaste! 🙏 Are you joining tomorrow's sunrise yoga?", timestamp: hours(6), type: "text" },
    { id: "n2", senderId: "me", text: "Definitely! What time?", timestamp: hours(5.5), type: "text" },
    { id: "n3", senderId: "nandini", text: "Morning yoga at 6am tomorrow! 🧘‍♀️", timestamp: hours(5), type: "text" },
  ],
  conv_aryan: [
    { id: "a1", senderId: "aryan", text: "Bro the HIIT circuit you designed is insane! 🔥", timestamp: hours(25), type: "text" },
    { id: "a2", senderId: "me", text: "Haha glad you like it! Keep pushing!", timestamp: t(24.5 * 60 * 60 * 1000), type: "text" },
    { id: "a3", senderId: "me", text: "New PR achieved! 💪", timestamp: days(1), type: "text" },
  ],

  // ── AI Agent Starter Messages ────────────────────────────────
  conv_fitcoach_ai: [
    { id: "fc1", senderId: "fitcoach_ai", text: "Hi! I'm FitCoach AI 🏋️ — your personal fitness coach inside FitCirclePro.\n\nI can help you with workouts, diet, weight loss, muscle gain, and more.\n\nWhat's your fitness goal today?", timestamp: mins(1), type: "text" },
  ],
  conv_weightloss_ai: [
    { id: "wl1", senderId: "weightloss_ai", text: "Hey! I'm WeightLoss AI 🔥 — your fat-loss specialist.\n\nI'll help you create a sustainable calorie deficit, design a cardio plan, and build healthy eating habits.\n\nTell me — what's your current weight and goal weight?", timestamp: mins(3), type: "text" },
  ],
  conv_musclegain_ai: [
    { id: "mg1", senderId: "musclegain_ai", text: "What's up! I'm MuscleGain AI 💪 — your hypertrophy and strength expert.\n\nI design science-based muscle building programs with progressive overload.\n\nHow many days per week can you train?", timestamp: mins(5), type: "text" },
  ],
  conv_nutrition_ai: [
    { id: "nu1", senderId: "nutrition_ai", text: "Hello! I'm Nutrition AI 🥗 — your sports nutrition specialist.\n\nI'll calculate your macros, design your meal plan, and guide your nutrition for peak performance.\n\nWhat's your goal — fat loss, muscle gain, or maintenance?", timestamp: mins(8), type: "text" },
  ],
  conv_workout_ai: [
    { id: "wp1", senderId: "workout_ai", text: "Hey there! I'm WorkoutPlanner AI 📋 — I design custom training programs.\n\nWhether you prefer PPL, Upper/Lower, or Full Body splits, I'll build the perfect plan for you.\n\nWhat's your experience level and how many days can you train?", timestamp: mins(10), type: "text" },
  ],
  conv_homeworkout_ai: [
    { id: "hw1", senderId: "homeworkout_ai", text: "No gym? No problem! I'm HomeWorkout AI 🏠\n\nI specialize in bodyweight training, HIIT circuits, and resistance band workouts you can do anywhere.\n\nDo you have any equipment at home (resistance bands, dumbbells, pull-up bar)?", timestamp: mins(12), type: "text" },
  ],
  conv_yoga_ai: [
    { id: "ya1", senderId: "yoga_ai", text: "Namaste 🙏 I'm YogaCoach AI — your guide to flexibility, mindfulness, and recovery.\n\nI can help you with morning flows, post-workout stretching, stress relief yoga, and breathwork.\n\nAre you a beginner or do you have yoga experience?", timestamp: mins(15), type: "text" },
  ],
  conv_motivation_ai: [
    { id: "mo1", senderId: "motivation_ai", text: "LET'S GO! ⚡ I'm Motivation AI — your mindset and mental strength coach!\n\nI'm here when you feel like giving up, need a push, or want to build unstoppable discipline.\n\nWhat's holding you back from your fitness goals right now?", timestamp: mins(20), type: "text" },
  ],
};

// ── Groups ────────────────────────────────────────────────────
export const mockGroups = [
  {
    id: "grp_weight_loss",
    name: "Weight Loss Squad",
    description: "Support group for weight loss goals 💪",
    emoji: "🏃",
    gradient: "from-brand-orange to-brand-red",
    memberCount: 12,
    members: ["sahil", "yasmin", "nandini", "me"],
    lastMessage: { text: "Who's joining the 30-day challenge? 🙋", senderName: "Yasmin", timestamp: mins(10), isFromMe: false },
    unreadCount: 3,
  },
  {
    id: "grp_muscle_gain",
    name: "Muscle Gain Group",
    description: "Powerlifting & strength training community",
    emoji: "🏋️",
    gradient: "from-brand-purple to-brand-pink",
    memberCount: 8,
    members: ["rahul", "aryan", "sahil", "me"],
    lastMessage: { text: "New workout plan uploaded! Check it out", senderName: "Rahul", timestamp: mins(45), isFromMe: false },
    unreadCount: 1,
  },
  {
    id: "grp_home_workout",
    name: "Home Workout Community",
    description: "No gym? No problem! Train anywhere 🏠",
    emoji: "🏠",
    gradient: "from-brand-green to-brand-cyan",
    memberCount: 24,
    members: ["aryan", "nandini", "yasmin", "me"],
    lastMessage: { text: "I shared my morning routine", senderName: "You", timestamp: hours(2), isFromMe: true },
    unreadCount: 0,
  },
];

export const mockGroupMessages = {
  grp_weight_loss: [
    { id: "gw1", senderId: "sahil", senderName: "Sahil", senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", text: "Good morning everyone! Let's crush today 💪", timestamp: hours(5), type: "text" },
    { id: "gw2", senderId: "nandini", senderName: "Nandini", senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", text: "Morning yoga done! 2kg down this week 🎉", timestamp: hours(4.5), type: "text" },
    { id: "gw3", senderId: "me", senderName: "You", senderAvatar: "https://i.pravatar.cc/80?u=fitcircle_me", text: "That's amazing! Keep it up!", timestamp: hours(4), type: "text" },
    { id: "gw4", senderId: "yasmin", senderName: "Yasmin", senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", text: "Who's joining the 30-day challenge? 🙋", timestamp: mins(10), type: "text" },
  ],
  grp_muscle_gain: [
    { id: "mg1", senderId: "aryan", senderName: "Aryan", senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", text: "Hit 100kg bench today! New PR 🏆", timestamp: hours(2), type: "text" },
    { id: "mg2", senderId: "me", senderName: "You", senderAvatar: "https://i.pravatar.cc/80?u=fitcircle_me", text: "Beast mode! What's your program?", timestamp: t(1.8 * 60 * 60 * 1000), type: "text" },
    { id: "mg3", senderId: "rahul", senderName: "Rahul", senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", text: "New workout plan uploaded! Check it out", timestamp: mins(45), type: "text" },
  ],
  grp_home_workout: [
    { id: "hw1", senderId: "nandini", senderName: "Nandini", senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", text: "Resistance bands are a game changer! 💪", timestamp: hours(4), type: "text" },
    { id: "hw2", senderId: "aryan", senderName: "Aryan", senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", text: "100% agree! Share your routine?", timestamp: hours(3.5), type: "text" },
    { id: "hw3", senderId: "me", senderName: "You", senderAvatar: "https://i.pravatar.cc/80?u=fitcircle_me", text: "I shared my morning routine", timestamp: hours(2), type: "text" },
  ],
};
