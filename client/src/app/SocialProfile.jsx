import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Heart, MessageCircle, UserCheck, UserPlus, Grid3x3, MapPin, Link2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMessaging } from "../context/MessagingContext";

/* ─── Mock user DB ───────────────────────────────────────── */
const userDB = {
  "@aryan_hiit": {
    name: "Aryan Singh",
    handle: "@aryan_hiit",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    bio: "HIIT specialist | Shred coach  | 5 years lifting journey | DM for coaching",
    location: "Mumbai, India",
    website: "aryanfitness.in",
    followers: "12.4K",
    following: "320",
    postsCount: 6,
    posts: [
      { id: 1, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop", likes: 1245, comments: 89 },
      { id: 2, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", likes: 634, comments: 23 },
      { id: 3, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop", likes: 980, comments: 51 },
      { id: 4, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop", likes: 512, comments: 18 },
      { id: 5, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop", likes: 760, comments: 37 },
      { id: 6, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", likes: 391, comments: 12 },
    ],
  },
  "@yasmin_pilates": {
    name: "Yasmin K.",
    handle: "@yasmin_pilates",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    bio: "Certified Pilates Instructor 🧘‍ | Mobility & Flexibility | Join my classes!",
    location: "Delhi, India",
    website: "yasminpilates.com",
    followers: "1.8M",
    following: "512",
    postsCount: 4,
    posts: [
      { id: 1, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop", likes: 45200, comments: 890 },
      { id: 2, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", likes: 32100, comments: 620 },
      { id: 3, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", likes: 28700, comments: 410 },
      { id: 4, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop", likes: 19800, comments: 320 },
    ],
  },
  "@rahul_strength": {
    name: "Rahul Saini",
    handle: "@rahul_strength",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    bio: "Strength & Powerlifting Coach 🏋️ | Natural | 140kg squat PR | Training since 2018",
    location: "Bangalore, India",
    website: "",
    followers: "890K",
    following: "204",
    postsCount: 5,
    posts: [
      { id: 1, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop", likes: 21030, comments: 1560 },
      { id: 2, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop", likes: 14200, comments: 720 },
      { id: 3, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop", likes: 9800, comments: 380 },
      { id: 4, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", likes: 7600, comments: 240 },
      { id: 5, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop", likes: 5400, comments: 160 },
    ],
  },
};

/* ─── Social Profile Page ────────────────────────────────── */

export default function SocialProfile() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const { getContactByHandle, getOrCreateConversationId } = useMessaging();

  const handleMessage = () => {
    const contact = getContactByHandle(handle);
    if (contact) {
      const convId = getOrCreateConversationId(contact.id);
      navigate(`/messages/${convId}`);
    } else {
      navigate("/messages");
    }
  };

  const profile = userDB[handle] || {
    name: handle?.replace("@", "") || "User",
    handle: handle || "@user",
    avatar: `https://i.pravatar.cc/200?u=${handle}`,
    bio: "Fitness enthusiast 💪",
    location: "India",
    website: "",
    followers: "0",
    following: "0",
    postsCount: 0,
    posts: [],
  };

  const toggleLike = (id) => {
    setLikedPosts((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const formatCount = (n) => {
    if (typeof n === "string") return n;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 lg:p-8">
      {/* Back */}
      <Link to="/home" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-text font-bold text-sm mb-6 transition-colors">
        <ArrowLeft size={18} />
        Back
      </Link>

      {/* Profile Card */}
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm p-5 sm:p-6 lg:p-8 mb-6">

        {/* Top: Avatar + Stats */}
        <div className="flex items-center justify-between gap-4 sm:gap-6 mb-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-full sm:rounded-[2rem] overflow-hidden border-[3px] border-brand-orange/20 p-0.5">
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-full sm:rounded-[1.75rem]" />
          </div>

          <div className="flex-1 flex justify-around">
            {[
              { label: "Posts", value: profile.postsCount },
              { label: "Followers", value: following ? `${parseInt(String(profile.followers).replace(/[^0-9]/g, "")) + 1}` : profile.followers },
              { label: "Following", value: profile.following },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg sm:text-xl font-black text-brand-text leading-none mb-1">{stat.value}</div>
                <div className="text-[10px] sm:text-[11px] font-bold text-brand-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-zl font-black text-brand-text tracking-tight leading-none mb-1">{profile.name}</h1>
          <p className="text-sm text-brand-muted font-bold mb-3">{profile.handle}</p>
          <div className="space-y-2">
            <p className="text-sm text-brand-text/90 font-medium leading-relaxed">{profile.bio}</p>
            {profile.location && (
              <div className="flex items-center gap-1.5 text-brand-muted text-[13px] font-medium pt-1">
                <MapPin size={14} className="text-brand-orange" /> {profile.location}
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1.5 text-brand-orange text-[13px] font-bold hover:underline cursor-pointer max-w-max">
                <Link2 size={14} /> {profile.website}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setFollowing((f) => !f)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm transition-all shadow-sm ${following
              ? "bg-gray-100 text-brand-text border border-gray-200 hover:bg-gray-200"
              : "bg-brand-text text-white hover:bg-gray-800"
              }`}
          >
            {following ? <UserCheck size={16} /> : <UserPlus size={16} />}
            {following ? "Following" : "Follow"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleMessage}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-all border border-brand-orange/20 shadow-sm"
          >
            <MessageSquare size={16} />
            Message
          </motion.button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <Grid3x3 size={16} className="text-brand-text" />
          <h2 className="text-sm font-black text-brand-text uppercase tracking-widest">Posts</h2>
        </div>

        {profile.posts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Grid3x3 size={28} className="text-gray-300" />
            </div>
            <p className="font-black text-brand-text text-sm">No posts yet</p>
            <p className="text-xs text-brand-muted mt-1">Posts will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {profile.posts.map((post) => (
              <div key={post.id} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                  <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 text-white">
                    <Heart size={16} className={likedPosts.has(post.id) ? "fill-brand-red text-brand-red" : "fill-white"} />
                    <span className="text-xs font-black">{formatCount(post.likes + (likedPosts.has(post.id) ? 1 : 0))}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-white">
                    <MessageCircle size={16} className="fill-white" />
                    <span className="text-xs font-black">{formatCount(post.comments)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
