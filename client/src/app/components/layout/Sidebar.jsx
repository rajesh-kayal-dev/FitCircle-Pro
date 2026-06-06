import React from "react";
import { Link, useLocation } from "react-router";
import { Home, Compass, Dumbbell, Utensils, ShoppingBag, User, Flame, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "../Logo";
import { cn } from "../ui";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { getUserAvatar } from "../../../utils/avatar";

const navItems = [
  { id: "home", label: "Feed", icon: Home, path: "/home", activeColor: "text-brand-orange", activeBg: "bg-brand-orange/10" },
  { id: "search", label: "Explore", icon: Compass, path: "/search", activeColor: "text-brand-purple", activeBg: "bg-brand-purple/10" },
  { id: "workouts", label: "Workouts", icon: Dumbbell, path: "/workouts", activeColor: "text-brand-red", activeBg: "bg-brand-red/10" },
  { id: "diet", label: "Diet", icon: Utensils, path: "/diet", activeColor: "text-brand-green", activeBg: "bg-brand-green/10" },
  { id: "buy", label: "Store", icon: ShoppingBag, path: "/products", activeColor: "text-brand-amber", activeBg: "bg-brand-amber/10" },
  { id: "profile", label: "Profile", icon: User, path: "/profile", activeColor: "text-brand-cyan", activeBg: "bg-brand-cyan/10" },
];

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const avatarSrc = getUserAvatar(user);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen fixed left-0 top-0 z-[60] bg-white border-r border-gray-100 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-[260px]"
      )}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none opacity-50" />

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm z-50 hover:bg-gray-50 cursor-pointer transition-transform hover:scale-110"
      >
        {isCollapsed ? <ChevronRight size={14} className="text-brand-muted" /> : <ChevronLeft size={14} className="text-brand-muted" />}
      </button>

      <div className="relative z-10 flex flex-col h-full py-6 px-4">
        {/* Logo Section */}
        <div className={cn("flex items-center gap-3 mb-8 transition-all px-2", isCollapsed ? "justify-center" : "")}>
          <div className="relative">
            <div className="absolute inset-0 bg-brand-orange/20 rounded-2xl blur-md" />
            <div className="relative"><Logo size={isCollapsed ? "sm" : "md"} /></div>
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-lg font-black tracking-tight text-brand-text leading-none">FitCircle</span>
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange leading-none mt-0.5">PRO</span>
            </motion.div>
          )}
        </div>

        {/* Profile Card (Desktop Only, Visible when expanded) */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 px-2"
            >
              <div className="flex flex-col items-center p-4 rounded-[2rem] bg-gray-50/50 border border-gray-100/50">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-[2rem] overflow-hidden ring-4 ring-white shadow-xl shadow-brand-orange/10">
                    <img src={avatarSrc} alt={user?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-green rounded-full border-4 border-white" title="Online" />
                </div>

                <h3 className="text-base font-black text-brand-text mb-0.5">{user?.name || "Fitness Fan"}</h3>
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-4">
                  {user?.location || "Fitness Enthusiast"}
                </p>

                <div className="grid grid-cols-3 gap-4 w-full border-t border-gray-100 pt-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-brand-text leading-none">46</span>
                    <span className="text-[8px] font-black text-brand-muted uppercase tracking-tighter mt-1">Posts</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-gray-100 px-1">
                    <span className="text-xs font-black text-brand-text leading-none">2.8k</span>
                    <span className="text-[8px] font-black text-brand-muted uppercase tracking-tighter mt-1">Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-brand-text leading-none">526</span>
                    <span className="text-[8px] font-black text-brand-muted uppercase tracking-tighter mt-1">Following</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar px-1">
          {navItems.map((item) => {
            // Hide "Profile" on desktop sidebar (it's at the top card now)
            if (item.id === "profile") return null;

            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (isCollapsed) {
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 mx-auto rounded-2xl transition-all duration-200 group cursor-pointer",
                    isActive
                      ? `${item.activeBg} ${item.activeColor} shadow-md shadow-brand-orange/5`
                      : "text-brand-muted hover:bg-gray-50 hover:text-brand-text"
                  )}
                  title={item.label}
                >
                  <Icon className={cn("w-5 h-5", isActive ? item.activeColor : "")} strokeWidth={isActive ? 2.5 : 2} />
                </Link>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group cursor-pointer",
                  isActive
                    ? `${item.activeBg} ${item.activeColor} font-bold`
                    : "text-brand-muted hover:bg-gray-50 hover:text-brand-text"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all relative",
                  isActive ? item.activeBg : "group-hover:bg-gray-100"
                )}>
                  <Icon className={cn("w-5 h-5", isActive ? item.activeColor : "")} strokeWidth={isActive ? 2.5 : 2} />
                  {item.id === "buy" && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </div>
                <span className={cn("text-sm", isActive ? "font-black" : "font-semibold")}>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className={cn("ml-auto w-1.5 h-4 rounded-full", item.activeColor.replace("text-", "bg-"))}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section at bottom */}
        <div className="mt-4 pt-4 border-t border-gray-100 px-1">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full transition-all duration-200 group cursor-pointer text-brand-red py-3 rounded-2xl hover:bg-red-50",
              isCollapsed ? "justify-center" : "px-4"
            )}
            title="Logout"
          >
            <div className="p-1.5 rounded-xl group-hover:bg-red-100/50 transition-all">
              <LogOut size={18} strokeWidth={2.5} />
            </div>
            {!isCollapsed && <span className="text-sm font-black uppercase tracking-wider">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
