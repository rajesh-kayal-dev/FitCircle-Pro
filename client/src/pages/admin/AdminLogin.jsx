import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Logo } from "../../app/components/Logo";
import { useAuth } from "../../context/AuthContext";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin, isAuthenticated, isAdmin } = useAuth();

  /* redirect if already admin */
  useEffect(() => {
    if (isAuthenticated && isAdmin) navigate("/admin", { replace: true });
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await adminLogin(email, password);
      toast.success("Welcome back, Admin! 👋");
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid admin credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-indigo-50/60 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Logo size="md" />
          <p className="mt-3 text-xl font-black text-gray-900 tracking-tight">
            FitCircle <span className="text-blue-600">Admin</span>
          </p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Restricted access — admin only</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-7">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <ShieldCheck size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900">Admin Sign In</h2>
              <p className="text-[11px] text-gray-400">Use your admin credentials</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Email</label>
              <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-500 transition-colors">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
                  placeholder="admin@fitcirclepro.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Password</label>
              <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-500 transition-colors">
                <Lock size={16} className="text-gray-400 shrink-0" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-12 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

      </motion.div>
    </div>
  );
}
