import apiClient from "./client";

// ── Workouts ────────────────────────────────────────────────────────────────
export const getWorkouts = () => apiClient.get("/workouts");
export const getWorkoutById = (id) => apiClient.get(`/workouts/${id}`);
export const getExercises = (params = {}) => apiClient.get("/workouts/exercises", { params });
export const getBodyParts = () => apiClient.get("/workouts/exercises/body-parts");
export const searchWorkoutVideos = (query) => apiClient.get(`/workouts/videos?q=${encodeURIComponent(query)}`);

// ── Social Feed ─────────────────────────────────────────────────────────────
export const getSocialFeed = () => apiClient.get("/feed");
export const createPost = (data) => apiClient.post("/feed", data);
export const likePost = (id) => apiClient.post(`/feed/${id}/like`);

// ── Users & Profile ─────────────────────────────────────────────────────────
export const getProfile = (id) => apiClient.get(`/users/${id}/profile`);
export const searchEverything = (query) => apiClient.get(`/search?q=${query}`);

// ── Auth — Passwordless OTP ──────────────────────────────────────────────────
export const sendOtp = (email) => apiClient.post("/auth/send-otp", { email });
export const verifyOtp = (email, otp) =>
  apiClient.post("/auth/verify-otp", { email, otp });

// ── Auth — Google OAuth ──────────────────────────────────────────────────────
export const googleLogin = (credential) =>
  apiClient.post("/auth/google", { credential });

// ── Auth — Admin (Email + Password) ─────────────────────────────────────────
export const adminLoginApi = (email, password) =>
  apiClient.post("/auth/admin-login", { email, password });

export const fetchExploreSearch = (query) =>
  apiClient.get(`/explore/search?q=${encodeURIComponent(query)}`);
export const fetchExploreTrending = () =>
  apiClient.get(`/explore/trending`);
export const fetchExploreTrainers = () =>
  apiClient.get(`/explore/trainers`);
export const fetchExploreVideos = () =>
  apiClient.get(`/explore/videos`);
export const fetchExploreArticles = () =>
  apiClient.get(`/explore/articles`);

// ── Authentication ───────────────────────────────────────────────────────────────
export const saveOnboarding = (data) =>
  apiClient.put("/auth/complete-onboarding", data);

// ── AI ───────────────────────────────────────────────────────────────────────
export const askGemini = (prompt) => apiClient.post("/ai/gemini", { prompt });
export const generateWorkoutPlan = (data) =>
  apiClient.post("/workouts/ai/generate", data);
export const saveWorkoutPlan = (data) =>
  apiClient.post("/workouts/plans", data);
export const getWorkoutPlans = () =>
  apiClient.get("/workouts/plans");
export const generateAIDietPlan = (preferences) =>
  apiClient.post("/ai/generate-diet", { preferences });

// ── Store / Products ─────────────────────────────────────────────────────────
export const searchProducts = (query) =>
  apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
export const getProductById = (id) =>
  apiClient.get(`/products/${id}`);

// ── Diet / Nutrition ─────────────────────────────────────────────────────────
export const calculateDietTargets = (data) =>
  apiClient.post("/diet/calculate", data);
export const generateDietPlan = (data) =>
  apiClient.post("/diet/plan", data);
export const getDietPlanHistory = () =>
  apiClient.get("/diet/plans");
export const getDietPlanById = (id) =>
  apiClient.get(`/diet/plans/${id}`);
export const searchFoods = (query) =>
  apiClient.get(`/diet/foods/search?q=${encodeURIComponent(query)}`);
export const analyzeFood = (data) =>
  apiClient.post("/diet/foods/analyze", data);
export const addMeal = (data) =>
  apiClient.post("/diet/meals", data);
export const logFood = (data) =>
  apiClient.post("/diet/food/log", data);
export const getTodayFoodLog = () =>
  apiClient.get("/diet/food/today");
export const askDietAI = (question) =>
  apiClient.post("/diet/ask", { question });
export const autoCorrectFoodQuery = (query) =>
  apiClient.post("/diet/foods/autocorrect", { query });

// ── Admin Management ──────────────────────────────────────────────────────────
export const adminGetUsers = () => apiClient.get("/auth/admin/users");
export const adminUpdateUserStatus = (id) =>
  apiClient.patch(`/auth/admin/users/${id}/status`);
export const adminDeleteUser = (id) =>
  apiClient.delete(`/auth/admin/users/${id}`);
