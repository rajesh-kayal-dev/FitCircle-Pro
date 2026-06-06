import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Logo } from "../app/components/Logo";

export function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-white to-gray-100 flex items-center justify-center overflow-hidden">
      <motion.div 
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ filter: "blur(10px)", opacity: 0 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-full w-40 h-40 flex items-center justify-center"
        >
          <Logo size="splash" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg]"
            initial={{ left: "-150%" }}
            animate={{ left: "200%" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-2xl font-black text-brand-text tracking-tight">
            Build Your Strongest Self
          </h1>
        </motion.div>
      </motion.div>
    </div>
  );
}
