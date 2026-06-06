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

export const mockContacts = {
  sahil: {
    id: "sahil",
    name: "Sahil Khan",
    handle: "@sahil_khan",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    status: "online",
    role: "Bodybuilding Coach",
    isTrainer: true,
  },
  yasmin: {
    id: "yasmin",
    name: "Yasmin K.",
    handle: "@yasmin_pilates",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "online",
    role: "Pilates Expert",
    isTrainer: true,
  },
  rahul: {
    id: "rahul",
    name: "Rahul Saini",
    handle: "@rahul_strength",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    status: "away",
    role: "Strength Coach",
    isTrainer: true,
  },
  nandini: {
    id: "nandini",
    name: "Nandini G.",
    handle: "@nandini_yoga",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "offline",
    role: "Yoga Expert",
    isTrainer: true,
  },
  aryan: {
    id: "aryan",
    name: "Aryan Singh",
    handle: "@aryan_hiit",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    status: "online",
    role: "HIIT Trainer",
    isTrainer: false,
  },
};

export const mockConversations = [
  {
    id: "conv_sahil",
    participantId: "sahil",
    lastMessage: {
      text: "Great session today! Keep pushing ",
      timestamp: mins(2),
      isFromMe: false,
    },
    unreadCount: 2,
  },
  {
    id: "conv_yasmin",
    participantId: "yasmin",
    lastMessage: {
      text: "Thanks for the nutrition advice!",
      timestamp: mins(45),
      isFromMe: true,
    },
    unreadCount: 0,
  },
  {
    id: "conv_rahul",
    participantId: "rahul",
    lastMessage: {
      text: "Can we schedule a session?",
      timestamp: hours(2),
      isFromMe: false,
    },
    unreadCount: 1,
  },
  {
    id: "conv_nandini",
    participantId: "nandini",
    lastMessage: {
      text: "Morning yoga at 6am tomorrow! 🧘‍",
      timestamp: hours(5),
      isFromMe: false,
    },
    unreadCount: 0,
  },
  {
    id: "conv_aryan",
    participantId: "aryan",
    lastMessage: {
      text: "New PR achieved! 💪",
      timestamp: days(1),
      isFromMe: true,
    },
    unreadCount: 0,
  },
];

export const mockMessages = {
  conv_sahil: [
    { id: "s1", senderId: "sahil", text: "Hey! How's the training going?", timestamp: hours(3), type: "text" },
    { id: "s2", senderId: "me", text: "Going great! Just finished leg day 🦵", timestamp: t(3 * 60 * 60 * 1000 - 5 * 60 * 1000), type: "text" },
    { id: "s3", senderId: "sahil", text: "Nice! Don't forget to stretch after. Mobility is key for recovery.", timestamp: hours(2.5), type: "text" },
    { id: "s4", senderId: "me", text: "Absolutely! I've been doing 15 minutes of stretching after every session.", timestamp: t(2 * 60 * 60 * 1000 + 30 * 60 * 1000), type: "text" },
    { id: "s5", senderId: "sahil", text: "That's perfect! Your progress is really showing 💪", timestamp: hours(2), type: "text" },
    { id: "s6", senderId: "me", text: "Thanks to your coaching! Hit a new squat PR today", timestamp: mins(30), type: "text" },
    { id: "s7", senderId: "sahil", text: "Great session today! Keep pushing ", timestamp: mins(2), type: "text" },
  ],
  conv_yasmin: [
    { id: "y1", senderId: "yasmin", text: "Hi! I noticed you've been joining the morning pilates sessions 🧘‍", timestamp: hours(2), type: "text" },
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
    { id: "n3", senderId: "nandini", text: "Morning yoga at 6am tomorrow! 🧘‍", timestamp: hours(5), type: "text" },
  ],
  conv_aryan: [
    { id: "a1", senderId: "aryan", text: "Bro the HIIT circuit you designed is insane! ", timestamp: hours(25), type: "text" },
    { id: "a2", senderId: "me", text: "Haha glad you like it! Keep pushing!", timestamp: t(24.5 * 60 * 60 * 1000), type: "text" },
    { id: "a3", senderId: "me", text: "New PR achieved! 💪", timestamp: days(1), type: "text" },
  ],
};

export const mockGroups = [
  {
    id: "grp_weight_loss",
    name: "Weight Loss Squad",
    description: "Support group for weight loss goals 💪",
    emoji: "🏃",
    gradient: "from-brand-orange to-brand-red",
    memberCount: 12,
    members: ["sahil", "yasmin", "nandini", "me"],
    lastMessage: {
      text: "Who's joining the 30-day challenge? 🙋",
      senderName: "Yasmin",
      timestamp: mins(10),
      isFromMe: false,
    },
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
    lastMessage: {
      text: "New workout plan uploaded! Check it out",
      senderName: "Rahul",
      timestamp: mins(45),
      isFromMe: false,
    },
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
    lastMessage: {
      text: "I shared my morning routine",
      senderName: "You",
      timestamp: hours(2),
      isFromMe: true,
    },
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
    { id: "mg1", senderId: "aryan", senderName: "Aryan", senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", text: "Hit 100kg bench today! New PR ", timestamp: hours(2), type: "text" },
    { id: "mg2", senderId: "me", senderName: "You", senderAvatar: "https://i.pravatar.cc/80?u=fitcircle_me", text: "Beast mode! What's your program?", timestamp: t(1.8 * 60 * 60 * 1000), type: "text" },
    { id: "mg3", senderId: "rahul", senderName: "Rahul", senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", text: "New workout plan uploaded! Check it out", timestamp: mins(45), type: "text" },
  ],
  grp_home_workout: [
    { id: "hw1", senderId: "nandini", senderName: "Nandini", senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", text: "Resistance bands are a game changer! 💪", timestamp: hours(4), type: "text" },
    { id: "hw2", senderId: "aryan", senderName: "Aryan", senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", text: "100% agree! Share your routine?", timestamp: hours(3.5), type: "text" },
    { id: "hw3", senderId: "me", senderName: "You", senderAvatar: "https://i.pravatar.cc/80?u=fitcircle_me", text: "I shared my morning routine", timestamp: hours(2), type: "text" },
  ],
};
