import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Gateway URL
  withCredentials: true,
});

// Adding request interceptor for tokens if required (already handled by cookies in some cases)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("fitcircle_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
