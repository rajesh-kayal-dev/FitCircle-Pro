import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Dumbbell, Search, User, LogOut, Menu, Bell, Sparkles, Utensils, ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, Input, Button } from "../ui";

const navItems = [
  { icon: LayoutDashboard, label: "Feed", href: "/app/feed" },
  { icon: Search, label: "Discovery", href: "/app/search" },
  { icon: Dumbbell, label: "Workouts", href: "/app/workouts" },
  { icon: Utensils, label: "Diet Plan", href: "/app/diet-planner" },
  { icon: User, label: "Profile", href: "/app/profile" },
];

export function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-100 z-50 transition-all duration-300 ${isSidebarOpen ? "w-[280px]" : "w-0 lg:w-[80px]"
          } overflow-hidden flex flex-col`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
            <Dumbbell className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-lg tracking-tight">
              FitCircle <span className="text-blue-600">Pro</span>
            </span>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "group-hover:text-slate-600"}`} />
                {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group">
            <LogOut className="w-5 h-5 group-hover:text-rose-600" />
            {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main
        className={`transition-all duration-300 ${isSidebarOpen ? "lg:pl-[280px]" : "lg:pl-[80px]"
          }`}
      >
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={toggleSidebar}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="max-w-md w-full hidden sm:block">
              <Input icon={Search} placeholder="Search anything..." />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative group">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform" />
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2" />
            <Link to="/app/profile" className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-tight group-hover:text-blue-600 transition-colors">Saket Gokhale</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Premium Member</p>
              </div>
              <Avatar src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2040&auto=format&fit=crop" name="SG" className="ring-2 ring-transparent group-hover:ring-blue-100 transition-all" />
            </Link>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10 max-w-[1600px] mx-auto">
          <div className="flex-1 min-w-0">
            {children}
          </div>

          <aside className="hidden xl:flex flex-col w-[320px] shrink-0 gap-6">
            <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Recommended for you</h3>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
              <div className="space-y-4">
                {[
                  { name: "Yash Anand", role: "Athlete", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop" },
                  { name: "Radhika Bose", role: "Yoga Expert", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2040&auto=format&fit=crop" },
                  { name: "Jeet Selal", role: "Bodybuilder", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1470&auto=format&fit=crop" }
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.img} name={user.name} size="sm" />
                      <div>
                        <p className="text-sm font-bold group-hover:text-blue-600 transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                      <Plus size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-blue-600 text-xs py-2">View More Suggestions</Button>
            </section>

            <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles size={48} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Upgrade to Pro</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">Get personalized diet plans, AI training assistant, and exclusive Indian athlete content.</p>
              <Button size="sm" className="w-full">Get Started</Button>
            </section>
          </aside>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 px-4 py-2 flex items-center justify-around lg:hidden z-50">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? "text-blue-600" : "text-slate-400"
                }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
