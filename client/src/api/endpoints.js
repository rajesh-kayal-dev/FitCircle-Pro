import apiClient from "./client";

// ── Workouts ────────────────────────────────────────────────────────────────
export const getWorkouts = () => apiClient.get("/workouts");
export const getWorkoutById = (id) => apiClient.get(`/workouts/${id}`);

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

// ── Onboarding ───────────────────────────────────────────────────────────────
export const saveOnboarding = (data) =>
  apiClient.put("/auth/complete-onboarding", data);

// ── AI ───────────────────────────────────────────────────────────────────────
export const askGemini = (prompt) => apiClient.post("/ai/gemini", { prompt });
export const generateWorkoutPlan = (goal) =>
  apiClient.post("/ai/generate-workout", { goal });
export const generateDietPlan = (preferences) =>
  apiClient.post("/ai/generate-diet", { preferences });

// ── Admin Management ──────────────────────────────────────────────────────────
export const adminGetUsers = () => apiClient.get("/auth/admin/users");
export const adminUpdateUserStatus = (id) =>
  apiClient.patch(`/auth/admin/users/${id}/status`);
export const adminDeleteUser = (id) =>
  apiClient.delete(`/auth/admin/users/${id}`);
