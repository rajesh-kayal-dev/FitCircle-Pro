import React, { useState, useEffect, useRef } from "react";
import { User, Settings as SettingsIcon, Bell, ShieldCheck, ChevronRight, Monitor, Smartphone, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { getUserProfile, updateProfile, uploadProfileImage } from "../api/userApi";
import { getUserAvatar } from "../utils/avatar";

const TABS = [
  { id: "account", label: "My Account", icon: User },
  { id: "preferences", label: "Preferences", icon: SettingsIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  });

  const [toggles, setToggles] = useState({
    push: true,
    reminders: true,
    email: false,
    marketing: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          setFormData({
            name: (profile.name && profile.name !== "User") ? profile.name : (user?.name || ""),
            email: profile.email || user?.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            bio: profile.bio || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) return toast.error("File must be under 2MB");
    
    setUploading(true);
    try {
      const result = await uploadProfileImage(file);
      updateUser({ profileImage: result.profileImage, avatar: result.profileImage });
      toast.success("Profile picture updated ✅");
    } catch (err) {
      toast.error("Image upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile(formData);
      // Update global context with the full profile record from DB
      if (result.profile) {
        updateUser(result.profile);
      } else {
        updateUser({ ...formData });
      }
      toast.success("Settings saved successfully! ✅");
    } catch (error) {
      toast.error("Failed to save settings ❌");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 lg:p-8 text-left">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-text tracking-tighter mb-1">Settings</h1>
        <p className="text-brand-muted font-medium text-sm">Manage your account preferences and configurations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Menu */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-2 shadow-sm sticky top-24">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${isActive
                      ? "bg-brand-orange/10 text-brand-orange"
                      : "text-brand-muted hover:bg-gray-50 hover:text-brand-text"
                    }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  {tab.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
            >
              {activeTab === "account" && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-xl font-black text-brand-text mb-6">Profile Information</h2>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-brand-orange/20 overflow-hidden shadow-inner flex-shrink-0 relative">
                      <img
                        src={getUserAvatar(user)}
                        alt="Profile"
                        className={`w-full h-full object-cover ${uploading ? 'opacity-30' : 'opacity-100'}`}
                      />
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div>
                      <button 
                        onClick={handleImageClick}
                        disabled={uploading}
                        className="px-5 py-2.5 bg-brand-text text-white rounded-xl text-xs font-black shadow-md hover:bg-brand-orange transition-colors mb-2 disabled:opacity-50"
                      >
                        {uploading ? "Updating..." : "Change Picture"}
                      </button>
                      <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">JPG, GIF or PNG. Max size 2MB</p>
                      
                      <input 
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-brand-muted uppercase tracking-widest pl-1">Display Name</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-semibold text-brand-text outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-brand-muted uppercase tracking-widest pl-1">Email Address</label>
                      <input
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full bg-gray-200/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-500 outline-none cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-brand-muted uppercase tracking-widest pl-1">Phone Number</label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-semibold text-brand-text outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-brand-muted uppercase tracking-widest pl-1">Location</label>
                      <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-semibold text-brand-text outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-8">
                    <label className="text-xs font-black text-brand-muted uppercase tracking-widest pl-1">Bio</label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-semibold text-brand-text outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button onClick={handleSave} className="px-8 py-3.5 bg-brand-orange text-white rounded-2xl text-sm font-black shadow-lg shadow-brand-orange/20 hover:bg-orange-600 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-xl font-black text-brand-text mb-6">App Preferences</h2>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-text"><Monitor className="w-5 h-5" /></div>
                        <div>
                          <h3 className="text-sm font-bold text-brand-text">Theme Appearance</h3>
                          <p className="text-xs font-medium text-brand-muted mt-0.5">Customize your UI theme</p>
                        </div>
                      </div>
                      <select className="bg-white border border-gray-200 text-sm font-bold rounded-xl px-4 py-2 outline-none cursor-pointer">
                        <option>Light Mode</option>
                        <option>Dark Mode</option>
                        <option>System Default</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-text"><Activity className="w-5 h-5" /></div>
                        <div>
                          <h3 className="text-sm font-bold text-brand-text">Measurement Units</h3>
                          <p className="text-xs font-medium text-brand-muted mt-0.5">Metric (kg/cm) or Imperial (lbs/in)</p>
                        </div>
                      </div>
                      <select className="bg-white border border-gray-200 text-sm font-bold rounded-xl px-4 py-2 outline-none cursor-pointer">
                        <option>Metric (kg, cm)</option>
                        <option>Imperial (lbs, in)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                    <button onClick={handleSave} className="px-8 py-3.5 bg-brand-orange text-white rounded-2xl text-sm font-black shadow-lg shadow-brand-orange/20 hover:bg-orange-600 transition-colors">
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-xl font-black text-brand-text mb-6">Notification Settings</h2>

                  <div className="space-y-2">
                    {[
                      { key: "push", title: "Push Notifications", desc: "Receive alerts on your device for activities." },
                      { key: "reminders", title: "Workout Reminders", desc: "Daily reminders to hit your fitness goals." },
                      { key: "email", title: "Email Summaries", desc: "Weekly digest of your performance and stats." },
                      { key: "marketing", title: "Marketing & Offers", desc: "Promotions from the Supplement Store." },
                    ].map((item) => (
                      <div
                        key={item.key}
                        onClick={() => setToggles(p => ({ ...p, [item.key]: !p[item.key] }))}
                        className="flex items-center justify-between p-5 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-brand-text">{item.title}</h3>
                          <p className="text-xs font-medium text-brand-muted mt-1 max-w-sm">{item.desc}</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center shrink-0 ${toggles[item.key] ? 'bg-brand-green' : 'bg-gray-200'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${toggles[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                    <button onClick={handleSave} className="px-8 py-3.5 bg-brand-orange text-white rounded-2xl text-sm font-black shadow-lg shadow-brand-orange/20 hover:bg-orange-600 transition-colors">
                      Update Notifications
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-xl font-black text-brand-text mb-6">Security & Privacy</h2>

                  <div className="space-y-6">
                    <div className="space-y-4 pb-6 border-b border-gray-100">
                      <h3 className="text-sm font-black text-brand-text">Change Password</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <input type="password" placeholder="Current Password" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-semibold text-brand-text outline-none focus:border-brand-orange/50 transition-all" />
                        <input type="password" placeholder="New Password" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-semibold text-brand-text outline-none focus:border-brand-orange/50 transition-all" />
                      </div>
                      <button className="px-6 py-3 bg-brand-text text-white rounded-xl text-xs font-black shadow-md hover:bg-gray-800 transition-colors">
                        Update Password
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-brand-orange/5 rounded-2xl border border-brand-orange/10">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-orange flex-shrink-0"><Smartphone className="w-5 h-5" /></div>
                        <div>
                          <h3 className="text-sm font-bold text-brand-text">Two-Factor Authentication</h3>
                          <p className="text-xs font-medium text-brand-muted mt-1 max-w-md leading-relaxed">Add an extra layer of security to your account by requiring an OTP on login.</p>
                        </div>
                      </div>
                      <button className="px-5 py-3 bg-white text-brand-text border border-gray-200 rounded-xl text-xs font-black shadow-sm hover:border-brand-orange/50 transition-colors whitespace-nowrap">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
