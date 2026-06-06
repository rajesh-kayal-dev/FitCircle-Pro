import { Heart, MessageCircle, Share2, Bookmark, Plus, Send, Copy, X, CheckCircle, MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, Card, Button, Input } from "../../app/components/ui";
import { VideoPlayer } from "../../app/components/shared/VideoPlayer";
import { useAuth } from "../../context/AuthContext";
import { getUserAvatar } from "../../utils/avatar";
import { toast } from "sonner";

const POSTS = [
  {
    id: 1,
    author: {
      name: "Sachin Gokhale",
      role: "Fitness Coach • Content Creator",
      img: "https://images.unsplash.com/photo-1583500178689-665d1f77e67d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBtYW4lMjBneW0lMjB3b3Jrb3V0JTIwZml0bmVzc3xlbnwxfHx8fDE3NzQwMjY5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true,
    },
    content: "💪 Day 45 of my transformation journey! Progressive overload is the key. Started with 60kg bench press, now hitting 90kg for reps. Consistency > Intensity. Keep pushing! ",
    image: "https://images.unsplash.com/photo-1583500178689-665d1f77e67d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBtYW4lMjBneW0lMjB3b3Jrb3V0JTIwZml0bmVzc3xlbnwxfHx8fDE3NzQwMjY5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: true,
    likes: "2.4k",
    comments: 182,
    time: "2h ago",
    category: "Strength Training",
  },
  {
    id: 2,
    author: {
      name: "Radhika Bose",
      role: "Yoga Expert • Wellness Coach",
      img: "https://images.unsplash.com/photo-1650116384974-a8e4ae69c884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB3b21hbiUyMHlvZ2ElMjBmaXRuZXNzfGVufDF8fHx8MTc3NDAyNjk4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true,
    },
    content: "Finding balance in the chaos 🧘‍ Morning flow to center the mind. Yoga isn't just about flexibility; it's about building mental strength and resilience. Start your day right! ",
    image: "https://images.unsplash.com/photo-1650116384974-a8e4ae69c884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB3b21hbiUyMHlvZ2ElMjBmaXRuZXNzfGVufDF8fHx8MTc3NDAyNjk4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: false,
    likes: "1.8k",
    comments: 94,
    time: "5h ago",
    category: "Yoga",
  },
  {
    id: 3,
    author: {
      name: "Yash Anand",
      role: "Pro Athlete • Bodybuilder",
      img: "https://images.unsplash.com/photo-1693214099504-7f254801d0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBib2R5YnVpbGRlciUyMG11c2NsZXxlbnwxfHx8fDE3NzQwMjY5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true,
    },
    content: "Natural bodybuilding is a marathon, not a sprint 🏃‍ Proper form, consistent nutrition, and unwavering discipline. This is what 3 years of dedication looks like. Your body is a reflection of your lifestyle 💯 #NaturalBodybuilding #IndianFitness",
    image: "https://images.unsplash.com/photo-1693214099504-7f254801d0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBib2R5YnVpbGRlciUyMG11c2NsZXxlbnwxfHx8fDE3NzQwMjY5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: true,
    likes: "4.2k",
    comments: 310,
    time: "8h ago",
    category: "Bodybuilding",
  },
  {
    id: 4,
    author: {
      name: "Guru Mann",
      role: "Fitness Icon • Nutritionist",
      img: "https://images.unsplash.com/photo-1640504409849-da005a55cbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBhdGhsZXRlJTIwcnVubmluZyUyMGV4ZXJjaXNlfGVufDF8fHx8MTc3NDAyNjk4NHww&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true,
    },
    content: "🏃‍ Cardio is NOT just about burning calories! It builds endurance, improves heart health, and boosts mental clarity. Don't skip your cardio days! Even a 20-min run makes a huge difference. Share if you agree! 🙌",
    image: "https://images.unsplash.com/photo-1640504409849-da005a55cbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBhdGhsZXRlJTIwcnVubmluZyUyMGV4ZXJjaXNlfGVufDF8fHx8MTc3NDAyNjk4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    hasVideo: false,
    likes: "3.1k",
    comments: 156,
    time: "12h ago",
    category: "Cardio",
  }
];

export function SocialFeed() {
  const { user } = useAuth();
  const [liked, setLiked] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [shareModalPost, setShareModalPost] = useState(null);

  const toggleLike = (id) => {
    if (liked.includes(id)) {
      setLiked(liked.filter(l => l !== id));
    } else {
      setLiked([...liked, id]);
      toast.success("Post liked!");
    }
  };

  const toggleBookmark = (id) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(b => b !== id));
      toast("Removed from bookmarks");
    } else {
      setBookmarked([...bookmarked, id]);
      toast.success("Saved to bookmarks!");
    }
  };

  const handleShare = (post) => {
    setShareModalPost(post);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://fitcircle.pro/post/${shareModalPost.id}`);
    toast.success("Link copied to clipboard!");
    setShareModalPost(null);
  };

  const shareToSocial = (platform) => {
    toast.success(`Sharing to ${platform}...`);
    setShareModalPost(null);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 lg:pb-0">
      {/* Create Post Header */}
      <Card className="p-5 border-none shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center gap-4">
          <Avatar src={getUserAvatar(user)} name="You" />
          <button className="flex-1 bg-slate-50 text-left px-5 py-3 rounded-2xl text-slate-400 text-sm hover:bg-slate-100 transition-colors">
            Share your progress...
          </button>
          <Button className="rounded-2xl p-3 h-auto">
            <Plus size={20} />
          </Button>
        </div>
      </Card>

      {/* Stories / Spotlight */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { name: "Your Story", img: getUserAvatar(user), isUser: true },
          { name: "Virat Kohli", img: "https://images.unsplash.com/photo-1640504409849-da005a55cbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBhdGhsZXRlJTIwcnVubmluZyUyMGV4ZXJjaXNlfGVufDF8fHx8MTc3NDAyNjk4NHww&ixlib=rb-4.1.0&q=80&w=1080" },
          { name: "Abhinav M.", img: "https://images.unsplash.com/photo-1623941731728-6d9901ee23cd?q=80&w=1470&auto=format&fit=crop" },
          { name: "Fit Girl", img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop" },
          { name: "Rohit Khatri", img: "https://images.unsplash.com/photo-1507398941214-57f5bd6293db?q=80&w=1470&auto=format&fit=crop" },
          { name: "Manoj S.", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" },
          { name: "Yasmin K", img: "https://images.unsplash.com/photo-1552196564-972b49916d3a?q=80&w=1470&auto=format&fit=crop" }
        ].map((story, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
            <div className={`w-16 h-16 rounded-3xl p-1 transition-all group-hover:scale-105 active:scale-95 ${story.isUser ? 'border-2 border-slate-200 border-dashed' : 'bg-gradient-to-tr from-blue-500 to-indigo-500'}`}>
              <div className="w-full h-full rounded-[1.25rem] overflow-hidden border-2 border-white bg-slate-50">
                <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-500 truncate w-16 text-center">{story.name}</span>
          </div>
        ))}
      </div>

      {/* Feed List */}
      <div className="space-y-8">
        {POSTS.map((post) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-100 hover:ring-blue-100 transition-all">
              {/* Post Header */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={post.author.img} name={post.author.name} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-slate-900 leading-tight">{post.author.name}</p>
                      {post.author.verified && <CheckCircle size={14} className="text-blue-500 fill-blue-50" />}
                      <span className="text-xs text-slate-400 font-medium ml-1">• {post.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{post.author.role}</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Post Content */}
              <div className="px-5 pb-4">
                <p className="text-sm text-slate-700 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">{post.category}</span>
                </div>
              </div>

              {/* Post Media */}
              <div className="px-5">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 group/media">
                  {post.hasVideo ? (
                    <VideoPlayer
                      thumbnail={post.image}
                      className="w-full h-full"
                    />
                  ) : (
                    <img src={post.image} alt="post media" className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>

              {/* Post Actions */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-2 group/btn"
                  >
                    <div className={`p-2 rounded-xl transition-all group-hover/btn:bg-rose-50 ${liked.includes(post.id) ? 'bg-rose-50' : 'bg-slate-50'}`}>
                      <Heart
                        size={20}
                        className={`transition-all ${liked.includes(post.id) ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400 group-hover/btn:text-rose-500'}`}
                      />
                    </div>
                    <span className={`text-xs font-bold ${liked.includes(post.id) ? 'text-rose-600' : 'text-slate-500'}`}>{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-2 group/btn">
                    <div className="p-2 rounded-xl bg-slate-50 transition-all group-hover/btn:bg-blue-50">
                      <MessageCircle size={20} className="text-slate-400 group-hover/btn:text-blue-500 transition-colors" />
                    </div>
                    <span className="text-xs font-bold text-slate-500">{post.comments}</span>
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-all"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                <button
                  onClick={() => toggleBookmark(post.id)}
                  className={`p-2 rounded-xl transition-all ${bookmarked.includes(post.id) ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                >
                  <Bookmark size={20} className={bookmarked.includes(post.id) ? 'fill-blue-600' : ''} />
                </button>
              </div>
            </Card>
          </motion.article>
        ))}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareModalPost(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 w-[90%] max-w-md z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Share Post</h3>
                <button
                  onClick={() => setShareModalPost(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={copyLink}
                  className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Copy size={20} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Copy Link</p>
                    <p className="text-xs text-slate-500">Share via link</p>
                  </div>
                </button>

                <button
                  onClick={() => shareToSocial("WhatsApp")}
                  className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Send size={20} className="text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">WhatsApp</p>
                    <p className="text-xs text-slate-500">Share on WhatsApp</p>
                  </div>
                </button>

                <button
                  onClick={() => shareToSocial("Instagram")}
                  className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <Share2 size={20} className="text-pink-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Instagram</p>
                    <p className="text-xs text-slate-500">Share to story</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
