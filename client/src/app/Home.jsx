import { Heart, MessageCircle, Bookmark, Share2, Flame, Play, X, Plus, Video, Newspaper, Dumbbell, Sparkles, Clock, Check, Copy, ExternalLink, Send, Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StoryViewer } from "./components/feed/StoryViewer";
import { ReelsViewer } from "./components/feed/ReelsViewer";
import API from "../api/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const stories = [
  { id: "s1", name: "Your Story", avatar: "https://ui-avatars.com/api/?name=You&background=6366f1&color=fff&bold=true&size=80", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=700&fit=crop", isYourStory: true },
  { id: "s2", name: "Sahil Khan", avatar: "https://ui-avatars.com/api/?name=Sahil+Khan&background=ff6b35&color=fff&bold=true&size=80", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=700&fit=crop" },
  { id: "s3", name: "Yasmin K.", avatar: "https://ui-avatars.com/api/?name=Yasmin+K&background=ef4444&color=fff&bold=true&size=80", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=700&fit=crop" },
  { id: "s4", name: "Rahul S.", avatar: "https://ui-avatars.com/api/?name=Rahul+S&background=22c55e&color=fff&bold=true&size=80", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=700&fit=crop" },
  { id: "s5", name: "Nandini G.", avatar: "https://ui-avatars.com/api/?name=Nandini+G&background=a855f7&color=fff&bold=true&size=80", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=700&fit=crop" },
  { id: "s6", name: "Aryan S.", avatar: "https://ui-avatars.com/api/?name=Aryan+S&background=06b6d4&color=fff&bold=true&size=80", image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=700&fit=crop" },
  { id: "s7", name: "Priya M.", avatar: "https://ui-avatars.com/api/?name=Priya+M&background=f97316&color=fff&bold=true&size=80", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=700&fit=crop" },
  { id: "s8", name: "Arjun K.", avatar: "https://ui-avatars.com/api/?name=Arjun+K&background=ec4899&color=fff&bold=true&size=80", image: "https://images.unsplash.com/photo-1594737626072-90dcfbc3c7d8?w=400&h=700&fit=crop" },
];

const storyRingColors = [
  "from-brand-orange via-brand-red to-brand-pink",
  "from-brand-purple via-brand-pink to-brand-orange",
  "from-brand-cyan via-brand-green to-brand-amber",
  "from-brand-amber via-brand-orange to-brand-red",
];

const sourceConfig = {
  YouTube: { icon: Video, color: "text-red-500", bg: "bg-red-50", label: "Video" },
  Tavily: { icon: Newspaper, color: "text-blue-500", bg: "bg-blue-50", label: "Article" },
  ExerciseDB: { icon: Dumbbell, color: "text-green-500", bg: "bg-green-50", label: "Exercise" },
};

export default function Home() {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [trendingData, setTrendingData] = useState([]);
  const [reelsData, setReelsData] = useState([]);
  const [reelsLoading, setReelsLoading] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(null);
  const [showProgress, setShowProgress] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const { ref, inView } = useInView();
  const [communityPosts, setCommunityPosts] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);

  // Comment Modal State
  const [commentModalPost, setCommentModalPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [commentsPage, setCommentsPage] = useState(1);

  // Share Modal State
  const [shareModalPost, setShareModalPost] = useState(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  // Video player state
  const [playingVideo, setPlayingVideo] = useState(null);

  // Like/Unlike loading states (for rollback tracking)
  const [likeProcessing, setLikeProcessing] = useState(new Set());
  const [saveProcessing, setSaveProcessing] = useState(new Set());

  const [discoverLikeMap, setDiscoverLikeMap] = useState({});
  const [discoverSaveMap, setDiscoverSaveMap] = useState({});

  /* ── Infinite Query: Discover Feed ── */
  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['discoverFeed', activeTab],
    queryFn: async ({ pageParam = '' }) => {
      const categoryParam = activeTab === "All" ? "" : activeTab;
      const res = await API.get(`/feed/reddit?category=${categoryParam}&after=${pageParam}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage?.after || undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage]);

  const discoverPosts = feedData?.pages.flatMap((page, pageIdx) =>
    (page.posts || []).map((post, postIdx) => ({ ...post, _uid: `${pageIdx}-${postIdx}-${post._id || post.id}` }))
  ) || [];

  useEffect(() => {
    if (!feedData?.pages) return;
    const likes = {};
    const saves = {};
    feedData.pages.forEach(page => {
      (page.posts || []).forEach(p => {
        if (p.liked) likes[p._id || p.id] = true;
        if (p.saved) saves[p._id || p.id] = true;
      });
    });
    setLikedPosts(prev => {
      let changed = false;
      const s = new Set(prev);
      Object.keys(likes).forEach(k => { if (!s.has(k)) { s.add(k); changed = true; } });
      return changed ? s : prev;
    });
    setSavedPosts(prev => {
      let changed = false;
      const s = new Set(prev);
      Object.keys(saves).forEach(k => { if (!s.has(k)) { s.add(k); changed = true; } });
      return changed ? s : prev;
    });
  }, [feedData?.pages?.length]);

  const formatTime = (value) => {
    if (!value) return "";
    let date;
    if (typeof value === "number" || !isNaN(Number(value))) {
      date = new Date(Number(value) * 1000);
    } else {
      date = new Date(value);
    }
    if (isNaN(date.getTime())) return "";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  /* ── Trending Topics ── */
  useEffect(() => {
    API.get("/feed/trending").then(res => {
      if (res.data && res.data.topics) setTrendingData(res.data.topics);
    }).catch(() => {});
  }, []);

  /* ── Trending Reels ── */
  useEffect(() => {
    setReelsLoading(true);
    API.get("/feed/reels?per_page=10").then(res => {
      if (res.data && res.data.videos) setReelsData(res.data.videos);
    }).catch(() => {}).finally(() => setReelsLoading(false));
  }, []);

  /* ── Community Feed ── */
  useEffect(() => {
    setCommunityLoading(true);
    API.get("/feed").then(res => {
      if (Array.isArray(res.data)) setCommunityPosts(res.data);
    }).catch(() => {}).finally(() => setCommunityLoading(false));
  }, []);

  // ── Like Handler ─────────────────────────────────────────────────────
  const handleLike = async (postId, e) => {
    if (e) e.stopPropagation();
    if (!user) { toast.error("Sign in to like posts"); return; }
    if (likeProcessing.has(postId)) return;

    const wasLiked = likedPosts.has(postId);
    setLikedPosts(prev => {
      const s = new Set(prev);
      wasLiked ? s.delete(postId) : s.add(postId);
      return s;
    });

    setLikeProcessing(prev => new Set(prev).add(postId));

    try {
      if (wasLiked) {
        await API.delete(`/feed/posts/${postId}/like`);
      } else {
        await API.post(`/feed/posts/${postId}/like`);
      }
    } catch {
      setLikedPosts(prev => {
        const s = new Set(prev);
        wasLiked ? s.add(postId) : s.delete(postId);
        return s;
      });
      toast.error("Failed to update like");
    } finally {
      setLikeProcessing(prev => {
        const s = new Set(prev);
        s.delete(postId);
        return s;
      });
    }
  };

  // ── Save Handler ─────────────────────────────────────────────────────
  const handleSave = async (postId, e) => {
    if (e) e.stopPropagation();
    if (!user) { toast.error("Sign in to save posts"); return; }
    if (saveProcessing.has(postId)) return;

    const wasSaved = savedPosts.has(postId);
    setSavedPosts(prev => {
      const s = new Set(prev);
      wasSaved ? s.delete(postId) : s.add(postId);
      return s;
    });

    setSaveProcessing(prev => new Set(prev).add(postId));

    try {
      if (wasSaved) {
        await API.delete(`/feed/posts/${postId}/save`);
      } else {
        await API.post(`/feed/posts/${postId}/save`);
      }
    } catch {
      setSavedPosts(prev => {
        const s = new Set(prev);
        wasSaved ? s.add(postId) : s.delete(postId);
        return s;
      });
      toast.error("Failed to save post");
    } finally {
      setSaveProcessing(prev => {
        const s = new Set(prev);
        s.delete(postId);
        return s;
      });
    }
  };

  // ── Comment Modal ────────────────────────────────────────────────────
  const openCommentModal = async (post) => {
    if (!user) { toast.error("Sign in to comment"); return; }
    setCommentModalPost(post);
    setCommentText("");
    setCommentsPage(1);
    setCommentsLoading(true);
    try {
      const res = await API.get(`/feed/posts/${post._id || post.id}/comments?page=1&limit=20`);
      setPostComments(res.data.comments || []);
      setCommentsTotal(res.data.total || 0);
    } catch {
      setPostComments([]);
      setCommentsTotal(0);
    } finally {
      setCommentsLoading(false);
    }
  };

  const closeCommentModal = () => {
    setCommentModalPost(null);
    setPostComments([]);
    setCommentText("");
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await API.post(`/feed/posts/${commentModalPost._id || commentModalPost.id}/comments`, { text: commentText.trim() });
      const newComment = res.data.comment;
      setPostComments(prev => [newComment, ...prev]);
      setCommentsTotal(prev => res.data.commentCount || prev + 1);
      setCommentText("");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const loadMoreComments = async () => {
    if (!commentModalPost) return;
    const nextPage = commentsPage + 1;
    setCommentsLoading(true);
    try {
      const res = await API.get(`/feed/posts/${commentModalPost._id || commentModalPost.id}/comments?page=${nextPage}&limit=20`);
      setPostComments(prev => [...prev, ...(res.data.comments || [])]);
      setCommentsPage(nextPage);
    } catch {
      toast.error("Failed to load more comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  // ── Share Handler ────────────────────────────────────────────────────
  const handleShare = async (post, e) => {
    if (e) e.stopPropagation();
    if (!user) { toast.error("Sign in to share"); return; }
    setShareModalPost(post);

    try {
      await API.post(`/feed/posts/${post._id || post.id}/share`);
    } catch {}
  };

  const copyShareLink = async () => {
    if (!shareModalPost) return;
    const link = shareModalPost.url || window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      setShareLinkCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setShareLinkCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const closeShareModal = () => {
    setShareModalPost(null);
    setShareLinkCopied(false);
  };

  const handleShareExternal = () => {
    if (!shareModalPost || !shareModalPost.url) return;
    window.open(shareModalPost.url, '_blank');
  };

  // ── Handlers for external links ──────────────────────────────────────
  const openExternalLink = (url, e) => {
    if (e) e.stopPropagation();
    if (url && url !== "#") window.open(url, '_blank');
  };

  const formatCount = (n) => n > 999 ? (n / 1000).toFixed(1) + 'k' : n;

  /* ── Source Badge ── */
  const SourceBadge = ({ source }) => {
    const cfg = sourceConfig[source] || { icon: Sparkles, color: "text-gray-500", bg: "bg-gray-50", label: source };
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
        <Icon size={10} /> {cfg.label}
      </span>
    );
  };

  return (
    <div className="w-full max-w-full lg:max-w-[1400px] mx-auto px-0 lg:px-8 transition-all duration-300">
      {/* ── Story Viewer Overlay ── */}
      {activeStoryIndex !== null && (
        <StoryViewer stories={stories} initialIndex={activeStoryIndex} onClose={() => setActiveStoryIndex(null)} />
      )}

      {/* ── Reels Viewer Overlay ── */}
      {activeReelIndex !== null && reelsData.length > 0 && (
        <ReelsViewer reels={reelsData} initialIndex={activeReelIndex} onClose={() => setActiveReelIndex(null)} />
      )}

      {/* ── Comment Modal ── */}
      <AnimatePresence>
        {commentModalPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closeCommentModal}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", damping: 25 }} className="bg-white w-full sm:max-w-lg sm:rounded-[2rem] rounded-t-[2rem] max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
                <h3 className="text-sm font-black uppercase tracking-wider">Comments ({commentsTotal})</h3>
                <button onClick={closeCommentModal} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><X size={18} /></button>
              </div>

              <div className="px-6 py-3 border-b border-gray-50">
                <p className="text-sm font-bold text-brand-text line-clamp-1">{commentModalPost.title}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-[200px] max-h-[50vh]">
                {commentsLoading && commentsPage === 1 ? (
                  <div className="flex justify-center py-8"><Loader size={20} className="animate-spin text-brand-muted" /></div>
                ) : postComments.length === 0 ? (
                  <p className="text-center text-brand-muted text-sm py-8">No comments yet. Be the first!</p>
                ) : (
                  <>
                    {postComments.map((c, i) => (
                      <div key={c._id || i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center text-white text-[10px] font-black shrink-0">
                          {(c.userName || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-black text-brand-text">{c.userName || "User"}</span>
                            <span className="text-[9px] text-brand-muted">{c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : ""}</span>
                          </div>
                          <p className="text-sm text-brand-text/80 mt-0.5">{c.text}</p>
                        </div>
                      </div>
                    ))}
                    {postComments.length < commentsTotal && (
                      <button onClick={loadMoreComments} className="text-xs font-bold text-brand-orange hover:underline w-full text-center py-2" disabled={commentsLoading}>
                        {commentsLoading ? "Loading..." : `Load more comments (${commentsTotal - postComments.length} remaining)`}
                      </button>
                    )}
                  </>
                )}
              </div>

              <form onSubmit={handleSubmitComment} className="p-4 border-t border-gray-100 flex gap-3 items-center">
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 border border-gray-200"
                  maxLength={500}
                />
                <button type="submit" disabled={!commentText.trim() || submittingComment}
                  className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white disabled:opacity-40 transition-all hover:bg-brand-orange/90 shrink-0"
                >
                  {submittingComment ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Share Modal ── */}
      <AnimatePresence>
        {shareModalPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closeShareModal}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", damping: 25 }} className="bg-white w-full sm:max-w-sm sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
                <h3 className="text-sm font-black uppercase tracking-wider">Share</h3>
                <button onClick={closeShareModal} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><X size={18} /></button>
              </div>

              <div className="px-6 py-3 border-b border-gray-50">
                <p className="text-sm font-bold text-brand-text line-clamp-1">{shareModalPost.title}</p>
              </div>

              <div className="p-6 space-y-3">
                <button onClick={copyShareLink} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                    {shareLinkCopied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-brand-orange" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{shareLinkCopied ? "Copied!" : "Copy Link"}</p>
                    <p className="text-[10px] text-brand-muted">Share this post with friends</p>
                  </div>
                </button>

                {shareModalPost.url && shareModalPost.url !== "#" && (
                  <button onClick={handleShareExternal} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <ExternalLink size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Open Original</p>
                      <p className="text-[10px] text-brand-muted">View source article or video</p>
                    </div>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 lg:space-y-8 mt-4 lg:mt-6">

        {/* ═══ STORIES SECTION ═══ */}
        <section className="px-4 lg:px-0">
          <div className="flex overflow-x-auto gap-4 lg:gap-5 hide-scrollbar snap-x pb-2">
            {stories.map((story, idx) => (
              <button key={story.id} onClick={() => setActiveStoryIndex(idx)} className="flex flex-col items-center gap-1.5 snap-start shrink-0 group cursor-pointer">
                <div className={`p-[2.5px] rounded-full ${story.isYourStory ? "bg-gray-200" : "bg-gradient-to-br " + storyRingColors[idx % storyRingColors.length]} shadow-md`}>
                  <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full border-[3px] border-white overflow-hidden bg-gray-100">
                    <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                    {story.isYourStory && (
                      <div className="absolute bottom-0 right-0 w-5 h-5 lg:w-6 lg:h-6 bg-brand-orange rounded-full border-2 border-white flex items-center justify-center">
                        <Plus size={10} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] lg:text-xs font-bold text-brand-text truncate max-w-[72px] lg:max-w-[88px] text-center">{story.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ═══ DAILY MILESTONE ═══ */}
        <AnimatePresence>
          {showProgress && (
            <motion.section
              className="relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden energy-gradient text-white p-5 lg:p-7 mx-4 lg:mx-0 shadow-lg shadow-brand-orange/20"
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

        {/* ═══ TRENDING REELS ═══ */}
        <section className="px-4 lg:px-0">
          <div className="flex items-center justify-between mb-4 lg:mb-5">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-gradient-to-br from-red-500 to-brand-orange flex items-center justify-center shadow-lg shadow-red-500/20">
                <Play size={14} className="text-white fill-white ml-0.5" />
              </div>
              <h3 className="text-base lg:text-xl font-black text-brand-text uppercase tracking-tighter">Trending Reels</h3>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-3 lg:gap-4 hide-scrollbar snap-x pb-2">
            {reelsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="min-w-[160px] sm:min-w-[180px] lg:min-w-[200px] rounded-[1.5rem] bg-gray-100 animate-pulse h-[260px] lg:h-[300px] snap-start shrink-0" />
              ))
            ) : reelsData.length === 0 ? (
              <p className="text-brand-muted text-sm py-8">No reels available right now.</p>
            ) : (
              reelsData.map((reel, idx) => (
                <motion.button
                  key={reel.id}
                  onClick={() => setActiveReelIndex(idx)}
                  whileHover={{ y: -4 }}
                  className="relative min-w-[160px] sm:min-w-[180px] lg:min-w-[200px] rounded-[1.5rem] lg:rounded-[1.8rem] overflow-hidden group shadow-md bg-gray-50 h-[260px] lg:h-[300px] snap-start shrink-0 cursor-pointer text-left"
                >
                  <img src={reel.videoThumb || reel.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock size={10} /> {reel.duration || "0:30"}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
                    <p className="text-white text-[11px] font-bold leading-tight drop-shadow-md line-clamp-1">{reel.user || reel.author?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Heart size={10} className="text-red-400 fill-red-400" />
                      <span className="text-white/80 text-[9px] font-medium">{formatCount(reel.likesCount || reel.likes || 0)}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play size={20} className="text-brand-text ml-0.5 fill-brand-text" />
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </section>

        {/* ═══ TRENDING TOPICS ═══ */}
        {trendingData.length > 0 && (
          <section className="bg-white rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-sm p-4 lg:p-6 mx-4 lg:mx-0">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl purple-gradient flex items-center justify-center shadow-lg shadow-brand-purple/20">
                  <Flame size={14} className="text-white fill-white" />
                </div>
                <h3 className="text-base lg:text-xl font-black text-brand-text uppercase tracking-tighter">Trending Now</h3>
              </div>
            </div>
            <div className="flex overflow-x-auto lg:grid lg:grid-cols-5 gap-3 lg:gap-4 hide-scrollbar snap-x lg:overflow-visible pb-1 lg:pb-0">
              {trendingData.map((topic, i) => (
                <motion.a href={topic.url} target="_blank" rel="noreferrer" key={topic.id} whileHover={{ y: -6 }}
                  className="relative min-w-[160px] sm:min-w-[180px] lg:min-w-0 rounded-[1.5rem] lg:rounded-[1.8rem] overflow-hidden group shadow-md bg-gray-50 h-[120px] lg:h-[150px] snap-start flex-shrink-0 flex flex-col"
                >
                  <img src={topic.image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-col gap-1">
                    <span className="text-brand-orange text-[8px] font-black uppercase tracking-widest">TOPIC #{i + 1}</span>
                    <span className="text-white text-[11px] font-bold leading-tight drop-shadow-md line-clamp-2">{topic.title}</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ═══ DISCOVER FEED ═══ */}
      <section className="py-8 lg:py-10 px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-10 gap-4 lg:gap-6">
          <div>
            <h2 className="text-2xl lg:text-4xl font-black text-brand-text uppercase tracking-tighter mb-1">Discover</h2>
            <p className="text-brand-muted text-xs lg:text-base font-medium">Trending fitness articles, videos, and routines</p>
          </div>
          <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-[1.2rem] shadow-inner w-fit overflow-x-auto hide-scrollbar">
            {["All", "Fitness", "Nutrition", "Weight Loss", "Muscle Gain"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-[10px] lg:text-xs font-black rounded-xl transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === tab ? "bg-white text-brand-text shadow-sm border border-gray-200" : "text-brand-muted hover:text-brand-text"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {discoverPosts.map((post) => {
            const postId = post._id || post.id;
            const sourceInfo = sourceConfig[post.source] || { icon: Sparkles, color: "text-gray-500", bg: "bg-gray-50", label: post.source };
            const SourceIcon = sourceInfo.icon;
            return (
              <motion.article key={post._uid} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-brand-orange/10 transition-all duration-500 group flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 lg:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-[2.5px] rounded-full bg-gradient-to-br from-brand-orange to-brand-red shadow-md shrink-0">
                      <img src={post.author?.avatar} onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=User&background=random' }} alt="" className="w-11 h-11 rounded-full border-2 border-white object-cover bg-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-brand-text group-hover:text-brand-orange transition-colors truncate">{post.author?.name}</h4>
                        {/* Source badge opens external link */}
                        <button onClick={(e) => openExternalLink(post.url, e)} className="cursor-pointer">
                          <SourceBadge source={post.source} />
                        </button>
                      </div>
                      <p className="text-[10px] text-brand-muted font-bold tracking-tight truncate flex items-center gap-1 mt-0.5">
                        {post.subreddit && <span className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded uppercase text-[8px]">{post.subreddit}</span>}
                        {post.createdAt && <span>• {formatTime(post.createdAt)}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {post.url && post.url !== "#" && (
                      <button onClick={(e) => openExternalLink(post.url, e)} className="p-2 hover:bg-gray-50 rounded-full text-brand-muted transition-colors"><ExternalLink size={18} /></button>
                    )}
                  </div>
                </div>

                {/* Title - opens external link */}
                <div className="px-6 pb-2 flex-grow cursor-pointer" onClick={(e) => openExternalLink(post.url, e)}>
                  <p className="text-sm text-brand-text/90 font-bold leading-relaxed hover:text-brand-orange transition-colors">{post.title}</p>
                </div>

                {/* Summary / selftext */}
                {post.selftext && (
                  <div className="px-6 pb-4">
                    <p className="text-xs text-brand-text/70 line-clamp-3 leading-relaxed">{post.selftext}</p>
                  </div>
                )}

                {/* Media - opens external link for images, plays inline for videos */}
                {post.image && (
                  <div className="w-full aspect-[16/10] lg:aspect-[16/9] bg-gray-100 overflow-hidden relative group-hover:ring-1 group-hover:ring-brand-orange/10 cursor-pointer"
                    onClick={post.source === "YouTube" ? undefined : (e) => openExternalLink(post.url, e)}
                  >
                    {post.source === "YouTube" && post.fallbackUrl ? (
                      <div className="relative w-full h-full bg-black" onClick={e => e.stopPropagation()}>
                        {playingVideo === (post._id || post.id) ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${new URL(post.fallbackUrl).searchParams.get("v")}?autoplay=1&rel=0`}
                            className="w-full h-full absolute inset-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="YouTube video"
                          />
                        ) : (
                          <>
                            <img src={post.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                            <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); setPlayingVideo(post._id || post.id); }}>
                              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors">
                                <Play size={28} className="text-white ml-0.5 fill-white" />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : post.isVideo && post.fallbackUrl ? (
                      <video src={post.fallbackUrl} poster={post.image} controls className="w-full h-full object-contain bg-black" controlsList="nodownload" onClick={e => e.stopPropagation()} />
                    ) : (
                      <img src={post.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={(e) => { e.target.style.display = 'none' }} />
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="p-6 lg:p-7">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Like */}
                      <button onClick={(e) => handleLike(postId, e)} className="flex items-center gap-2 group/like">
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover/like:bg-brand-red/10">
                          <Flame size={20} className={`transition-all ${likedPosts.has(postId) ? "fill-brand-orange text-brand-orange scale-110" : "text-brand-orange"}`} />
                        </div>
                        <span className="text-xs font-black italic">{formatCount(post.upvotes || 0)}</span>
                      </button>
                      {/* Comment */}
                      <button onClick={() => openCommentModal(post)} className="flex items-center gap-2 group/comm">
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover/comm:bg-brand-orange/10">
                          <MessageCircle size={20} className="text-brand-text" />
                        </div>
                        <span className="text-xs font-black italic">{formatCount(post.comments || 0)}</span>
                      </button>
                      {/* Share */}
                      <button onClick={(e) => handleShare(post, e)} className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all hover:bg-brand-orange/10">
                        <Share2 size={20} className="text-brand-text" />
                      </button>
                    </div>
                    {/* Save */}
                    <button onClick={(e) => handleSave(postId, e)} className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all hover:bg-brand-orange/10">
                      <Bookmark size={20} className={`transition-all ${savedPosts.has(postId) ? "fill-brand-text text-brand-text" : "text-brand-text"}`} />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Load More */}
        <div ref={ref} className="h-10 flex items-center justify-center mt-6">
          {isFetchingNextPage && <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />}
          {!hasNextPage && discoverPosts.length > 0 && (
            <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">You're all caught up</p>
          )}
        </div>
      </section>

      {/* ═══ COMMUNITY FEED ═══ */}
      <section className="px-4 lg:px-0 pb-8 lg:pb-10">
        <div className="flex items-center gap-2 lg:gap-3 mb-6 lg:mb-8">
          <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center shadow-lg shadow-brand-purple/20">
            <MessageCircle size={14} className="text-white" />
          </div>
          <h2 className="text-lg lg:text-2xl font-black text-brand-text uppercase tracking-tighter">Community Feed</h2>
        </div>

        {communityLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gray-200" />
                  <div className="space-y-2"><div className="h-3 w-24 bg-gray-200 rounded" /><div className="h-2 w-16 bg-gray-100 rounded" /></div>
                </div>
                <div className="h-3 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : communityPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[2rem] border border-gray-100">
            <MessageCircle size={32} className="mx-auto text-brand-muted mb-2" />
            <p className="text-brand-muted text-sm font-medium">No community posts yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {communityPosts.slice(0, 5).map((post) => (
              <motion.div key={post._id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 lg:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={post.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.name || 'User')}&background=random`}
                    alt="" className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover bg-white" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=User&background=random' }} />
                  <div>
                    <h4 className="text-sm font-black text-brand-text">{post.user?.name || "FitCircle Member"}</h4>
                    <p className="text-[10px] text-brand-muted font-bold">{formatTime(post.createdAt)}</p>
                  </div>
                </div>
                <p className="text-sm text-brand-text/80 font-medium leading-relaxed">{post.caption || post.content}</p>
                {post.media && (
                  <div className="mt-3 rounded-2xl overflow-hidden">
                    <img src={post.media} alt="" className="w-full max-h-80 object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                  <button className="flex items-center gap-1.5 text-brand-muted hover:text-brand-red transition-colors text-xs font-bold">
                    <Heart size={14} /> {post.likes?.length || 0}
                  </button>
                  <button className="flex items-center gap-1.5 text-brand-muted hover:text-brand-orange transition-colors text-xs font-bold">
                    <MessageCircle size={14} /> {post.comments?.length || 0}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <div className="h-20 lg:h-24" />
    </div>
  );
}