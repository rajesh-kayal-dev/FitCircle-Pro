import React, { useState } from "react";
import { motion } from "motion/react";
import { Play, Pause, Music2, Headphones, Zap, Search } from "lucide-react";
import { useMusic } from "../context/MusicContext";
import { cn } from "../app/components/ui";

const GENRES = ["All", "Hip-Hop", "EDM", "Rock", "Chill", "Metal", "Pop"];

export default function VibeZone() {
  const { albums, currentTrack, isPlaying, playTrack } = useMusic();
  const [activeGenre, setActiveGenre] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = albums.filter((a) => {
    const matchGenre = activeGenre === "All" || a.genre === activeGenre;
    const matchQuery =
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.artist.toLowerCase().includes(query.toLowerCase());
    return matchGenre && matchQuery;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 pb-40">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl mb-8 h-48 md:h-60">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop"
          alt="Workout music banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <div className="flex items-center gap-2 mb-2">
            <Headphones size={16} className="text-brand-orange" />
            <span className="text-xs font-black uppercase tracking-widest text-brand-orange">Workout Music</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Vibe Zone
          </h1>
          <p className="text-white/70 text-sm font-medium mt-1 max-w-sm">
            Curated tracks to fuel your training sessions.
          </p>
        </div>
      </section>

      {/* Search + Genre Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 flex-1 shadow-sm focus-within:border-brand-orange/50 transition-colors">
          <Search size={16} className="text-brand-muted" />
          <input
            type="text"
            placeholder="Search tracks, artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-brand-muted/60"
          />
        </div>
        <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar w-full px-1">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer",
                activeGenre === g
                  ? "bg-brand-text text-white border-brand-text shadow-md"
                  : "bg-white text-brand-muted border-gray-200 hover:bg-gray-50 hover:text-brand-text"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Now Playing Banner */}
      {currentTrack && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-gradient-to-r from-brand-orange/10 to-brand-red/5 border border-brand-orange/20 rounded-2xl p-4 mb-6"
        >
          <div className="relative">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
              <div className="flex gap-0.5 items-end">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-brand-orange rounded-full"
                    animate={isPlaying ? { height: [4, 14, 6, 10, 4] } : { height: 4 }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-brand-text">Now Playing</p>
            <p className="text-xs text-brand-orange font-bold">{currentTrack.title} · {currentTrack.artist}</p>
          </div>
        </motion.div>
      )}

      {/* Albums Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {filtered.map((album, idx) => {
          const isActive = currentTrack?.id === album.id;
          return (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => playTrack(album)}
              className={cn(
                "group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-orange/20 transition-all duration-300 overflow-hidden cursor-pointer",
                isActive && "ring-2 ring-brand-orange/50 border-brand-orange/30"
              )}
            >
              {/* Cover */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    {isActive && isPlaying ? (
                      <Pause size={20} className="text-brand-orange" />
                    ) : (
                      <Play size={20} className="text-brand-orange fill-brand-orange ml-1" />
                    )}
                  </div>
                </div>
                {/* Genre badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 rounded-full text-[10px] font-black uppercase tracking-wider text-brand-text">
                  {album.genre}
                </span>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-2 right-2 flex gap-0.5 items-end">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-brand-orange rounded-full"
                        animate={isPlaying ? { height: [4, 12, 5, 9, 4] } : { height: 4 }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Track info */}
              <div className="p-3">
                <p className={cn(
                  "text-sm font-black text-brand-text truncate",
                  isActive && "text-brand-orange"
                )}>
                  {album.title}
                </p>
                <p className="text-xs text-brand-muted font-medium truncate">{album.artist}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-brand-muted font-medium">{album.duration}</span>
                  <Zap size={12} className="text-brand-orange" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center">
            <Music2 size={28} className="text-gray-300" />
          </div>
          <p className="font-black text-brand-text">No tracks found</p>
          <p className="text-sm text-brand-muted">Try a different genre or search term.</p>
        </div>
      )}
    </div>
  );
}
