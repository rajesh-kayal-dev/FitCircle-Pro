import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, MessageCircle, Send } from "lucide-react";
import API from "../../../api/axios";

export function StoryViewer({ stories, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [comments, setComments] = useState({});
  const [showCommentPanel, setShowCommentPanel] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  // Fetch comments from backend feed-service when currentIndex changes
  useEffect(() => {
    const fetchStoryComments = async () => {
      if (!stories || stories.length === 0) return;
      const storyId = stories[currentIndex].id;
      try {
        const res = await API.get(`/feed/stories/${storyId}/comments`);
        if (res.data && res.data.comments) {
          setComments((prev) => ({
            ...prev,
            [storyId]: res.data.comments,
          }));
        }
      } catch (err) {
        console.error("Error fetching story comments:", err);
      }
    };
    fetchStoryComments();
  }, [currentIndex, stories]);

  // Story progress timer
  useEffect(() => {
    if (isPaused || showCommentPanel) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1; // 100 steps of 30ms = 3s per story
      });
    }, 30);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused, showCommentPanel, stories]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleCommentSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    const storyId = stories[currentIndex].id;
    try {
      const res = await API.post(`/feed/stories/${storyId}/comment`, {
        text: newComment,
      });

      const addedComment = res.data.comment || {
        id: Date.now(),
        userName: "You",
        text: newComment,
        createdAt: new Date(),
      };

      setComments((prev) => ({
        ...prev,
        [storyId]: [...(prev[storyId] || []), addedComment],
      }));
      setNewComment("");
    } catch (err) {
      console.error("Error adding story comment:", err);
    }
  };

  if (!stories || stories.length === 0) return null;

  const currentStory = stories[currentIndex];
  const currentComments = comments[currentStory.id] || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center text-white select-none">
        
        {/* Desktop Close Button (outside frame) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-3 transition hidden md:block"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Centered Mobile Frame on Desktop, Fullscreen on Mobile */}
        <div className="relative w-full h-full md:h-screen md:w-[480px] overflow-hidden bg-zinc-950 flex flex-col">
          
          {/* Background blurred image underlay */}
          <img
            src={currentStory.image || currentStory.avatar}
            className="w-full h-full object-cover opacity-30 blur-2xl absolute inset-0 pointer-events-none"
            alt=""
          />

          {/* Progress Bars & Header Overlay */}
          <div className="absolute top-0 left-0 right-0 z-20 pt-10 pb-4 px-4 bg-gradient-to-b from-black/90 to-transparent">
            {/* Progress Bars */}
            <div className="flex gap-1 mb-4">
              {stories.map((story, idx) => (
                <div key={story.id} className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-75 ease-linear"
                    style={{
                      width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? "100%" : "0%"
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Header User info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentStory.avatar}
                  className="w-10 h-10 rounded-full border-2 border-brand-orange object-cover"
                  alt=""
                  style={{ maxWidth: '40px', maxHeight: '40px' }}
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight leading-none">{currentStory.name}</span>
                  <span className="text-white/60 text-[10px] mt-1">Active Story</span>
                </div>
              </div>
              
              {/* Close Button inside frame (for mobile primarily) */}
              <button
                onClick={onClose}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 md:hidden"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Story Content Area */}
          <div className="flex-1 relative flex items-center justify-center bg-transparent">
            <img
              src={currentStory.image || currentStory.avatar}
              className="w-full h-auto max-h-full object-contain relative z-10"
              alt="Story content"
            />

            {/* Tap Zones */}
            <div
              className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
              onClick={handlePrev}
            />
            <div
              className="absolute inset-y-0 right-0 w-2/3 z-20 cursor-pointer"
              onClick={handleNext}
            />
          </div>

          {/* Footer Reply & Comments Trigger Area */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8 bg-gradient-to-t from-black/90 to-transparent flex items-center gap-3">
            <input
              type="text"
              placeholder="Send comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleCommentSubmit();
                }
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 focus:bg-white/25 border border-white/20 rounded-full px-5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-all placeholder:text-white/50"
            />
            <button
              onClick={() => setShowCommentPanel(true)}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition flex items-center justify-center relative"
            >
              <MessageCircle className="w-4 h-4" />
              {currentComments.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-orange text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {currentComments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleCommentSubmit()}
              className="p-2.5 bg-brand-orange hover:bg-orange-600 rounded-full text-white transition flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Comment Drawer (Slide-up Overlay) */}
          <AnimatePresence>
            {showCommentPanel && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-x-0 bottom-0 h-[60%] bg-zinc-950/98 backdrop-blur-md rounded-t-3xl border-t border-zinc-800 z-30 flex flex-col text-white"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                  <span className="font-bold text-xs tracking-wider uppercase">Story Comments</span>
                  <button
                    onClick={() => setShowCommentPanel(false)}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentComments.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
                      No comments yet. Leave a reaction!
                    </div>
                  ) : (
                    currentComments.map((comment) => (
                      <div key={comment._id || comment.id} className="flex gap-3 text-xs">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                          {comment.userName ? comment.userName[0].toUpperCase() : "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="font-bold text-zinc-300">{comment.userName || "User"}</span>
                            <span className="text-[9px] text-zinc-500">
                              {new Date(comment.createdAt || comment.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-zinc-200 leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input in panel */}
                <div className="p-4 border-t border-zinc-800 flex gap-2 items-center bg-zinc-950">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Reply to story..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-brand-orange transition"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleCommentSubmit();
                      }
                    }}
                  />
                  <button
                    onClick={() => handleCommentSubmit()}
                    className="bg-brand-orange hover:bg-orange-600 text-white rounded-full p-2.5 transition flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex absolute inset-y-0 left-0 right-0 pointer-events-none items-center justify-between px-4 z-20">
            {currentIndex > 0 ? (
              <button
                onClick={handlePrev}
                className="w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition pointer-events-auto shadow-md"
              >
                <ChevronLeft size={16} />
              </button>
            ) : (
              <div />
            )}
            {currentIndex < stories.length - 1 ? (
              <button
                onClick={handleNext}
                className="w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition pointer-events-auto shadow-md"
              >
                <ChevronRight size={16} />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
