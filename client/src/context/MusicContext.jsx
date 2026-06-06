import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

const MusicContext = createContext(null);

export const mockAlbums = [
  {
    id: 1,
    title: "Beast Mode",
    artist: "Workout Hits",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:42",
    genre: "Hip-Hop",
  },
  {
    id: 2,
    title: "Morning Grind",
    artist: "Energize FM",
    cover: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "4:15",
    genre: "EDM",
  },
  {
    id: 3,
    title: "Push Limits",
    artist: "Alpha Tracks",
    cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:01",
    genre: "Rock",
  },
  {
    id: 4,
    title: "Flow State",
    artist: "Zen Beats",
    cover: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "3:28",
    genre: "Chill",
  },
  {
    id: 5,
    title: "Iron Will",
    artist: "Power House",
    cover: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: "4:55",
    genre: "Metal",
  },
  {
    id: 6,
    title: "Cardio Rush",
    artist: "Sprint Studio",
    cover: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: "3:55",
    genre: "Pop",
  },
];

export function MusicProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [albums, setAlbums] = useState(mockAlbums);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      handleNext();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrack]);

  const playTrack = useCallback((track) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }
    audio.src = track.audioUrl;
    audio.load();
    audio.play().catch(() => {});
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  }, [currentTrack, isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setProgress(time);
  }, []);

  const handleNext = useCallback(() => {
    if (!currentTrack) return;
    const idx = albums.findIndex((a) => a.id === currentTrack.id);
    const next = albums[(idx + 1) % albums.length];
    playTrack(next);
  }, [currentTrack, albums, playTrack]);

  const handlePrev = useCallback(() => {
    if (!currentTrack) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      seek(0);
      return;
    }
    const idx = albums.findIndex((a) => a.id === currentTrack.id);
    const prev = albums[(idx - 1 + albums.length) % albums.length];
    playTrack(prev);
  }, [currentTrack, albums, playTrack, seek]);

  const changeVolume = useCallback((val) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }, []);

  const closePlayer = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const addAlbum = useCallback((album) => {
    setAlbums((prev) => [{ ...album, id: Date.now() }, ...prev]);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        albums,
        playTrack,
        togglePlay,
        seek,
        handleNext,
        handlePrev,
        changeVolume,
        closePlayer,
        addAlbum,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
