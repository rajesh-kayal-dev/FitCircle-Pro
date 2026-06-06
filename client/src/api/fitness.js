import apiClient from "./client";

export const getWorkouts = async () => {
  return [
    { id: 1, title: "Upper Body Strength", category: "Strength", level: "Intermediate", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop" },
    { id: 2, title: "HIIT Cardio", category: "Cardio", level: "Beginner", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop" },
    { id: 3, title: "Leg Day Grind", category: "Strength", level: "Advanced", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop" },
  ];
};

export const getPosts = async () => {
  return [
    { id: 1, author: "Rahul Sharma", handle: "@rahulfit", content: "Hit a new PB today on squats! 140kg x 5 reps.", likes: 24, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop" },
    { id: 2, author: "Priya Patel", handle: "@priya_yoga", content: "Early morning stretching is non-negotiable.", likes: 45, image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=600&auto=format&fit=crop" },
  ];
};

export const getUserStats = async () => {
  return { workouts: 124, streak: 12, calories: 14500 };
};
