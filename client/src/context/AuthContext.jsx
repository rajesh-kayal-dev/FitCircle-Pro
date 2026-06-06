import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  sendOtp,
  verifyOtp,
  googleLogin as googleLoginApi,
  adminLoginApi,
  saveOnboarding as saveOnboardingApi,
} from "../api/endpoints";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("fitcircle_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("fitcircle_token"));

  /* ── Core login: saves user + token to state & localStorage ── */
  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("fitcircle_user", JSON.stringify(userData));
    localStorage.setItem("fitcircle_token", authToken);
  }, []);

  /* ── Logout: clears everything ── */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fitcircle_user");
    localStorage.removeItem("fitcircle_token");
    toast.info("Logged out successfully");
  }, []);

  /* ── Send OTP (does NOT log user in) ── */
  const sendOTP = useCallback(async (email) => {
    try {
      await sendOtp(email);
      return true;
    } catch (error) {
      console.error("AuthContext - Send OTP Error:", error);
      throw error;
    }
  }, []);

  /* ── Verify OTP → receives token → user is NOW logged in ── */
  const verifyOTP = useCallback(
    async (email, otp) => {
      try {
        const response = await verifyOtp(email, otp);
        const { user: userData, token: authToken, isNewUser } = response.data;
        login(userData, authToken);
        return { isNewUser };
      } catch (error) {
        throw error;
      }
    },
    [login]
  );

  /* ── Google Login → sends OTP → does NOT log user in yet ── */
  const loginWithGoogle = useCallback(
    async (credential) => {
      try {
        if (!credential) throw new Error("No credential");
        const response = await googleLoginApi(credential);
        
        // Backend sends OTP to Google email — no token issued yet
        if (response.data.otpSent) {
          toast.success("Verification code sent to your Google email!");
          return { otpSent: true, email: response.data.email };
        }

        // Fallback: if backend directly returns token (shouldn't happen with new flow)
        const { user: userData, token: authToken, isNewUser } = response.data;
        login(userData, authToken);
        toast.success("Signed in with Google!");
        return { isNewUser };
      } catch (error) {
        console.error("Google Auth Error:", error);
        toast.error("Google sign-in failed!");
        throw error;
      }
    },
    [login]
  );

  /* ── Admin Login ── */
  const adminLogin = useCallback(
    async (email, password) => {
      try {
        const response = await adminLoginApi(email, password);
        const { user: userData, token: authToken } = response.data;
        login(userData, authToken);
        return true;
      } catch (error) {
        console.error("Admin Login Failed:", error);
        throw error;
      }
    },
    [login]
  );

  /* ── Complete Onboarding → updates user with isOnboarded=true ── */
  const completeOnboarding = useCallback(
    async (data) => {
      try {
        const response = await saveOnboardingApi(data);
        const updatedUser = response.data.user;
        
        // Ensure isOnboarded is true in local state
        const userData = { ...updatedUser, isOnboarded: true };
        setUser(userData);
        localStorage.setItem("fitcircle_user", JSON.stringify(userData));
        
        toast.success("Onboarding completed!");
      } catch (error) {
        console.error("Onboarding Error:", error);
        toast.error("Failed to save onboarding data");
        throw error;
      }
    },
    []
  );

  /* ── Update user helper ── */
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("fitcircle_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role?.toUpperCase() === "ADMIN",
        isOnboarded: !!user?.isOnboarded,
        sendOTP,
        verifyOTP,
        loginWithGoogle,
        adminLogin,
        completeOnboarding,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
