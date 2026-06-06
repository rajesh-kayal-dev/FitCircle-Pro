import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { LayoutDashboard, Search, Dumbbell, Utensils, ShoppingBag, User } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../ui";

const navItems = [
  { icon: LayoutDashboard, label: "Home", path: "/feed" },
  { icon: Search, label: "Search", path: "/explore" },
  { icon: Dumbbell, label: "Workouts", path: "/workouts" },
  { icon: Utensils, label: "Diet", path: "/diet" },
  { icon: ShoppingBag, label: "Buy", path: "/buy" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 z-40 safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 py-2 px-1 group"
            >
              <div className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                isActive && "scale-105"
              )}>
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                    : "text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-100"
                )}>
                  <item.icon size={20} strokeWidth={2.5} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold transition-colors",
                  isActive ? "text-orange-600" : "text-gray-400"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
