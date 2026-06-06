import { Heart, MessageCircle, Share2, X, Music, MoreVertical } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ReelsViewer({ reels, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const containerRef = useRef(null);
  
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-[100] bg-black text-white"
      >
        <button 
          onClick={onClose} 
          className="absolute top-12 right-4 z-50 p-3 bg-black/40 backdrop-blur-md rounded-full text-white"
        >
          <X size={24} />
        </button>

        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        >
          {reels.map((reel, index) => (
            <div key={reel.id} className="h-full w-full snap-start relative flex items-center justify-center bg-zinc-900">
              <img src={reel.videoThumb} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Reel video placeholder" />
              {/* Optional blur underneath */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

              {/* Reel Content Info */}
              <div className="absolute bottom-safe left-0 right-16 z-20 p-4 pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <img src={reel.author.avatar} alt={reel.author.name} className="w-10 h-10 rounded-full border-2 border-white" />
                  <span className="font-bold text-sm tracking-tight">{reel.author.name}</span>
                  <button className="px-3 py-1 bg-transparent border border-white rounded-full text-xs font-bold">Follow</button>
                </div>
                <p className="text-sm font-medium mb-3 line-clamp-2">{reel.description}</p>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md w-max px-3 py-1.5 rounded-full">
                  <Music size={14} className="animate-spin-slow" />
                  <span className="text-xs">{reel.music}</span>
                </div>
              </div>

              {/* Right Action Icons */}
              <div className="absolute bottom-safe right-2 z-20 flex flex-col items-center gap-6 pb-8">
                <button className="flex flex-col items-center gap-1 group">
                  <div className="p-3 rounded-full bg-black/20 backdrop-blur-md transition-colors group-hover:bg-black/40">
                    <Heart size={28} className={index % 2 === 0 ? "fill-red-500 text-red-500" : "text-white"} />
                  </div>
                  <span className="text-xs font-bold">{reel.likes}</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <div className="p-3 rounded-full bg-black/20 backdrop-blur-md transition-colors group-hover:bg-black/40">
                    <MessageCircle size={28} />
                  </div>
                  <span className="text-xs font-bold">{reel.comments}</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <div className="p-3 rounded-full bg-black/20 backdrop-blur-md transition-colors group-hover:bg-black/40">
                    <Share2 size={28} />
                  </div>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <MoreVertical size={24} />
                </button>
                
                <img src={reel.author.avatar} className="w-9 h-9 border border-white rounded-md mt-2 spin-slow" alt="" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
