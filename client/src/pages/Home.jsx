import { Heart, MessageCircle, Share2, Bookmark, Plus, Flame, TrendingUp, Play, Volume2, VolumeX, MoreHorizontal } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../app/components/ui";
import { StoryViewer } from "../app/components/feed/StoryViewer";
import { useAuth } from "../context/AuthContext";
import { getUserAvatar } from "../utils/avatar";

/* ── Auto-play video hook (IntersectionObserver) ─────────── */
function useAutoplayVideo(videoRef) {
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => { });
        } else {
          el.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [videoRef]);
}

const stories = [
  { id: 1, name: "Your Story", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", hasStory: false, isYou: true, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1200&fit=crop" },
  { id: 2, name: "Sahil Khan", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", hasStory: true, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1200&fit=crop" },
  { id: 3, name: "Yasmin K.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", hasStory: true, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1200&fit=crop" },
  { id: 4, name: "Rahul S.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", hasStory: true, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1200&fit=crop" },
  { id: 5, name: "Nandini G.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", hasStory: true, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1200&fit=crop" },
  { id: 6, name: "Aryan S.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", hasStory: true, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1200&fit=crop" },
];

const influencers = [
  { id: 1, name: "Sahil Khan", role: "Bodybuilding", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop", followers: "2.4M" },
  { id: 2, name: "Yasmin Karachiwala", role: "Pilates Expert", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop", followers: "1.8M" },
  { id: 3, name: "Rahul Saini", role: "Strength Coach", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop", followers: "890K" },
  { id: 4, name: "Natasha G.", role: "Yoga Expert", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop", followers: "1.2M" },
];

const posts = [
  {
    id: 1,
    author: { name: "Aryan Singh", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", handle: "@aryan_hiit" },
    content: "Day 5 of the Shred Program. Consistency is everything. Keep pushing forward. 💪",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop",
    likes: 1245,
    comments: 89,
    time: "2h ago",
    tags: ["#fitness", "#shred", "#consistency"],
  },
  {
    id: 2,
    author: { name: "Yasmin K.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", handle: "@yasmin_pilates" },
    content: "Morning mobility flow. Your joints will thank you later. 🧘",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop",
    likes: 856,
    comments: 42,
    time: "4h ago",
    tags: ["#yoga", "#mobility", "#morningroutine"],
  },
  {
    id: 3,
    author: { name: "Rahul Saini", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", handle: "@rahul_strength" },
    content: "New Personal Best! 140kg squat today. The grind never stops. ",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop",
    likes: 2103,
    comments: 156,
    time: "6h ago",
    tags: ["#powerlifting", "#squat", "#PR"],
  },
];

export default function Home() {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  const displayStories = stories.map(story => 
    story.isYou ? { ...story, avatar: getUserAvatar(user) } : story
  );

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleSave = (postId) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const openStory = (index) => setActiveStoryIndex(index);
  const closeStory = () => setActiveStoryIndex(null);

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-10">
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={displayStories}
          initialIndex={activeStoryIndex}
          onClose={closeStory}
        />
      )}

      {/* Stories Section */}
      <section className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory px-4 md:px-0 scroll-smooth">
        {displayStories.map((story, idx) => (
          <motion.div
            key={story.id}
            onClick={() => openStory(idx)}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer snap-start"
          >
            <div className={cn(
              "relative p-0.5 rounded-full transition-all duration-300",
              story.hasStory ? "bg-gradient-to-tr from-brand-orange via-brand-red to-pink-500 shadow-md shadow-brand-red/20" : "bg-gray-200"
            )}>
              <div className="bg-white p-1 rounded-full">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              {story.isYou && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-br from-brand-orange to-brand-red rounded-full flex items-center justify-center border-2 border-white">
                  <Plus size={14} className="text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-brand-text text-center truncate w-full">
              {story.isYou ? "Add" : story.name}
            </span>
          </motion.div>
        ))}
      </section>

      {/* Hero Stats Section */}
      <section className="bg-gradient-to-br from-brand-orange to-brand-red rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-brand-orange/20 mx-4 md:mx-0">
        <div className="absolute top-0 right-0 opacity-10">
          <Flame size={140} strokeWidth={1.5} className="translate-x-4 -translate-y-4" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black tracking-tight drop-shadow-sm">Today's Progress</h2>
              <p className="text-white/80 text-sm mt-1 font-medium">You're on fire! Keep it up</p>
            </div>
            <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <div className="text-2xl font-black tracking-tight">85%</div>
              <div className="text-xs text-white/80 uppercase tracking-wider font-bold">Goal</div>
            </div>
          </div>
          <div className="flex gap-6 mt-6 bg-black/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <div>
              <div className="text-2xl font-black tracking-tight">1,840</div>
              <div className="text-xs text-white/70 uppercase tracking-wider font-bold">Calories</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-2xl font-black tracking-tight">420</div>
              <div className="text-xs text-white/70 uppercase tracking-wider font-bold">Burned</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-2xl font-black tracking-tight">12</div>
              <div className="text-xs text-white/70 uppercase tracking-wider font-bold">Day Streak</div>
            </div>
          </div>
        </div>
      </section>

      {/* Influencers Carousel */}
      <section className="px-4 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-brand-text tracking-tight">Top Influencers</h3>
          <button className="text-sm font-bold text-brand-orange hover:text-orange-700 transition-colors">
            View All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
          {influencers.map((influencer) => (
            <div key={influencer.id} className="min-w-[280px] md:min-w-[320px] bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-orange/30 transition-all snap-start">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={influencer.avatar}
                  alt={influencer.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-50"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-brand-text text-base truncate tracking-tight">{influencer.name}</h4>
                  <p className="text-sm text-brand-muted font-medium">{influencer.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-500">
                  {influencer.followers} <span className="font-normal text-gray-400">followers</span>
                </span>
                <button className="px-6 py-2 bg-brand-text text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reels Preview Carousel */}
      <section className="px-4 md:px-0 mt-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-brand-text tracking-tight">Trending Reels</h3>
          <button className="text-sm font-bold text-brand-orange hover:text-orange-700 transition-colors">
            Watch All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
          {[
            { id: 1, views: "1.2M", thumb: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop" },
            { id: 2, views: "850K", thumb: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=600&fit=crop" },
            { id: 3, views: "2.4M", thumb: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop" },
            { id: 4, views: "410K", thumb: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop" }
          ].map((reel) => (
            <div key={reel.id} className="relative min-w-[140px] h-[240px] rounded-2xl overflow-hidden snap-start cursor-pointer group shadow-sm shadow-black/5 hover:shadow-lg transition-all"
              onClick={() => { /* Should open Reels Viewer - handled via state ideally */ }}>
              <img src={reel.thumb} alt="Reel thumbnail" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-2 right-2 text-white drop-shadow-md">
                <Play className="fill-white" size={20} />
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
                <Play size={14} className="fill-white" />
                <span className="text-xs font-bold tracking-wide drop-shadow-md">{reel.views}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Feed */}
      <section className="space-y-6 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-brand-text tracking-tight">Your Feed</h3>
          <div className="flex border border-gray-200 bg-white rounded-xl p-1 shadow-sm">
            <button className="px-4 py-1.5 bg-brand-text text-white text-xs font-bold rounded-lg shadow-sm">
              Following
            </button>
            <button className="px-4 py-1.5 text-brand-muted text-xs font-bold rounded-lg hover:text-brand-text transition-colors">
              Discover
            </button>
          </div>
        </div>

        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-brand-orange/20 transition-all duration-300 cursor-default"
          >
            {/* Post header */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-50"
                />
                <div>
                  <div className="text-sm font-bold text-brand-text tracking-tight">{post.author.name}</div>
                  <div className="text-xs text-brand-muted font-medium">{post.author.handle} • {post.time}</div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-brand-text p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Caption */}
            <div className="px-5 pb-4">
              <p className="text-sm text-brand-text/90 leading-relaxed font-medium">{post.content}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs font-bold text-brand-orange hover:underline cursor-pointer">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Media */}
            <div className="w-full relative overflow-hidden bg-gray-100 group">
              <img
                src={post.image}
                alt="Post content"
                className="w-full max-h-[600px] object-cover group-hover:scale-[1.02] transition-transform duration-700 cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-2 group cursor-pointer"
                    aria-label={likedPosts.has(post.id) ? "Unlike" : "Like"}
                  >
                    <motion.div whileTap={{ scale: 1.3 }}>
                      <Heart
                        size={22}
                        className={cn(
                          "transition-all",
                          likedPosts.has(post.id)
                            ? "fill-brand-red text-brand-red"
                            : "text-brand-text group-hover:text-brand-red"
                        )}
                      />
                    </motion.div>
                    <span className="text-sm font-bold text-brand-text">
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </span>
                  </button>
                  <button className="flex items-center gap-2 group cursor-pointer" aria-label="Comment">
                    <MessageCircle size={22} className="text-brand-text group-hover:text-brand-orange group-hover:scale-110 transition-all" />
                    <span className="text-sm font-bold text-brand-text">{post.comments}</span>
                  </button>
                  <button className="group cursor-pointer" aria-label="Share">
                    <Share2 size={22} className="text-brand-text group-hover:text-brand-green group-hover:scale-110 transition-all" />
                  </button>
                </div>
                <button onClick={() => toggleSave(post.id)} className="group cursor-pointer" aria-label={savedPosts.has(post.id) ? "Unsave" : "Save"}>
                  <Bookmark
                    size={22}
                    className={cn(
                      "transition-all group-hover:scale-110",
                      savedPosts.has(post.id)
                        ? "fill-brand-text text-brand-text"
                        : "text-brand-text"
                    )}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
