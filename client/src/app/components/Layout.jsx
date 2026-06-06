import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { useCart } from "../../context/CartContext";
import { User, Settings, LogOut, Plus, Home, Compass, Dumbbell, Utensils, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMessaging } from "../../context/MessagingContext";
import { useAuth } from "../../context/AuthContext";
import { useMusic } from "../../context/MusicContext";
import { MusicPlayer } from "./music/MusicPlayer";
import { CreatePostModal } from "./feed/CreatePostModal";
import { cn } from "./ui";
import { Sidebar } from "./layout/Sidebar";
import { Header } from "./layout/Header";

const mobileNavItems = [
  { id: "home", label: "Feed", icon: Home, path: "/home", activeColor: "text-brand-orange", activeBg: "bg-brand-orange/10" },
  { id: "search", label: "Explore", icon: Compass, path: "/search", activeColor: "text-brand-purple", activeBg: "bg-brand-purple/10" },
  { id: "workouts", label: "Workouts", icon: Dumbbell, path: "/workouts", activeColor: "text-brand-red", activeBg: "bg-brand-red/10" },
  { id: "diet", label: "Diet", icon: Utensils, path: "/diet", activeColor: "text-brand-green", activeBg: "bg-brand-green/10" },
  { id: "buy", label: "Store", icon: ShoppingBag, path: "/products", activeColor: "text-brand-amber", activeBg: "bg-brand-amber/10" },
  // { id: "profile", label: "Profile", icon: User, path: "/profile", activeColor: "text-brand-cyan", activeBg: "bg-brand-cyan/10" },
];

function ProfileDropdown({ user, onClose }) {
  const { logout } = useAuth();
  const handleLogout = () => { logout(); onClose(); window.location.href = "/login"; };

  const items = [
    { label: "My Account", icon: User, action: () => { window.location.href = "/profile"; onClose(); } },
    { label: "Settings", icon: Settings, action: () => { window.location.href = "/settings"; onClose(); } },
    { label: "Logout", icon: LogOut, action: handleLogout, danger: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/10 overflow-hidden z-50 text-brand-text"
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-black truncate">{user?.name || "User"}</p>
        <p className="text-xs text-brand-muted font-medium truncate">{user?.email}</p>
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={item.action}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer hover:bg-gray-50",
              item.danger ? "text-brand-red hover:bg-red-50" : "text-brand-text"
            )}
          >
            <Icon size={15} className={item.danger ? "text-brand-red" : "text-brand-muted"} />
            {item.label}
          </button>
        );
      })}
    </motion.div>
  );
}

export const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dropdownRef = useRef(null);
  const { totalUnread } = useMessaging();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowMobileNav(currentScrollY <= lastScrollY || currentScrollY <= 80);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text w-full max-w-[100vw]">
      {/* ── Desktop Sidebar (Fixed) ── */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* ── Main content area ── */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out",
          "lg:ml-[260px]",
          isCollapsed && "lg:ml-20"
        )}
      >
        <Header
          user={user}
          totalUnread={totalUnread}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          dropdownRef={dropdownRef}
          ProfileDropdown={ProfileDropdown}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 pb-28 lg:pb-8 pt-6">
          <Outlet />
        </main>
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {showMobileNav && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setCreatePostOpen(true)}
            className="fixed bottom-28 right-5 lg:bottom-8 lg:right-8 z-50 w-14 h-14 energy-gradient text-white rounded-2xl flex items-center justify-center shadow-xl shadow-brand-orange/30 cursor-pointer"
          >
            <Plus size={24} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <AnimatePresence>
          {showMobileNav && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mx-3 mb-3 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl shadow-black/10 rounded-3xl px-2 py-2 flex justify-around items-center"
            >
              {mobileNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-2xl min-w-[48px] transition-all cursor-pointer"
                  >
                    <div className={cn("p-1.5 rounded-xl transition-all relative", isActive ? item.activeBg : "")}>
                      <Icon
                        className={cn("w-5 h-5 transition-colors", isActive ? item.activeColor : "text-brand-muted")}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      {item.id === "buy" && totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-white text-[9px] font-black rounded-full flex items-center justify-center">
                          {totalItems > 9 ? "9+" : totalItems}
                        </span>
                      )}
                    </div>
                    <span className={cn("text-[9px] font-black transition-colors", isActive ? item.activeColor : "text-brand-muted")}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CreatePostModal open={createPostOpen} onClose={() => setCreatePostOpen(false)} onPost={() => { }} />
      <MusicPlayer />
    </div>
  );
};
