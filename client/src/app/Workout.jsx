import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Play, Heart, Bookmark, Share2, Clock, Flame, Dumbbell, Zap, Waves, Brain, ChevronRight, Activity, Music, X, Loader2, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { searchWorkoutVideos } from "../api/endpoints";
import { toast } from "sonner";

// Workouts will be fetched dynamically from the API

const categories = [
  { name: "Strength", icon: Dumbbell },
  { name: "Cardio", icon: Zap },
  { name: "Yoga", icon: Brain },
  { name: "Swimming", icon: Waves },
];

export default function Workout() {
  const [activeTab, setActiveTab] = useState("Strength");
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  // Per-video like/save — persisted in localStorage
  const [likedVideos, setLikedVideos] = useState(() =>
    new Set(JSON.parse(localStorage.getItem("likedWorkoutVideos") || "[]"))
  );
  const [savedVideos, setSavedVideos] = useState(() =>
    new Set(JSON.parse(localStorage.getItem("savedWorkoutVideos") || "[]"))
  );

  const toggleLike = (videoId) => {
    setLikedVideos(prev => {
      const next = new Set(prev);
      next.has(videoId) ? next.delete(videoId) : next.add(videoId);
      localStorage.setItem("likedWorkoutVideos", JSON.stringify([...next]));
      return next;
    });
  };

  const toggleSave = (videoId) => {
    setSavedVideos(prev => {
      const next = new Set(prev);
      const wasSaved = next.has(videoId);
      wasSaved ? next.delete(videoId) : next.add(videoId);
      localStorage.setItem("savedWorkoutVideos", JSON.stringify([...next]));
      toast(wasSaved ? "Removed from saved" : "Saved to your workouts");
      return next;
    });
  };

  const handleShare = (workout) => {
    const url = `https://www.youtube.com/watch?v=${workout.videoId}`;
    if (navigator.share) {
      navigator.share({ title: workout.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast("Link copied to clipboard");
    }
  };

  React.useEffect(() => {
    const fetchFeed = async () => {
      setLoadingWorkouts(true);
      try {
        const { data } = await searchWorkoutVideos(activeTab + " workout");
        setWorkouts(data?.videos || []);
      } catch (err) {
        console.error("Failed to load workouts feed", err);
      } finally {
        setLoadingWorkouts(false);
      }
    };
    fetchFeed();
  }, [activeTab]);

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);


  const handleWorkoutClick = async (workout) => {

    setSelectedWorkout(workout);
    setVideoLoading(true);
    setVideoData(null);
    try {
      if (workout.videoId) {
        setVideoData(workout);
      } else {
        const { data } = await searchWorkoutVideos(workout.title + " workout");
        if (data && data.videos && data.videos.length > 0) {
          setVideoData(data.videos[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load video", err);
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 lg:p-8">
      {/* ─── VIBES BANNER ─── */}
      <div className="mb-8 bg-gradient-to-r from-accent-orange to-accent-red rounded-3xl p-6 lg:p-8 relative overflow-hidden group cursor-pointer shadow-xl shadow-accent-orange/20" onClick={() => navigate('/vibes')}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        <div className="absolute right-0 top-0 w-64 h-full">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop" alt="Music" className="w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-red to-transparent" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                <Music className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/90 text-[10px] font-black uppercase tracking-widest">Vibe Zone</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white mb-2 tracking-tight">Train with Music</h2>
            <p className="text-white/80 font-medium text-sm">Listen to curated tracks to fuel your sessions</p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-accent-orange transition-all duration-300 text-white shadow-lg">
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">My Workouts</h1>
          <p className="text-slate-500 font-medium">Ready to break your limits today?</p>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 lg:pb-0 w-full lg:w-auto px-1">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(cat.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${activeTab === cat.name
                  ? "bg-white text-slate-900 border-slate-200"
                  : "bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100"
                }`}
            >
              <cat.icon className={`w-4 h-4 ${activeTab === cat.name ? "text-accent-orange" : "text-slate-400"}`} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
          <button className="text-accent-orange font-bold text-sm flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loadingWorkouts ? (
          <div className="flex justify-center items-center py-12 w-full">
            <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workouts.map((workout) => (
              <motion.div
                key={workout.videoId || workout.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                onClick={() => handleWorkoutClick(workout)}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md shadow-slate-200/50 flex flex-col cursor-pointer"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={workout.thumbnail || `https://img.youtube.com/vi/${workout.videoId}/hqdefault.jpg`}
                    alt={workout.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      if (!e.target.src.includes("hqdefault")) {
                        e.target.src = `https://img.youtube.com/vi/${workout.videoId}/hqdefault.jpg`;
                      } else {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400/1e293b/ffffff?text=Workout";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-slate-900 shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1 group-hover:text-accent-orange transition-colors" fill="currentColor" />
                    </div>
                  </div>
                  {/* Like button on card */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(workout.videoId); }}
                    className="absolute top-3 left-3 p-2 bg-black/40 backdrop-blur-sm rounded-full transition-all hover:bg-black/60"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${likedVideos.has(workout.videoId) ? "text-red-400 fill-red-400" : "text-white"}`}
                    />
                  </button>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
                    <Activity className="w-3 h-3 text-accent-red" />
                    {workout.kcal} KCAL
                  </div>
                </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${workout.color || 'text-accent-orange'}`}>{workout.category}</span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold">{workout.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-6">{workout.title}</h3>

                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Level</span>
                      <span className="text-sm font-black text-slate-900">{workout.level}</span>
                    </div>
                    <div className="h-6 w-[1px] bg-slate-100" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Type</span>
                      <span className="text-sm font-black text-slate-900">Video</span>
                    </div>
                  </div>

                  <button className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-accent-orange transition-colors shadow-lg shadow-slate-200">
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                  </button>
                </div>
              </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tighter">Personal Training</h2>
          <p className="text-slate-400 mb-8 font-medium leading-relaxed">Get a customized workout plan tailored specifically for your body and goals by our elite AI coaches.</p>
          <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-accent-orange hover:text-white transition-all shadow-xl shadow-black/20">
            Start AI Evaluation
          </button>
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400" alt="Trainer" className="w-full h-full object-cover opacity-50 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
        </div>
      </div>

      <AnimatePresence>
        {selectedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => {
              setSelectedWorkout(null);
              setVideoData(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-900">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-orange/20 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-accent-orange" />
                  </div>
                  <span className="font-black text-white uppercase tracking-widest text-sm">FitCircle Workout</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedWorkout(null);
                    setVideoData(null);
                  }}
                  className="p-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                {videoLoading ? (
                  <div className="flex flex-col items-center justify-center text-white/70">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-accent-orange" />
                    <p className="font-medium">Loading {selectedWorkout.title}...</p>
                  </div>
                ) : videoData ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoData.videoId}?autoplay=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&color=white`}
                    title="FitCircle Workout Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-white/70 font-medium">
                    No tutorial video found for this exercise.
                  </div>
                )}
              </div>
              <div className="p-5 md:p-7 bg-slate-900">
                <h2 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight">{selectedWorkout.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-400 mb-5 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selectedWorkout.duration}</span>
                  <span className="text-slate-700">•</span>
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-accent-orange" />{selectedWorkout.kcal} KCAL</span>
                  {selectedWorkout.viewCount > 0 && (
                    <>
                      <span className="text-slate-700">•</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{(selectedWorkout.viewCount / 1000).toFixed(0)}K views</span>
                    </>
                  )}
                </div>

                {/* Action bar: Like / Save / Share */}
                <div className="flex items-center gap-3 mb-5">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => toggleLike(selectedWorkout.videoId)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      likedVideos.has(selectedWorkout.videoId)
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedVideos.has(selectedWorkout.videoId) ? "fill-red-400" : ""}`} />
                    {likedVideos.has(selectedWorkout.videoId) ? "Liked" : "Like"}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => toggleSave(selectedWorkout.videoId)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      savedVideos.has(selectedWorkout.videoId)
                        ? "bg-accent-orange/20 text-accent-orange border border-accent-orange/30"
                        : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${savedVideos.has(selectedWorkout.videoId) ? "fill-accent-orange" : ""}`} />
                    {savedVideos.has(selectedWorkout.videoId) ? "Saved" : "Save"}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleShare(selectedWorkout)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </motion.button>
                </div>

                <a
                  href={`https://www.youtube.com/watch?v=${selectedWorkout.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-gradient-to-r from-accent-orange to-accent-red text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-xl hover:shadow-accent-orange/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" fill="currentColor" /> Open on YouTube
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
