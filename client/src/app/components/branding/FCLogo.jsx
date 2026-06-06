import React from "react";
import { motion } from "motion/react";
import { cn } from "../ui";

export function FCLogo({ size = "md", animated = false, className }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    "2xl": "w-32 h-32"
  };

  const Container = animated ? motion.div : "div";
  const animationProps = animated ? {
    initial: { rotateY: 0 },
    animate: { rotateY: 360 },
    transition: { duration: 1.5, ease: "easeInOut", delay: 0.3 }
  } : {};

  return (
    <Container
      className={cn("relative flex items-center justify-center", sizes[size], className)}
      style={{ perspective: "1000px" }}
      {...animationProps}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="metallic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        <path
          d="M 70 20 Q 85 35, 85 50 Q 85 65, 70 80 L 65 75 Q 77 63, 77 50 Q 77 37, 65 25 Z"
          fill="url(#metallic-gradient)"
          filter="url(#shadow)"
          strokeWidth="0"
        />

        <path
          d="M 30 20 L 45 20 L 45 48 L 65 48 L 65 56 L 45 56 L 45 80 L 30 80 Z"
          fill="url(#metallic-gradient)"
          filter="url(#shadow)"
          strokeWidth="0"
        />
      </svg>

      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "200%", opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.2, delay: 1, ease: "easeInOut" }}
          style={{ mixBlendMode: "overlay" }}
        />
      )}
    </Container>
  );
}
