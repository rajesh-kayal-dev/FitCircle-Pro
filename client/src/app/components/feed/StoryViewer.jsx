import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function StoryViewer({ stories, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
  }, [currentIndex]);

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

  const currentStory = stories[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-[100] bg-black text-white flex flex-col"
      >
        <div className="absolute top-0 left-0 right-0 z-20 pt-12 pb-4 px-4 bg-gradient-to-b from-black/80 to-transparent">
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={currentStory.avatar} className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover" alt="" />
              <span className="font-bold text-sm tracking-tight">{currentStory.name}</span>
              <span className="text-white/60 text-xs">2h</span>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Story Content Area */}
        <div className="flex-1 relative flex items-center justify-center bg-zinc-900">
          <img src={currentStory.avatar} className="w-full h-full object-cover opacity-80 blur-xl absolute inset-0" alt="" />
          <img src={currentStory.image || currentStory.avatar} className="w-full h-auto max-h-full object-contain relative z-10" alt="Story content" />

          {/* Tap Zones */}
          <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={handlePrev} />
          <div className="absolute inset-y-0 right-0 w-2/3 z-20 cursor-pointer" onClick={handleNext} />
        </div>

        {/* Footer Reply Area */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3">
          <input
            type="text"
            placeholder="Send message..."
            className="flex-1 bg-transparent border border-white/30 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/50"
          />
          <button className="p-3 text-white hover:text-orange-400 focus:outline-none">
            <X size={24} className="rotate-45" /> {/* Send icon equivalent */}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
