import React, { useState, useEffect, useRef } from 'react';
import API from '../../../api/axios';
import {
  Heart,
  MessageCircle,
  Share2,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../../../context/MusicContext';

export function ReelsViewer({ reels: initialReels, initialIndex, onClose }) {
  const [reels, setReels] = useState(initialReels || []);
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [isMuted, setIsMuted] = useState(false); // Unmuted by default since user interacted to open the reels
  const [isPlaying, setIsPlaying] = useState(true);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [showCommentPanel, setShowCommentPanel] = useState(false);
  const [newComment, setNewComment] = useState('');
  const videoRef = useRef(null);
  const musicAudioRef = useRef(null);

  const music = useMusic();
  const wasMusicPlayingRef = useRef(false);

  // Manage global music player context state
  useEffect(() => {
    if (music && music.isPlaying) {
      wasMusicPlayingRef.current = true;
      music.togglePlay(); // Pause background music
    }
    return () => {
      if (wasMusicPlayingRef.current && music && !music.isPlaying) {
        music.togglePlay(); // Resume background music on close
      }
    };
  }, [music]);

  // Instantiate and manage background music track
  useEffect(() => {
    musicAudioRef.current = new Audio();
    musicAudioRef.current.loop = true;
    return () => {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
        musicAudioRef.current = null;
      }
    };
  }, []);

  // Sync background track with active reel index, play/pause and mute/unmute states
  useEffect(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;

    const songIndex = (currentIndex % 6) + 1;
    const trackUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songIndex}.mp3`;

    if (audio.src !== trackUrl) {
      audio.src = trackUrl;
      audio.load();
    }

    audio.muted = isMuted;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Audio background track play failed/interrupted:", err);
        });
      }
    } else {
      audio.pause();
    }
  }, [currentIndex, isPlaying, isMuted]);

  // Initialize likes and comments for each reel from props
  useEffect(() => {
    if (initialReels && initialReels.length > 0) {
      setReels(initialReels);
      const initialLikes = {};
      const initialComments = {};
      initialReels.forEach((reel) => {
        initialLikes[reel.id] = { 
          count: reel.likesCount !== undefined ? reel.likesCount : (typeof reel.likes === 'number' ? reel.likes : 0), 
          liked: reel.liked || false 
        };
        initialComments[reel.id] = reel.comments || [];
      });
      setLikes(initialLikes);
      setComments(initialComments);
    }
  }, [initialReels]);

  // Keep DOM muted property in sync with React state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle auto-playing when reel index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.muted = isMuted; // Sync muted state on video load
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log("Auto-play failed:", err);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentIndex, reels]);

  // Handle like toggle
  const handleLike = async (reelId) => {
    const updatedLikes = { ...likes };
    if (!updatedLikes[reelId]) {
      updatedLikes[reelId] = { count: 0, liked: false };
    }

    // Toggle state locally first for instant feedback
    if (updatedLikes[reelId].liked) {
      updatedLikes[reelId].count = Math.max(0, updatedLikes[reelId].count - 1);
    } else {
      updatedLikes[reelId].count += 1;
    }
    updatedLikes[reelId].liked = !updatedLikes[reelId].liked;
    setLikes(updatedLikes);

    // Call Feed Service API
    try {
      const response = await API.post(`/feed/reels/${reelId}/like`, {
        liked: updatedLikes[reelId].liked,
      });
      if (response.data && response.data.likesCount !== undefined) {
        setLikes(prev => ({
          ...prev,
          [reelId]: {
            count: response.data.likesCount,
            liked: response.data.liked !== undefined ? response.data.liked : updatedLikes[reelId].liked
          }
        }));
      }
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (reelId) => {
    if (newComment.trim() === '') return;

    // Send comment to Feed Service API
    try {
      const response = await API.post(`/feed/reels/${reelId}/comment`, {
        text: newComment,
      });
      
      const addedComment = response.data.comment || { 
        id: Date.now(), 
        text: newComment, 
        userName: 'You', 
        createdAt: new Date() 
      };

      setComments(prev => ({
        ...prev,
        [reelId]: [...(prev[reelId] || []), addedComment]
      }));
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  // Fetch comments for current reel when panel opens
  useEffect(() => {
    const fetchComments = async () => {
      if (showCommentPanel && reels[currentIndex]) {
        const reelId = reels[currentIndex].id;
        try {
          const response = await API.get(`/feed/reels/${reelId}/comments`);
          if (response.data && response.data.comments) {
            setComments(prev => ({
              ...prev,
              [reelId]: response.data.comments
            }));
          }
        } catch (err) {
          console.error("Error fetching comments:", err);
        }
      }
    };
    fetchComments();
  }, [showCommentPanel, currentIndex, reels]);

  const scrollCooldown = useRef(false);
  const touchStartY = useRef(0);

  const triggerTransition = (direction) => {
    if (scrollCooldown.current) return;
    scrollCooldown.current = true;
    setTimeout(() => {
      scrollCooldown.current = false;
    }, 600); // 600ms cooldown to switch video exactly once per swipe/scroll gesture

    if (direction === 'next') {
      handleNextReel();
    } else if (direction === 'prev') {
      handlePreviousReel();
    }
  };

  const handleWheel = (e) => {
    if (showCommentPanel) return;
    if (e.deltaY > 20) {
      triggerTransition('next');
    } else if (e.deltaY < -20) {
      triggerTransition('prev');
    }
  };

  const handleTouchStart = (e) => {
    if (showCommentPanel) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (showCommentPanel) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        triggerTransition('next');
      } else {
        triggerTransition('prev');
      }
    }
  };

  // Handle next reel
  const handleNextReel = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowCommentPanel(false);
      setIsPlaying(true);
    }
  };

  // Handle previous reel
  const handlePreviousReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowCommentPanel(false);
      setIsPlaying(true);
    }
  };

  // Handle video play/pause
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.log(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (reels.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 text-white">
        <div className="text-center">
          <p className="text-lg font-bold">No reels available</p>
          <button onClick={onClose} className="mt-4 px-6 py-2 bg-brand-orange rounded-full font-black text-sm">Close</button>
        </div>
      </div>
    );
  }

  const currentReel = reels[currentIndex];
  const currentLikes = likes[currentReel.id] || { count: 0, liked: false };
  const currentComments = comments[currentReel.id] || [];

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[100] text-white select-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Desktop Close Button (outside panel) */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-3 transition hidden md:block"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Centered Mobile Frame on Desktop, Fullscreen on Mobile */}
      <div className="relative w-full h-full md:h-screen md:w-[480px] overflow-hidden bg-zinc-950 flex flex-col">
        
        {/* Mobile Close Button (inside panel) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-4 z-[110] bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2.5 transition md:hidden"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Video Area */}
        <div className="relative flex-1 bg-black w-full h-full" onClick={handlePlayPause}>
          {currentReel.video_file ? (
            <video
              ref={videoRef}
              src={currentReel.video_file}
              poster={currentReel.videoThumb || currentReel.thumbnail}
              className="w-full h-full object-cover"
              style={{ borderRadius: "0px", border: "none", clipPath: "none" }}
              autoPlay
              muted={isMuted}
              loop
              playsInline
            />
          ) : (
            <img
              src={currentReel.videoThumb || currentReel.thumbnail}
              alt="Reel preview"
              className="w-full h-full object-cover"
              style={{ borderRadius: "0px", border: "none", clipPath: "none" }}
            />
          )}

          {/* Optional bottom fade gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

          {/* Mute Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleMuteToggle(); }}
            className="absolute bottom-6 left-4 z-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2.5 transition"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Play/Pause indicator */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none z-10">
              <div className="p-5 bg-black/50 backdrop-blur-md rounded-full text-white">
                <Play size={32} className="fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Bottom user details & description */}
          <div className="absolute bottom-24 left-4 right-16 z-10 pointer-events-none text-white drop-shadow-md">
            <div className="flex items-center gap-3 mb-3 pointer-events-auto">
              <img
                src={currentReel.author?.avatar || `https://i.pravatar.cc/80?u=${currentReel.id}`}
                alt="Avatar"
                className="rounded-full border-2 border-white object-cover"
                style={{ width: '40px', height: '40px', maxWidth: '40px' }} // Strict sizing to avoid global CSS overrides
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-none">{currentReel.user || currentReel.author?.name}</span>
                <span className="text-[10px] text-white/70 mt-0.5">Fitness Enthusiast</span>
              </div>
              <button className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/40 border border-white/30 rounded-full text-xs font-bold transition">
                Follow
              </button>
            </div>
            <p className="text-xs font-medium leading-relaxed mb-3 line-clamp-2">{currentReel.description || 'Workout inspiration video from Fitcircle Pro'}</p>
            <p className="text-[11px] text-white/80">♪ {currentReel.music || 'Original Audio'}</p>
          </div>

          {/* Interaction Buttons - Right Side */}
          <div className="absolute right-4 bottom-24 z-10 flex flex-col gap-5 items-center">
            {/* Like Button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleLike(currentReel.id); }}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="bg-black/30 backdrop-blur-md hover:bg-black/50 rounded-full p-3 transition-colors">
                <Heart
                  className={`w-6 h-6 transition-all group-hover:scale-110 ${
                    currentLikes.liked ? 'fill-red-500 text-red-500' : 'text-white'
                  }`}
                />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow">{currentLikes.count}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowCommentPanel(true); }}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="bg-black/30 backdrop-blur-md hover:bg-black/50 rounded-full p-3 transition-colors">
                <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow">{currentComments.length}</span>
            </button>

            {/* Share Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); }} 
              className="flex flex-col items-center gap-1 group"
            >
              <div className="bg-black/30 backdrop-blur-md hover:bg-black/50 rounded-full p-3 transition-colors">
                <Share2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow">Share</span>
            </button>
          </div>
        </div>

        {/* Comment Panel Overlay */}
        <AnimatePresence>
          {showCommentPanel && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 h-[60%] bg-zinc-950/95 backdrop-blur-md rounded-t-3xl border-t border-zinc-800 z-30 flex flex-col text-white"
            >
              {/* Close Comment Panel */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <span className="font-bold text-sm">Comments</span>
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
                    No comments yet. Be the first!
                  </div>
                ) : (
                  currentComments.map((comment) => (
                    <div key={comment._id || comment.id} className="flex gap-3 text-xs">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                        {comment.userName ? comment.userName[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-bold text-zinc-300">{comment.userName || 'User'}</span>
                          <span className="text-[9px] text-zinc-500">
                            {new Date(comment.createdAt || comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-zinc-200 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-zinc-800 flex gap-2 items-center bg-zinc-950">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-brand-orange transition"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCommentSubmit(currentReel.id);
                    }
                  }}
                />
                <button
                  onClick={() => handleCommentSubmit(currentReel.id)}
                  className="bg-brand-orange hover:bg-orange-600 text-white rounded-full p-2.5 transition flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Arrows (Desktop Only) */}
        <div className="hidden md:flex absolute inset-y-0 left-0 right-0 pointer-events-none items-center justify-between px-4">
          {currentIndex > 0 ? (
            <button
              onClick={handlePreviousReel}
              className="w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition pointer-events-auto shadow-md"
            >
              ←
            </button>
          ) : <div />}
          {currentIndex < reels.length - 1 ? (
            <button
              onClick={handleNextReel}
              className="w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition pointer-events-auto shadow-md"
            >
              →
            </button>
          ) : <div />}
        </div>

        {/* Mobile Swipe Navigation indicators */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-[10px] font-bold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full pointer-events-none">
          {currentIndex + 1} / {reels.length}
        </div>
      </div>
    </div>
  );
}
