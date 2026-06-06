import { Settings, Grid, Film, Bookmark, Heart, MessageCircle, MapPin, Link as LinkIcon, MoreHorizontal, Camera, Pencil } from "lucide-react";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../app/components/ui";
import { useAuth } from "../context/AuthContext";
import { uploadProfileImage } from "../api/userApi";
import { toast } from "sonner";

const profileTabs = [
  { id: "posts", label: "Posts", icon: Grid },
  { id: "reels", label: "Reels", icon: Film },
  { id: "saved", label: "Saved", icon: Bookmark },
];

const mockPosts = [
  { id: 1, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop", likes: 1205, comments: 84 },
  { id: 2, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", likes: 856, comments: 42 },
  { id: 3, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop", likes: 2100, comments: 156 },
  { id: 4, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", likes: 645, comments: 23 },
  { id: 5, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop", likes: 1432, comments: 90 },
  { id: 6, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop", likes: 980, comments: 55 },
];

const mockReels = [
  { id: 1, image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=300&h=500&fit=crop", views: "1.2M" },
  { id: 2, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=500&fit=crop", views: "850K" },
  { id: 3, image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&h=500&fit=crop", views: "2.4M" },
  { id: 4, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=500&fit=crop", views: "450K" },
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate
    if (file.size > 2 * 1024 * 1024) return toast.error("File size must be < 2MB");
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      return toast.error("Only JPG and PNG are allowed");
    }

    setUploading(true);
    try {
      const result = await uploadProfileImage(file);
      updateUser({ profileImage: result.profileImage, avatar: result.profileImage });
      toast.success("Profile updated ✅");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">

      {/* Native App Header */}
      <header className="px-4 pt-6 pb-6 md:px-0 bg-brand-bg md:bg-transparent sticky top-0 z-40">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-brand-text tracking-tight">
              {user?.name?.toLowerCase().replace(/\s+/g, '_') || "username"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-brand-text hover:text-brand-orange transition-colors">
              <MoreHorizontal size={24} />
            </button>
            <button className="text-brand-text hover:text-brand-orange transition-colors">
              <Settings size={24} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-brand-orange to-brand-red shadow-xl">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white relative group">
                <img
                  src={user?.profileImage || user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"}
                  alt="Profile"
                  className={cn("w-full h-full object-cover transition-opacity", uploading ? "opacity-30" : "opacity-100")}
                />
                
                {/* Overlay on hover */}
                <button 
                  onClick={handleImageClick}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-wait"
                >
                  <Camera className="text-white" size={24} />
                </button>

                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Edit Badge / Pencil Button like in screenshot */}
            <button 
              onClick={handleImageClick}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
            >
              <Pencil size={18} fill="currentColor" />
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1 flex justify-around md:justify-start md:gap-10">
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-black text-brand-text">156</span>
              <span className="text-xs md:text-sm font-bold text-brand-muted">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-black text-brand-text">14.2K</span>
              <span className="text-xs md:text-sm font-bold text-brand-muted">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-black text-brand-text">840</span>
              <span className="text-xs md:text-sm font-bold text-brand-muted">Following</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-black text-brand-text text-base">{user?.name || "Alex Thompson"}</h2>
            <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
              PRO
            </span>
          </div>
          <p className="text-sm font-medium text-brand-text/90">Elite Athlete • Bangalore</p>
          <p className="text-sm text-brand-text/80 leading-snug max-w-sm">
            Fitness enthusiast & digital creator. Let's build your best self through science-based training & diet. 🧬💪
          </p>

          <div className="flex items-center gap-4 mt-2 mb-4">
            <div className="flex items-center gap-1 text-xs font-bold text-brand-muted">
              <MapPin size={12} /> Mumbai, IN
            </div>
            <a href="#" className="flex items-center gap-1 text-xs font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full hover:bg-brand-orange/20 transition-colors">
              <LinkIcon size={12} /> fitcircle.pro/alex
            </a>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand-text py-2 rounded-xl text-sm font-black transition-colors">
            Edit Profile
          </button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand-text py-2 rounded-xl text-sm font-black transition-colors">
            Share Profile
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-t border-gray-200 mt-2 px-4 md:px-0 sticky top-[72px] md:top-[88px] bg-brand-bg z-30">
        {profileTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 border-t-2 transition-all",
              activeTab === tab.id
                ? "border-brand-text text-brand-text"
                : "border-transparent text-gray-400 hover:text-brand-text"
            )}
          >
            <tab.icon size={20} className={cn(activeTab === tab.id ? "fill-brand-text" : "")} />
            <span className="text-sm font-black uppercase tracking-widest hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-1 px-4 md:px-0">
        <AnimatePresence mode="popLayout">
          {activeTab === "posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 gap-1 md:gap-4"
            >
              {mockPosts.map((post) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-md md:rounded-[1rem]">
                  <img src={post.image} alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-white font-black">
                      <Heart className="fill-white" size={20} />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white font-black">
                      <MessageCircle className="fill-white" size={20} />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "reels" && (
            <motion.div
              key="reels"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-4"
            >
              {mockReels.map((reel) => (
                <div key={reel.id} className="aspect-[9/16] relative group cursor-pointer overflow-hidden rounded-md md:rounded-[1rem]">
                  <img src={reel.image} alt="Reel" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-black drop-shadow-md">
                    <Film size={14} className="fill-white" />
                    <span>{reel.views}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mt-4">
                <Bookmark size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
                <h3 className="text-xl font-black text-brand-text mb-2">Only you can see what you've saved</h3>
                <p className="text-sm font-medium text-brand-muted">Save photos and videos that you want to see again.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
