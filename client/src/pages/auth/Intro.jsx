import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Logo } from '../../app/components/branding/Logo';
import { ArrowRight, Zap, Target, Users, Shield, Sparkles } from "lucide-react";
import { Button } from '../../components/ui';

export function Intro() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    localStorage.setItem("token", "true");
    navigate("/feed");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#020617]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <Logo size="xl" className="flex-col !gap-4" />
              <div className="h-1 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-1/2 bg-primary shadow-[0_0_15px_rgba(30,64,175,0.5)]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative min-h-screen flex flex-col z-10">
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <Logo />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleEnter} className="hidden sm:flex font-bold uppercase tracking-widest text-[11px]">Sign In</Button>
            <Button onClick={handleEnter} className="rounded-full px-8 font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20">Join Now</Button>
          </div>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-blue-100 dark:border-blue-800 shadow-sm">
              <Sparkles size={12} className="fill-current" />
              <span>Next-Gen Indian Fitness</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[0.9] uppercase">
              The Steel <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-blue-400">Standard</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Join India's most elite fitness circle. Premium programs, world-class influencers, and invisible AI that works for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Button
                onClick={handleEnter}
                className="group h-16 px-10 rounded-full shadow-2xl shadow-primary/40 flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
              >
                Access Platform
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="h-16 px-10 rounded-full text-sm font-bold uppercase tracking-widest border-2">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 w-full"
          >
            {[
              { icon: Zap, label: "Real-time AI", val: "2.4ms" },
              { icon: Users, label: "Top Coaches", val: "150+" },
              { icon: Target, label: "Precision", val: "99.8%" },
              { icon: Shield, label: "Premium", val: "Pro" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 text-center">
                <div className="text-slate-400 mb-3 flex justify-center">
                  <stat.icon size={20} />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tighter">{stat.val}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </main>
      </div>

      {/* Aesthetic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-slate-200/30 dark:bg-slate-800/10 rounded-full blur-[100px]" />

        {/* Steel Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
    </div>
  );
}
