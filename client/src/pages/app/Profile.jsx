import { User, Users, Settings, Award, History, LayoutGrid, Calendar, TrendingUp, Star, Zap, Flame, ChevronRight, ShieldCheck, Target, Clock, Dumbbell, Trophy, Share2, Camera, Bell, Lock, LogOut, ChevronLeft, UserPlus, Heart, Check, Edit3 } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Card, Button, Avatar, Badge, cn } from "../../app/components/ui";
import { getUserAvatar } from "../../utils/avatar";

/* ─── Tabs config ───────────────────────────────────────────── */
const profileTabs = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "history", label: "History", icon: History },
  { id: "badges", label: "Badges", icon: Award },
  { id: "settings", label: "Settings", icon: Settings },
];

/* ─── Followers / Following Modal ───────────────────────────── */
function SocialModal({ type, onClose }) {
  const mockUsers = [
    { name: "Sahil Khan", handle: "@sahilkhan", avatar: "https://i.pravatar.cc/80?u=sahil", mutual: true },
    { name: "Yasmin K.", handle: "@yasmink", avatar: "https://i.pravatar.cc/80?u=yasmin", mutual: false },
    { name: "Rohan Mehra", handle: "@rohan_fit", avatar: "https://i.pravatar.cc/80?u=rohan", mutual: true },
    { name: "Priya Singh", handle: "@priya_runs", avatar: "https://i.pravatar.cc/80?u=priya", mutual: false },
    { name: "Dev Sharma", handle: "@dev_lifts", avatar: "https://i.pravatar.cc/80?u=dev", mutual: true },
  ];

  const [following, setFollowing] = useState(() => new Set(mockUsers.filter((u) => u.mutual).map((u) => u.handle)));

  const toggleFollow = (handle) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(handle)) next.delete(handle);
      else next.add(handle);
      return next;
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-900/20">
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-300 hover:bg-slate-800 transition-all bg-slate-900"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-base font-black text-white capitalize tracking-tight">{type}</h2>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-950">
        {mockUsers.map((u) => (
          <div
            key={u.handle}
            className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-900/60 hover:bg-slate-900/30 transition-colors"
          >
            <Avatar src={u.avatar} name={u.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{u.name}</p>
              <p className="text-xs text-slate-500 font-medium">{u.handle}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleFollow(u.handle)}
              className={cn(
                "text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all",
                following.has(u.handle)
                  ? "bg-slate-800 text-slate-400 border border-slate-700"
                  : "bg-blue-600 text-white shadow-md shadow-blue-900/30"
              )}
            >
              {following.has(u.handle) ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Settings Panel ────────────────────────────────────────── */
function SettingsPanel() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);

  const handleSaveName = () => {
    if (!name.trim()) return;
    updateUser({ name: name.trim() });
    setSaved(true);
    setEditing(false);
    toast.success("Profile updated!");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const settingRows = [
    {
      icon: Bell,
      label: "Push Notifications",
      desc: "Workout reminders and updates",
      action: <Toggle />,
    },
    {
      icon: Lock,
      label: "Private Account",
      desc: "Only approved followers see your posts",
      action: <Toggle />,
    },
    {
      icon: Share2,
      label: "Share Profile",
      desc: "Share your FitCircle link",
      action: <ChevronRight size={14} className="text-slate-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Edit profile */}
      <Card className="p-0 border-slate-900 bg-slate-900/30 overflow-hidden">
        <div className="p-6 border-b border-slate-800/50">
          <h3 className="text-sm font-black text-white tracking-widest uppercase">Edit Profile</h3>
        </div>
        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <Avatar
                src={getUserAvatar(user)}
                name={user?.name || "User"}
                size="xl"
                className="border-2 border-slate-700"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              <button
                type="button"
                className="text-xs text-blue-400 font-semibold mt-1 hover:underline"
                onClick={() => toast.info("Photo upload coming soon!")}
              >
                Change photo
              </button>
            </div>
          </div>

          {/* Name edit */}
          {editing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => { setEditing(false); setName(user?.name || ""); }}
                className="px-3 py-2 bg-slate-700 text-slate-300 rounded-xl text-xs font-black hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit display name</span>
              {saved && <Check size={13} className="text-emerald-400" />}
            </button>
          )}
        </div>
      </Card>

      {/* Settings rows */}
      <Card className="p-0 border-slate-900 bg-slate-900/30 overflow-hidden divide-y divide-slate-800/50">
        {settingRows.map((row) => (
          <div key={row.label} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-900/40 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
              <row.icon size={16} className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{row.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{row.desc}</p>
            </div>
            {row.action}
          </div>
        ))}
      </Card>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-400 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-rose-500/10 transition-colors active:scale-[0.98]"
      >
        <LogOut size={16} />
        Sign Out
      </button>

      <p className="text-center text-[10px] text-slate-600 pb-4">
        FitCircle Pro v1.0 • Mumbai, India
      </p>
    </div>
  );
}

/* ─── Mini toggle (purely visual) ──────────────────────────── */
function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative w-10 h-6 rounded-full transition-colors shrink-0",
        on ? "bg-blue-600" : "bg-slate-700"
      )}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        animate={{ left: on ? "1.25rem" : "0.25rem" }}
        transition={{ duration: 0.2 }}
      />
    </button>
  );
}

/* ─── Main Profile Component ────────────────────────────────── */
export function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [socialModal, setSocialModal] = useState(null); // "followers" | "following" | null
  const { user } = useAuth();

  const displayName = user?.name || "Alex Thompson";
  const avatarSrc = getUserAvatar(user);

  const socialStats = [
    { label: "Followers", value: "1.2k", onClick: () => setSocialModal("followers") },
    { label: "Following", value: "348", onClick: () => setSocialModal("following") },
    { label: "Posts", value: "84", onClick: null },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* ── Cover + Avatar ── */}
      <section className="relative h-56 md:h-72 w-full rounded-[32px] overflow-hidden group">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop"
          alt="Profile Cover"
          className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-0 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
          <div className="flex items-end gap-4">
            <div className="relative group/avatar cursor-pointer">
              <Avatar
                src={avatarSrc}
                name={displayName}
                size="2xl"
                className="border-4 border-slate-950 shadow-2xl rounded-[28px]"
              />
              <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-[28px] flex items-center justify-center">
                <Edit3 size={26} className="text-white drop-shadow-lg" />
              </div>
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white tracking-tight">{displayName}</h1>
                <Badge variant="accent" className="bg-blue-600 border-none px-2.5 py-0.5 text-[9px] tracking-widest font-black uppercase">
                  Elite
                </Badge>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-blue-500" />
                Mumbai, India • Joined Oct 2026
              </p>

              {/* Social stats */}
              <div className="flex items-center gap-4 mt-2">
                {socialStats.map(({ label, value, onClick }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={onClick}
                    disabled={!onClick}
                    className={cn(
                      "flex flex-col items-start transition-opacity",
                      onClick && "hover:opacity-80 cursor-pointer",
                      !onClick && "cursor-default"
                    )}
                  >
                    <span className="text-white font-black text-sm leading-none">{value}</span>
                    <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pb-1">
            <Button
              size="sm"
              className="rounded-xl h-9 px-4 shadow-blue-900/40 font-black uppercase text-[10px] tracking-wider"
              onClick={() => setActiveTab("settings")}
            >
              <Edit3 size={14} className="mr-1.5" /> Edit Profile
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl h-9 w-9 p-0 border-slate-800 bg-slate-900/50"
              onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Profile link copied!"); }}
            >
              <Share2 size={16} className="text-slate-400" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Quick stats ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Workouts", value: "124", icon: Zap, color: "text-blue-500", bg: "bg-blue-600/10" },
          { label: "Streak", value: "12", valueLabel: "days", icon: Flame, color: "text-orange-500", bg: "bg-orange-600/10" },
          { label: "XP Points", value: "8.4k", icon: Star, color: "text-amber-500", bg: "bg-amber-600/10" },
          { label: "Goal", value: "85%", icon: Target, color: "text-emerald-500", bg: "bg-emerald-600/10" },
        ].map((stat, idx) => (
          <Card key={idx} className="p-5 border-slate-900 bg-slate-900/30 flex flex-col items-center text-center group hover:border-blue-500/20 transition-all">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <div className="text-xl font-black text-white tracking-tight">
              {stat.value}
              {stat.valueLabel && (
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  {stat.valueLabel}
                </span>
              )}
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1.5">{stat.label}</div>
          </Card>
        ))}
      </section>

      {/* ── Tabs ── */}
      <section className="space-y-8">
        <div className="flex items-center justify-center gap-1 bg-slate-900/30 p-1.5 rounded-2xl border border-slate-900 w-fit mx-auto">
          {profileTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5",
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
              )}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Overview ── */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-5">
                <Card className="p-6 border-slate-900 bg-slate-900/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                    <TrendingUp size={100} strokeWidth={4} />
                  </div>
                  <h3 className="text-base font-black text-white tracking-tight uppercase mb-6">
                    Performance Insight
                  </h3>
                  <div className="space-y-6 relative z-10">
                    {[
                      { label: "Strength Training", progress: 85, color: "bg-blue-600" },
                      { label: "Cardio Health", progress: 62, color: "bg-purple-600" },
                      { label: "Flexibility", progress: 45, color: "bg-emerald-600" },
                      { label: "Protein Intake", progress: 92, color: "bg-cyan-600" },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">{item.label}</span>
                          <span className="text-white">{item.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className={cn("h-full rounded-full", item.color)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Card className="p-5 border-slate-900 bg-slate-900/30">
                    <h3 className="text-[11px] font-black text-white tracking-widest uppercase mb-4 flex items-center justify-between">
                      Active Trainers <Users className="text-blue-500 w-4 h-4" />
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: "Sahil Khan", role: "Pro Bodybuilder", avatar: "https://i.pravatar.cc/80?u=sahil" },
                        { name: "Yasmin K.", role: "Master Trainer", avatar: "https://i.pravatar.cc/80?u=yasmin" },
                      ].map((t) => (
                        <div key={t.name} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Avatar src={t.avatar} name={t.name} size="sm" />
                            <div>
                              <p className="text-xs font-bold text-white">{t.name}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.role}</p>
                            </div>
                          </div>
                          <ChevronRight size={13} className="text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5 border-slate-900 bg-slate-900/30">
                    <h3 className="text-[11px] font-black text-white tracking-widest uppercase mb-4 flex items-center justify-between">
                      Upcoming Sessions <Calendar className="text-purple-500 w-4 h-4" />
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "HIIT Session", time: "Tomorrow, 07:30 AM" },
                        { label: "Yoga Flow", time: "Wed, 06:00 PM" },
                      ].map((s) => (
                        <div key={s.label}>
                          <p className="text-xs font-bold text-white">{s.label}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{s.time}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              <div className="space-y-5">
                <Card className="p-0 border-slate-900 bg-slate-900/30 overflow-hidden">
                  <div className="p-5 border-b border-slate-800/50">
                    <h3 className="text-[11px] font-black text-white tracking-widest uppercase">Elite Badges</h3>
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((b) => (
                      <div key={b} className="aspect-square bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 group cursor-pointer hover:border-blue-500/50 transition-all">
                        <div className="w-9 h-9 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Award size={18} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-950/50 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab("badges")}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-400"
                    >
                      View All
                    </button>
                  </div>
                </Card>

                <Card className="p-5 border-slate-900 bg-blue-600 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-700">
                    <Flame size={70} strokeWidth={4} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-0.5">Active Membership</p>
                    <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none">FitCircle Pro+</h4>
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="text-xs font-bold text-white/90">Valid till</p>
                        <p className="text-xs font-black text-white uppercase tracking-widest">Oct 12, 2027</p>
                      </div>
                      <Button variant="accent" size="xs" className="bg-white text-blue-600 border-none rounded-lg font-black text-[10px] uppercase">
                        Renew
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* ── History ── */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {[
                { label: "Chest & Triceps", date: "Today", duration: "1h 15m", kcal: 540, xp: "+120" },
                { label: "Morning Cardio", date: "Yesterday", duration: "30m", kcal: 320, xp: "+80" },
                { label: "Full Body Mobility", date: "2 days ago", duration: "20m", kcal: 95, xp: "+45" },
                { label: "Leg Day Madness", date: "4 days ago", duration: "1h 30m", kcal: 780, xp: "+200" },
              ].map((h, idx) => (
                <Card key={idx} className="p-5 border-slate-900 bg-slate-900/30 flex items-center justify-between hover:bg-slate-900/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 text-blue-500 group-hover:scale-105 transition-transform">
                      <History size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{h.label}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{h.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-right">
                    <div className="hidden sm:block">
                      <p className="text-sm font-black text-white">{h.duration}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Duration</p>
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{h.kcal}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Kcal</p>
                    </div>
                    <p className="text-blue-500 font-black text-base group-hover:scale-110 transition-transform">{h.xp}</p>
                  </div>
                </Card>
              ))}
              <div className="text-center pt-4">
                <Button variant="outline" className="rounded-xl border-slate-800 text-xs font-black uppercase tracking-widest px-8">
                  Load More
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Badges ── */}
          {activeTab === "badges" && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {[
                { label: "Consistency King", desc: "10-day streak", icon: Flame, color: "text-orange-500", bg: "bg-orange-600/10" },
                { label: "Early Bird", desc: "Before 6 AM", icon: Clock, color: "text-blue-500", bg: "bg-blue-600/10" },
                { label: "Power Lifter", desc: "100kg+ squat", icon: Zap, color: "text-amber-500", bg: "bg-amber-600/10" },
                { label: "Yoga Master", desc: "10 hours session", icon: Star, color: "text-purple-500", bg: "bg-purple-600/10" },
                { label: "Elite Member", desc: "Level 20 reached", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-600/10" },
                { label: "Champion", desc: "Tournament winner", icon: Trophy, color: "text-rose-500", bg: "bg-rose-600/10" },
              ].map((b, idx) => (
                <Card key={idx} className="p-6 border-slate-900 bg-slate-900/30 flex flex-col items-center text-center group hover:border-blue-500/20 transition-all">
                  <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center mb-4 border border-slate-800 transition-all group-hover:scale-110 group-hover:rotate-6", b.bg, b.color)}>
                    <b.icon size={32} />
                  </div>
                  <p className="text-white font-black uppercase tracking-tight text-sm mb-1">{b.label}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{b.desc}</p>
                </Card>
              ))}
            </motion.div>
          )}

          {/* ── Settings ── */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SettingsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Social Modal (followers / following) ── */}
      <AnimatePresence>
        {socialModal && (
          <SocialModal type={socialModal} onClose={() => setSocialModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Profile;
