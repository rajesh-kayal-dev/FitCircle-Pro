import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Logo } from "./components/Logo";

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("fitcircle_token");
      if (token) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    }, 2600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-white via-slate-50 to-gray-100 flex items-center justify-center overflow-hidden">
      {/* Radial ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ filter: "blur(12px)", opacity: 0 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Logo + shine sweep */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-full w-40 h-40 flex items-center justify-center"
        >
          <Logo size="splash" />
          {/* Metallic shine sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ skewX: "-30deg" }}
            initial={{ x: "-150%" }}
            animate={{ x: "250%" }}
            transition={{ duration: 1.4, ease: "easeInOut", delay: 0.6 }}
          />
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.65, ease: "easeOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-3xl font-black tracking-tight text-brand-text">
            FitCircle <span className="text-brand-orange">Pro</span>
          </span>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.55 }}
            className="text-brand-muted text-sm font-semibold tracking-wide"
          >
            Build Your Strongest Self
          </motion.p>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block rounded-full bg-brand-orange"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
              style={{ width: 6, height: 6 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
