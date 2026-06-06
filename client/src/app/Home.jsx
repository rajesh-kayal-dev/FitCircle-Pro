import { Heart, MessageCircle, Bookmark, Share2, Plus, Flame, Play, X, MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StoryViewer } from "./components/feed/StoryViewer";
import { ReelsViewer } from "./components/feed/ReelsViewer";

/* ─── Mock Data ──────────────────────────────────────────── */

const stories = [
  { id: 1, name: "Me", avatar: "https://i.pravatar.cc/100?u=you", hasStory: false, isYou: true, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1200&fit=crop" },
  { id: 2, name: "Sahil", avatar: "https://i.pravatar.cc/100?u=sahil", hasStory: true, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1200&fit=crop" },
  { id: 3, name: "Yasmin", avatar: "https://i.pravatar.cc/100?u=yasmin", hasStory: true, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1200&fit=crop" },
  { id: 4, name: "Rahul", avatar: "https://i.pravatar.cc/100?u=rahul", hasStory: true, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1200&fit=crop" },
  { id: 5, name: "Nandini", avatar: "https://i.pravatar.cc/100?u=nandini", hasStory: true, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1200&fit=crop" },
  { id: 6, name: "Aryan", avatar: "https://i.pravatar.cc/100?u=aryan", hasStory: true, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=1200&fit=crop" },
  { id: 7, name: "Priya", avatar: "https://i.pravatar.cc/100?u=priya", hasStory: true, image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&h=1200&fit=crop" },
  { id: 8, name: "Vikram", avatar: "https://i.pravatar.cc/100?u=vikram", hasStory: true, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=1200&fit=crop" },
  { id: 9, name: "Sneha", avatar: "https://i.pravatar.cc/100?u=sneha", hasStory: true, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1200&fit=crop" },
  { id: 10, name: "Kunal", avatar: "https://i.pravatar.cc/100?u=kunal", hasStory: true, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop" },
  { id: 11, name: "Meera", avatar: "https://i.pravatar.cc/100?u=meera", hasStory: true, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop" },
  { id: 12, name: "Advait", avatar: "https://i.pravatar.cc/100?u=advait", hasStory: true, image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&h=1200&fit=crop" },
  { id: 13, name: "Ishani", avatar: "https://i.pravatar.cc/100?u=ishani", hasStory: true, image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=800&h=1200&fit=crop" },
  { id: 14, name: "Arjun", avatar: "https://i.pravatar.cc/100?u=arjun", hasStory: true, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1200&fit=crop" },
  { id: 15, name: "Diya", avatar: "https://i.pravatar.cc/100?u=diya", hasStory: true, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop" },
];

const reels = [
  { id: 1, videoThumb: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=700&fit=crop", author: { avatar: "https://i.pravatar.cc/80?u=sahil", name: "Sahil Khan" }, description: "Day 5 of the Shred Program ", likes: "1.2K", comments: "89" },
  { id: 2, videoThumb: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=700&fit=crop", author: { avatar: "https://i.pravatar.cc/80?u=yasmin", name: "Yasmin K." }, description: "Morning mobility flow 🌅", likes: "3.5K", comments: "156" },
  { id: 3, videoThumb: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=700&fit=crop", author: { avatar: "https://i.pravatar.cc/80?u=rahul", name: "Rahul S." }, description: "NEW PR — 140kg squat 💪", likes: "2.4K", comments: "213" },
  { id: 4, videoThumb: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=700&fit=crop", author: { avatar: "https://i.pravatar.cc/80?u=sneha", name: "Sneha K." }, description: "Explosive plyometrics ", likes: "890", comments: "42" },
  { id: 5, videoThumb: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=700&fit=crop", author: { avatar: "https://i.pravatar.cc/80?u=vikram", name: "Vikram N." }, description: "15-min fat burner anywhere 🏃", likes: "4.1K", comments: "302" },
  { id: 6, videoThumb: "https://images.unsplash.com/photo-1581009238127-14e5300c3a48?w=400&h=700&fit=crop", author: { avatar: "https://i.pravatar.cc/80?u=kunal", name: "Kunal P." }, description: "Chest day motivation! 🦾", likes: "1.8K", comments: "76" },
];

const posts = [
  {
    id: 1,
    author: { name: "Aryan Singh", avatar: "https://i.pravatar.cc/80?u=aryan2", handle: "@aryan_hiit" },
    content: "Day 5 of the Shred Program. Consistency is everything. Keep pushing forward 💪",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop",
    likes: 1245, comments: 89, time: "2h ago", tag: "Strength", tagColor: "bg-brand-orange/10 text-brand-orange",
  },
  {
    id: 2,
    author: { name: "Yasmin K.", avatar: "https://i.pravatar.cc/80?u=yasmin3", handle: "@yasmin_pilates" },
    content: "Morning mobility flow. Your joints will thank you later 🧘‍",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop",
    likes: 856, comments: 42, time: "4h ago", tag: "Yoga", tagColor: "bg-brand-purple/10 text-brand-purple",
  },
  {
    id: 3,
    author: { name: "Rahul Saini", avatar: "https://i.pravatar.cc/80?u=rahul3", handle: "@rahul_strength" },
    content: "New Personal Best! 140kg squat today. The grind never stops 🏋️",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop",
    likes: 2103, comments: 156, time: "6h ago", tag: "PowerLifting", tagColor: "bg-brand-red/10 text-brand-red",
  },
];

const storyRingColors = [
  "from-brand-orange via-brand-red to-brand-pink",
  "from-brand-purple via-brand-pink to-brand-orange",
  "from-brand-cyan via-brand-green to-brand-amber",
  "from-brand-amber via-brand-orange to-brand-red",
];

export default function Home() {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [reelsOpen, setReelsOpen] = useState(false);
  const [reelStartIndex, setReelStartIndex] = useState(0);
  const [showProgress, setShowProgress] = useState(true);

  const toggleLike = (id) => setLikedPosts((p) => {
    const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s;
  });
  const toggleSave = (id) => setSavedPosts((p) => {
    const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s;
  });
  const openReel = (i) => { setReelStartIndex(i); setReelsOpen(i !== null); };

  return (
    <div className="w-full max-w-full lg:max-w-[1400px] mx-auto px-0 lg:px-8 transition-all duration-300">
      {/* Overlays */}
      {activeStoryIndex !== null && <StoryViewer stories={stories} initialIndex={activeStoryIndex} onClose={() => setActiveStoryIndex(null)} />}
      {reelsOpen && <ReelsViewer reels={reels} initialIndex={reelStartIndex} onClose={() => setReelsOpen(false)} />}

      {/* ── Compact Feed Sections Refactor ── */}
      <div className="space-y-6 lg:space-y-8 mt-4 lg:mt-6">

        {/* Row 1: Stories (Compact View) */}
        <section className="bg-white rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-sm p-4 lg:p-6 flex flex-col justify-center overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xs lg:text-sm font-black text-brand-text uppercase tracking-widest">Stories</h3>
            <button className="text-[10px] font-black text-brand-orange hover:underline uppercase tracking-tighter">Watch All</button>
          </div>
          <div className="flex gap-4 lg:gap-6 overflow-x-auto hide-scrollbar pb-1 px-2 lg:px-0 scroll-smooth">
            {stories.map((story, idx) => (
              <motion.button key={story.id} onClick={() => setActiveStoryIndex(idx)} whileTap={{ scale: 0.93 }} className="flex flex-col items-center gap-2 min-w-[65px] lg:min-w-[75px] group">
                <div className={`p-[2.5px] rounded-full transition-all duration-300 group-hover:scale-105 ${story.hasStory ? `bg-gradient-to-br ${storyRingColors[idx % 4]}` : "bg-gray-100"}`}>
                  <div className="bg-white p-[2px] rounded-full relative">
                    <img src={story.avatar} alt="" className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover" />
                    {story.isYou && <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-brand-orange to-brand-red rounded-full flex items-center justify-center border-2 border-white shadow-sm"><Plus size={12} className="text-white" /></span>}
                  </div>
                </div>
                <span className="text-[10px] lg:text-[11px] font-bold text-brand-muted group-hover:text-brand-text truncate w-full text-center transition-colors tracking-tight">{story.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Row 2: Progress Banner (COMPACT & REDUCED HEIGHT) */}
        <AnimatePresence>
          {showProgress && (
            <motion.section
              className="relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden energy-gradient text-white p-5 lg:p-7 shadow-lg shadow-brand-orange/20"
              initial={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
            >
              <Flame size={140} className="absolute -right-6 -top-6 opacity-10 pointer-events-none rotate-12" />
              <button onClick={() => setShowProgress(false)} className="absolute top-4 right-4 z-30 p-1.5 bg-black/20 hover:bg-black/40 rounded-full transition-colors"><X size={16} /></button>

              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 lg:gap-6">
                <div>
                  <p className="text-white/70 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] mb-1.5 lg:mb-2">Daily Milestone</p>
                  <h2 className="text-2xl lg:text-3xl font-black italic tracking-tighter leading-tight mb-1 lg:mb-2">YOU'RE CRUSHING IT!</h2>
                  <p className="text-white/80 text-xs lg:text-sm font-medium max-w-lg">Intensity is your key. You're just a few sessions away from your peak.</p>
                </div>

                <div className="flex items-center gap-6 lg:gap-8">
                  <div className="relative flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="42%" stroke="rgba(255,255,255,0.15)" strokeWidth="6" fill="transparent" />
                      <circle cx="50%" cy="50%" r="42%" stroke="white" strokeWidth="6" fill="transparent" strokeDasharray="264" strokeDashoffset={264 - (264 * 0.85)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xl lg:text-2xl font-black italic">85%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 flex-grow bg-black/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[220px] lg:min-w-[380px]">
                    <div className="text-center"><p className="text-lg lg:text-xl font-black italic">1,840</p><p className="text-[8px] lg:text-[10px] text-white/60 uppercase font-black tracking-widest mt-0.5">Kcal</p></div>
                    <div className="text-center border-l border-white/10"><p className="text-lg lg:text-xl font-black italic">420</p><p className="text-[8px] lg:text-[10px] text-white/60 uppercase font-black tracking-widest mt-0.5">Burn</p></div>
                    <div className="text-center border-l border-white/10"><p className="text-lg lg:text-xl font-black italic">12d</p><p className="text-[8px] lg:text-[10px] text-white/60 uppercase font-black tracking-widest mt-0.5">Streak</p></div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Row 3: Trending Reels (COMPACT GRID) */}
        <section className="bg-white rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-sm p-4 lg:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl purple-gradient flex items-center justify-center shadow-lg shadow-brand-purple/20">
                <Play size={14} className="text-white fill-white" />
              </div>
              <h3 className="text-base lg:text-xl font-black text-brand-text uppercase tracking-tighter">Trending Reels</h3>
            </div>
            <button onClick={() => openReel(0)} className="text-xs font-black text-brand-purple hover:underline tracking-widest uppercase tracking-tighter">Watch All</button>
          </div>

          <div className="flex overflow-x-auto lg:grid lg:grid-cols-6 gap-3 lg:gap-4 hide-scrollbar snap-x lg:overflow-visible lg:h-[260px] pb-1 lg:pb-0">
            {reels.map((r, i) => (
              <motion.button key={r.id} onClick={() => openReel(i)} whileHover={{ y: -6 }} className="relative min-w-[140px] sm:min-w-[160px] lg:min-w-0 rounded-[1.5rem] lg:rounded-[1.8rem] overflow-hidden group shadow-md bg-gray-50 h-[210px] lg:h-full snap-start flex-shrink-0">
                <img src={r.videoThumb} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5">
                  <img src={r.author.avatar} alt="" className="w-5 h-5 rounded-full border border-white/50" />
                  <span className="text-white text-[9px] font-black truncate drop-shadow-lg">{r.author.name}</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 p-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 z-10">
                  <Play size={16} className="text-white fill-white" />
                </div>
              </motion.button>
            ))}
          </div>
        </section>

      </div>

      {/* ── Feed (COMPACT VIEW) ── */}
      <section className="py-8 lg:py-10 px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-10 gap-4 lg:gap-6">
          <div>
            <h2 className="text-2xl lg:text-4xl font-black text-brand-text uppercase tracking-tighter mb-1">Community Feed</h2>
            <p className="text-brand-muted text-xs lg:text-base font-medium">Trending posts from your circle</p>
          </div>
          <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-[1.2rem] shadow-inner w-fit">
            <button className="px-6 py-2.5 bg-white text-brand-text text-[10px] lg:text-xs font-black rounded-xl shadow-sm border border-gray-200 uppercase tracking-widest">Following</button>
            <button className="px-6 py-2.5 text-brand-muted text-[10px] lg:text-xs font-black hover:text-brand-text transition-colors uppercase tracking-widest">Discover</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {posts.map((post) => (
            <motion.article key={post.id} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-brand-orange/10 transition-all duration-500 group">
              <div className="flex items-center justify-between p-5 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-[2.5px] rounded-full bg-gradient-to-br from-brand-orange to-brand-red shadow-md">
                    <img src={post.author.avatar} alt="" className="w-11 h-11 rounded-full border-2 border-white object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-brand-text group-hover:text-brand-orange transition-colors">{post.author.name}</h4>
                    <p className="text-[10px] text-brand-muted font-bold tracking-tight">{post.author.handle} • {post.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${post.tagColor}`}>{post.tag}</span>
                  <button className="p-2 hover:bg-gray-50 rounded-full text-brand-muted transition-colors"><MoreHorizontal size={18} /></button>
                </div>
              </div>

              <p className="px-6 pb-4 text-sm text-brand-text/90 font-medium leading-relaxed">{post.content}</p>

              <div className="w-full aspect-[16/10] lg:aspect-[16/9] bg-gray-100 overflow-hidden relative group-hover:ring-1 group-hover:ring-brand-orange/10">
                <img src={post.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-6 lg:p-7 pb-8 lg:pb-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-6">
                    <button onClick={() => toggleLike(post.id)} className="flex items-center gap-2 group/like">
                      <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover/like:bg-brand-red/10">
                        <Heart size={20} lg:size={22} className={`transition-all ${likedPosts.has(post.id) ? "fill-brand-red text-brand-red scale-110" : "text-brand-text"}`} />
                      </div>
                      <span className="text-xs font-black italic">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-2 group/comm">
                      <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover/comm:bg-brand-orange/10">
                        <MessageCircle size={20} lg:size={22} className="text-brand-text" />
                      </div>
                      <span className="text-xs font-black italic">{post.comments}</span>
                    </button>
                    <button className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all">
                      <Share2 size={20} lg:size={22} className="text-brand-text" />
                    </button>
                  </div>
                  <button onClick={() => toggleSave(post.id)} className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all">
                    <Bookmark size={20} lg:size={22} className={`transition-all ${savedPosts.has(post.id) ? "fill-brand-text text-brand-text" : "text-brand-text"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest cursor-pointer hover:text-brand-text transition-colors">View all comments</p>
                  <div className="flex -space-x-1.5 text-xs">
                    {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/80?u=${i * 10}`} className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 border-white object-cover" alt="" />)}
                    <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[7px] font-black">+5</div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <div className="h-16 lg:h-24" />
    </div>
  );
}
