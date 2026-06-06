import { Settings, LogOut, Clock, Flame, Zap, Share, ChevronRight, Trophy, Star, Heart, MessageCircle, BookOpen, Send, Users, X, Check, Camera, Bell, Lock, ChevronLeft, User, UserPlus, Edit2 } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { uploadProfileImage } from "../api/userApi";
import { useRef } from "react";

/* ── Static data ─────────────────────────────────────────────── */
const stats = [
  { label: "Weight", value: "78.4", unit: "kg", change: "-2.1", color: "text-accent-orange" },
  { label: "Body Fat", value: "14.2", unit: "%", change: "-0.5", color: "text-accent-red" },
  { label: "Strength", value: "320", unit: "kg", change: "+15", color: "text-accent-green" },
  { label: "Active", value: "24", unit: "days", change: "+4", color: "text-slate-800" },
];

const achievements = [
  { id: 1, name: "Early Riser", date: "Mar 12, 2026", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
  { id: 2, name: "Protein Master", date: "Mar 08, 2026", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
  { id: 3, name: "Workout Warrior", date: "Mar 02, 2026", icon: Trophy, color: "text-blue-500", bg: "bg-blue-50" },
];

const myPosts = [
  { id: 1, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop", likes: 1245, comments: 89 },
  { id: 2, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", likes: 856, comments: 42 },
  { id: 3, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop", likes: 2103, comments: 156 },
  { id: 4, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop", likes: 743, comments: 31 },
  { id: 5, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop", likes: 1820, comments: 98 },
  { id: 6, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", likes: 425, comments: 19 },
];

const myDrafts = [
  { id: 1, image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=200&h=200&fit=crop", caption: "Tomorrow's leg day prep… the grind continues 🦵 #legday #fitness", savedAt: "2h ago" },
  { id: 2, image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=200&h=200&fit=crop", caption: "New supplement stack review coming soon 💪 #nutrition #supplements", savedAt: "1d ago" },
  { id: 3, image: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=200&h=200&fit=crop", caption: "Morning run stats: 10k in 48 min! 🏃 #running #cardio #progress", savedAt: "2d ago" },
];

const workoutHistory = [
  { id: 1, name: "Push Day A", date: "Yesterday, 6:30 PM", duration: "55m", kcal: "420", type: "Strength" },
  { id: 2, name: "Steady State Cardio", date: "Mar 19, 2026", duration: "30m", kcal: "610", type: "Cardio" },
  { id: 3, name: "Full Body Mobility", date: "Mar 18, 2026", duration: "45m", kcal: "180", type: "Yoga" },
];

const SOCIAL_USERS = [
  { name: "Sahil Khan", handle: "@sahilkhan", avatar: "https://i.pravatar.cc/80?u=sahil" },
  { name: "Yasmin K.", handle: "@yasmink", avatar: "https://i.pravatar.cc/80?u=yasmin" },
  { name: "Rohan Mehra", handle: "@rohan_fit", avatar: "https://i.pravatar.cc/80?u=rohan" },
  { name: "Priya Singh", handle: "@priya_runs", avatar: "https://i.pravatar.cc/80?u=priya" },
  { name: "Dev Sharma", handle: "@dev_lifts", avatar: "https://i.pravatar.cc/80?u=dev" },
];

/* ── Social list modal ──────────────────────────────────────── */
function SocialModal({ type, onClose }) {
  const [following, setFollowing] = useState(() => new Set(["@sahilkhan", "@rohan_fit"]));
  const navigate = useNavigate();

  const toggle = (e, handle) => {
    e.stopPropagation();
    setFollowing((prev) => {
      const next = new Set(prev);
      next.has(handle) ? next.delete(handle) : next.add(handle);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center lg:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white w-full sm:max-w-sm rounded-t-[2rem] sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h3 className="font-black text-slate-900 capitalize">{type}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 bg-white">
          {SOCIAL_USERS.map((u) => (
            <div
              key={u.handle}
              onClick={() => {
                onClose();
                navigate(`/user/${u.handle.replace('@', '')}`);
              }}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 cursor-pointer"
            >
              <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden shadow-sm bg-gray-100 border border-gray-200">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{u.name}</p>
                <p className="text-xs text-slate-500 font-medium">{u.handle}</p>
              </div>
              <button
                onClick={(e) => toggle(e, u.handle)}
                className={[
                  "text-[10px] sm:text-[11px] flex-shrink-0 font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all",
                  following.has(u.handle)
                    ? "bg-gray-100 text-slate-500 hover:bg-gray-200"
                    : "bg-slate-900 text-white hover:bg-brand-orange",
                ].join(" ")}
              >
                {following.has(u.handle) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Settings panel ─────────────────────────────────────────── */
function SettingsPanel({ onClose }) {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "Arjun Sharma");
  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  const saveName = () => {
    if (!name.trim()) return;
    updateUser?.({ name: name.trim() });
    toast.success("Name updated!");
    setEditingName(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Profile edit */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-900">Edit Profile</h4>
          <button onClick={onClose} className="text-[11px] text-slate-400 font-semibold hover:text-slate-600">Done</button>
        </div>
        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"}
                alt="avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100"
              />
              <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={16} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{name}</p>
              <p className="text-xs text-slate-400">{user?.email || "user@example.com"}</p>
              <button
                className="text-xs text-brand-orange font-semibold mt-1 hover:underline"
                onClick={() => toast.info("Photo upload coming soon!")}
              >
                Change photo
              </button>
            </div>
          </div>

          {/* Edit name */}
          {editingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                autoFocus
                className="flex-1 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-orange transition-colors"
              />
              <button onClick={saveName} className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-brand-orange transition-colors">Save</button>
              <button onClick={() => setEditingName(false)} className="px-3 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-black"></button>
            </div>
          ) : (
            <button onClick={() => setEditingName(true)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
              <Edit2 size={13} /> Edit display name
            </button>
          )}
        </div>
      </div>

      {/* Settings rows */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm divide-y divide-slate-50">
        {[
          {
            icon: Bell,
            label: "Push Notifications",
            desc: "Reminders & updates",
            action: (
              <button
                onClick={() => setNotifications((v) => !v)}
                className={["relative w-10 h-6 rounded-full transition-colors", notifications ? "bg-brand-orange" : "bg-slate-200"].join(" ")}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                  animate={{ left: notifications ? "1.25rem" : "0.25rem" }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            ),
          },
          {
            icon: Lock,
            label: "Private Account",
            desc: "Only followers see your posts",
            action: (
              <button
                onClick={() => setPrivateAccount((v) => !v)}
                className={["relative w-10 h-6 rounded-full transition-colors", privateAccount ? "bg-brand-orange" : "bg-slate-200"].join(" ")}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                  animate={{ left: privateAccount ? "1.25rem" : "0.25rem" }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            ),
          },
          {
            icon: Share,
            label: "Share Profile",
            desc: "Copy your FitCircle link",
            action: <ChevronRight size={14} className="text-slate-300" />,
            onClick: () => {
              navigator.clipboard?.writeText(window.location.href);
              toast.success("Profile link copied!");
            },
          },
        ].map((row) => (
          <button
            key={row.label}
            onClick={row.onClick}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
              <row.icon size={15} className="text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">{row.label}</p>
              <p className="text-[11px] text-slate-400">{row.desc}</p>
            </div>
            {row.action}
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl border border-red-200 bg-red-50 text-red-500 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-100 transition-colors active:scale-[0.98]"
      >
        <LogOut size={15} /> Sign Out
      </button>

      <p className="text-center text-[10px] text-slate-300 pb-2">FitCircle Pro v1.0</p>
    </motion.div>
  );
}

/* ── Main Profile ────────────────────────────────────────────── */
const TABS = ["posts", "drafts", "achievements"];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [socialModal, setSocialModal] = useState(null); // 'followers' | 'following' | null
  const [selectedPost, setSelectedPost] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch full profile on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await import("../api/userApi").then(m => m.getUserProfile());
        setProfileData(profile);
      } catch (err) {
        console.error("Profile page load error:", err);
      }
    };
    fetchProfile();
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) return toast.error("File must be under 2MB");
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      return toast.error("Use JPG or PNG");
    }

    setUploading(true);
    try {
      const result = await uploadProfileImage(file);
      updateUser({ profileImage: result.profileImage, avatar: result.profileImage });
      toast.success("Profile updated ✅");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  const displayName = user?.name || "Arjun Sharma";
  const displayAvatar = user?.profileImage || user?.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200";

  return (
    <div className="max-w-screen-xl mx-auto p-3 sm:p-4 lg:p-8 w-full overflow-x-hidden">
      <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-8 lg:p-12 mb-8 sm:mb-10 shadow-sm shadow-slate-200/50 w-full">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 w-full">
          <div className="flex items-center sm:items-start gap-4 sm:gap-8 w-full">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div 
                onClick={handleImageClick}
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden p-[3px] sm:p-1 lg:p-1.5 bg-gradient-to-tr from-yellow-400 via-brand-orange to-purple-500 shadow-xl cursor-pointer hover:scale-[1.02] transition-transform relative"
              >
                <div className="w-full h-full rounded-full border-2 sm:border-4 border-white overflow-hidden bg-white relative">
                  <img
                    src={displayAvatar}
                    alt="Profile"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${uploading ? "opacity-30" : "opacity-100"}`}
                  />
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={handleImageClick}
                disabled={uploading}
                className="absolute -bottom-1 -right-0 sm:-bottom-1 sm:-right-0 p-2 sm:p-3 bg-slate-900 text-white rounded-full shadow-xl hover:bg-brand-orange transition-all ring-2 sm:ring-4 ring-white z-10 disabled:opacity-50"
              >
                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter truncate">
                  {displayName}
                </h1>
                <div className="px-2 py-0.5 bg-brand-orange/10 text-brand-orange rounded-full text-[8px] sm:text-[10px] font-black tracking-widest uppercase shrink-0">
                  PRO
                </div>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-400 font-medium mb-1.5 truncate">
                {profileData?.location || "Fitness Enthusiast • Location Not Set"}
              </p>

              <p className="text-xs sm:text-sm text-slate-700 font-medium mb-3 line-clamp-2">
                {profileData?.bio || "Fitness enthusiast & digital creator. Let's build your best self together! 🚀"}
              </p>

              {/* ── Followers / Following / Posts ── */}
              <div className="flex items-center justify-between sm:justify-start sm:gap-6 w-full max-w-[240px]">
                {[
                  { label: "Followers", value: "1.2k", type: "followers" },
                  { label: "Following", value: "348", type: "following" },
                  { label: "Posts", value: "84", type: null },
                ].map(({ label, value, type }) => (
                  <button
                    key={label}
                    type="button"
                    disabled={!type}
                    onClick={() => type && setSocialModal(type)}
                    className={[
                      "flex flex-col items-center sm:items-start transition-opacity",
                      type ? "cursor-pointer hover:opacity-70" : "cursor-default",
                    ].join(" ")
                    }
                  >
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none">{value}</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full lg:w-max shrink-0 mt-6 lg:mt-0">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-slate-50 p-4 sm:p-5 rounded-[1.5rem] sm:rounded-3xl border border-slate-100 flex flex-col justify-center items-start">
                <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5 whitespace-nowrap">{stat.label}</span>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-black text-slate-900 leading-none">{stat.value}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">{stat.unit}</span>
                </div>
                <span className={`text-[10px] font-black whitespace-nowrap ${stat.change.startsWith("+") ? "text-brand-green" : "text-brand-red"}`}>
                  {stat.change}% this month
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex justify-center gap-4 sm:gap-6 border-b border-slate-100 mb-8 pb-2 overflow-x-auto hide-scrollbar w-full whitespace-nowrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "pb-4 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600",
              ].join(" ")}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">

          {/* Achievements */}
          {activeTab === "achievements" && (
            <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`aspect-square rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-4 ${i < 3 ? "bg-white border-solid border-slate-100 shadow-sm" : "bg-slate-50/50 grayscale opacity-30"}`}>
                  <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${i < 3 ? "metallic-gradient text-white" : "bg-slate-200 text-slate-400"}`}>
                    <Star className="w-6 h-6" fill={i < 3 ? "currentColor" : "none"} />
                  </div>
                  <span className="text-[10px] font-black text-slate-900 text-center uppercase tracking-widest leading-tight">Achievement {i + 1}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Posts */}
          {activeTab === "posts" && (
            <motion.div key="posts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">{myPosts.length} posts</p>
              <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4">
                {myPosts.map((post) => (
                  <div key={post.id} onClick={() => setSelectedPost(post)} className="relative aspect-square rounded-lg sm:rounded-2xl lg:rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm">
                    <img src={post.image} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute flex inset-0 bg-black/0 group-hover:bg-black/50 transition-all items-center justify-center gap-2 sm:gap-4 opacity-0 group-hover:opacity-100">
                      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 text-white">
                        <Heart size={18} className="fill-white" />
                        <span className="text-[10px] sm:text-xs lg:text-sm font-black">{post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 text-white">
                        <MessageCircle size={18} className="fill-white" />
                        <span className="text-[10px] sm:text-xs lg:text-sm font-black">{post.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Drafts */}
          {activeTab === "drafts" && (
            <motion.div key="drafts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{myDrafts.length} saved drafts</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myDrafts.map((draft) => (
                  <div key={draft.id} className="flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="relative w-full aspect-video bg-slate-100 overflow-hidden shrink-0">
                      <img src={draft.image} alt="Draft" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg">
                        Draft
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-relaxed mb-1.5">{draft.caption}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-4">Saved {draft.savedAt}</p>
                      <div className="flex gap-2 mt-auto">
                        <button className="flex-1 py-2 sm:py-2.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5">
                          <BookOpen className="w-3 h-3" /> Edit
                        </button>
                        <button className="flex-1 py-2 sm:py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-brand-orange transition-colors flex items-center justify-center gap-1.5">
                          <Send className="w-3 h-3" /> Publish
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings Tab block removed */}

        </AnimatePresence>
      </div>

      {/* ── Social Modal ── */}
      <AnimatePresence>
        {socialModal && (
          <SocialModal type={socialModal} onClose={() => setSocialModal(null)} />
        )}
      </AnimatePresence>

      {/* ── Post Viewer Modal ── */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 lg:p-10 text-left"
            onClick={() => setSelectedPost(null)}
          >
            <button className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[70]">
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[85vh] bg-white sm:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center h-[50vh] sm:h-auto md:min-h-[500px] relative group shrink-0">
                <img src={selectedPost.image} alt="Post" className="w-full h-full object-cover sm:object-contain" />

                {/* Prev/Next Navigation Controls */}
                {myPosts.findIndex(p => p.id === selectedPost.id) > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const idx = myPosts.findIndex(p => p.id === selectedPost.id);
                      if (idx > 0) setSelectedPost(myPosts[idx - 1]);
                    }}
                    className="absolute left-2 sm:left-4 p-2 sm:p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-20 backdrop-blur-md shadow-xl"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                {myPosts.findIndex(p => p.id === selectedPost.id) < myPosts.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const idx = myPosts.findIndex(p => p.id === selectedPost.id);
                      if (idx < myPosts.length - 1) setSelectedPost(myPosts[idx + 1]);
                    }}
                    className="absolute right-2 sm:right-4 p-2 sm:p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-20 backdrop-blur-md shadow-xl"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col flex-1 max-h-[50vh] md:max-h-full overflow-y-auto overflow-x-hidden bg-white rounded-t-3xl sm:rounded-none -mt-6 sm:mt-0 relative z-10 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 shrink-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">{displayName}</p>
                    <p className="text-[10px] uppercase text-brand-orange tracking-widest font-black">Pro Member</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-6 leading-relaxed shrink-0">
                  Consistency is key. Smashing today's routine! 💯<br /><br />#fitness #grind #motivation #healthy
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-6 shrink-0">
                  <button className="flex items-center gap-2 text-slate-900 group shrink-0">
                    <Heart size={24} className="group-hover:fill-brand-red group-hover:text-brand-red transition-colors" />
                    <span className="font-black text-sm">{selectedPost.likes >= 1000 ? `${(selectedPost.likes / 1000).toFixed(1)}k` : selectedPost.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-900 group shrink-0">
                    <MessageCircle size={24} className="group-hover:text-brand-orange transition-colors" />
                    <span className="font-black text-sm">{selectedPost.comments}</span>
                  </button>
                  <button className="p-2 -mr-2 ml-auto text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                    <Share size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TrendingUpIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);
