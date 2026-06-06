import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export function VideoPlayer({ thumbnail, videoUrl, className = "" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(true)}
    >
      {videoUrl ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={thumbnail}
            muted={isMuted}
            loop
            playsInline
            onClick={togglePlay}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>

          {/* Video Controls */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            {/* Play/Pause Button (Center) */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center group/play"
              >
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover/play:bg-blue-500 group-hover/play:scale-110 transition-all">
                  <Play size={28} className="text-slate-900 group-hover/play:text-white ml-1" fill="currentColor" />
                </div>
              </button>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
              <button
                onClick={togglePlay}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause size={20} className="text-white" />
                ) : (
                  <Play size={20} className="text-white" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX size={20} className="text-white" />
                  ) : (
                    <Volume2 size={20} className="text-white" />
                  )}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Maximize size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
      )}
    </div>
  );
}
