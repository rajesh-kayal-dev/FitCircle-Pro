import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Music2, ChevronUp, ChevronDown } from "lucide-react";
import { useMusic } from "../../../context/MusicContext";
import { cn } from "../ui";

function formatTime(secs) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    seek,
    handleNext,
    handlePrev,
    changeVolume,
    closePlayer,
  } = useMusic();

  const [collapsed, setCollapsed] = useState(false);
  const [muted, setMuted] = useState(false);
  const prevVol = React.useRef(volume);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleMuteToggle = () => {
    if (muted) {
      changeVolume(prevVol.current || 0.8);
    } else {
      prevVol.current = volume;
      changeVolume(0);
    }
    setMuted((m) => !m);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="music-player"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-3xl shadow-2xl shadow-black/15 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-gray-100 relative cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seek(ratio * duration);
          }}>
            <motion.div
              className="h-full bg-gradient-to-r from-brand-orange to-brand-red rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="px-4 py-3">
            {/* Collapsed header toggle */}
            <div className="flex items-center gap-3">
              {/* Cover art */}
              <div className="relative flex-shrink-0">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-11 h-11 rounded-2xl object-cover"
                />
                <div className={cn(
                  "absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                )} onClick={togglePlay}>
                  {isPlaying ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white fill-white" />}
                </div>
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-brand-text truncate leading-tight">{currentTrack.title}</p>
                <p className="text-xs text-brand-muted font-medium truncate">{currentTrack.artist}</p>
                <p className="text-[10px] text-brand-muted/70 font-medium">
                  {formatTime(progress)} / {formatTime(duration)}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl hover:bg-gray-100 text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
                  aria-label="Previous track"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 flex items-center justify-center rounded-2xl bg-brand-orange text-white hover:bg-orange-600 transition-colors shadow-md shadow-brand-orange/30 cursor-pointer"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-white" />}
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl hover:bg-gray-100 text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
                  aria-label="Next track"
                >
                  <SkipForward size={16} />
                </button>
                <button
                  onClick={handleMuteToggle}
                  className="p-2 rounded-xl hover:bg-gray-100 text-brand-muted hover:text-brand-text transition-colors cursor-pointer hidden sm:flex"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={closePlayer}
                  className="p-2 rounded-xl hover:bg-red-50 text-brand-muted hover:text-brand-red transition-colors cursor-pointer"
                  aria-label="Close player"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Volume slider — hidden on smallest screens */}
            <div className="hidden sm:flex items-center gap-2 mt-2 px-1">
              <Volume2 size={12} className="text-brand-muted flex-shrink-0" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => {
                  changeVolume(parseFloat(e.target.value));
                  setMuted(false);
                }}
                className="flex-1 h-1 accent-brand-orange cursor-pointer"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
