import React, { createContext, useContext, useState, useCallback } from "react";
import { askGemini, generateWorkoutPlan, generateDietPlan } from "../api/endpoints";
import { toast } from "sonner";

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const generateWorkout = useCallback(async (goal) => {
    setLoading(true);
    try {
      const { data } = await generateWorkoutPlan(goal);
      setResponse(data);
      toast.success("AI generated a new workout plan for you");
      return data;
    } catch (error) {
      toast.error("AI was unable to generate a workout plan");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateDiet = useCallback(async (preferences) => {
    setLoading(true);
    try {
      const { data } = await generateDietPlan(preferences);
      setResponse(data);
      toast.success("AI generated a new diet plan for you");
      return data;
    } catch (error) {
      toast.error("AI was unable to generate a diet plan");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const askAnything = useCallback(async (prompt) => {
    setLoading(true);
    try {
      const { data } = await askGemini(prompt);
      toast.success("AI Assistant has responded");
      return data;
    } catch (error) {
      toast.error("AI Assistant is currently unavailable");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    loading,
    response,
    generateWorkout,
    generateDiet,
    askAnything,
    clearResponse: () => setResponse(null),
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) throw new Error("useAI must be used within AIProvider");
  return context;
};
