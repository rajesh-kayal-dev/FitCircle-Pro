import { Heart, MessageCircle, Share2, Play, Pause, Bookmark, MoreHorizontal } from "lucide-react";
import React, { useState, useCallback, useMemo } from 'react';
import { feedData } from '../../api/mockData';
import { Card, Avatar, Button, cn } from '../../components/ui';
import { motion, AnimatePresence } from 'motion/react';

const FeedItem = React.memo(({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const togglePlay = useCallback(() => setIsPlaying(p => !p), []);

  const handleLike = useCallback(() => {
    setLiked(prev => !prev);
    if (!liked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  }, [liked]);

  return (
    <Card className="max-w-md mx-auto mb-8 bg-white dark:bg-[#0f172a] border-border/40 group overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary to-blue-300">
            <Avatar src={item.user.avatar} fallback={item.user.name[0]} size="md" className="border-2 border-white dark:border-[#0f172a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground leading-none hover:underline cursor-pointer">{item.user.name}</span>
            <span className="text-[11px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">{item.user.role}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      <div className="relative aspect-[4/5] bg-slate-900 group-hover:brightness-[1.02] transition-all">
        <video
          src={item.videoUrl}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          onClick={togglePlay}
          onMouseEnter={() => setIsPlaying(true)}
          onMouseLeave={() => setIsPlaying(false)}
          ref={(video) => {
            if (video) {
              isPlaying ? video.play().catch(() => { }) : video.pause();
            }
          }}
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="p-5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white animate-pulse">
              <Play className="w-8 h-8 fill-current" />
            </div>
          </div>
        )}

        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none text-white drop-shadow-2xl"
            >
              <Heart className="w-24 h-24 fill-current" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute right-3 bottom-6 flex flex-col gap-5 text-white z-10">
          <div className="flex flex-col items-center gap-1 group/btn">
            <button
              onClick={handleLike}
              className={cn(
                "p-3 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 transition-all active:scale-90 hover:bg-black/40",
                liked && "text-red-500 bg-red-500/10 border-red-500/30"
              )}
            >
              <Heart className={cn("w-6 h-6 transition-transform", liked && "fill-current scale-110")} />
            </button>
            <span className="text-[11px] font-bold drop-shadow-lg uppercase tracking-tighter">{item.likes + (liked ? 1 : 0)}</span>
          </div>

          <div className="flex flex-col items-center gap-1 group/btn">
            <button className="p-3 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-black/40 transition-all">
              <MessageCircle className="w-6 h-6" />
            </button>
            <span className="text-[11px] font-bold drop-shadow-lg uppercase tracking-tighter">{item.comments}</span>
          </div>

          <button
            onClick={() => setSaved(s => !s)}
            className={cn(
              "p-3 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 transition-all hover:bg-black/40",
              saved && "text-blue-400 bg-blue-400/10 border-blue-400/30"
            )}
          >
            <Bookmark className={cn("w-6 h-6", saved && "fill-current")} />
          </button>

          <button className="p-3 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-black/40 transition-all">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-border/5 bg-gradient-to-b from-transparent to-muted/20">
        <div className="flex gap-2 items-center mb-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border border-background bg-slate-200"></div>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Liked by Rahul and 2.4k others</span>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">
          <span className="font-bold mr-2 text-primary">{item.user.name}</span>
          {item.caption}
        </p>
        <div className="mt-3 flex gap-2">
          {['#fitness', '#india', '#workout'].map(tag => (
            <span key={tag} className="text-xs font-semibold text-blue-600/80 dark:text-blue-400/80 hover:underline cursor-pointer">{tag}</span>
          ))}
        </div>
      </div>
    </Card>
  );
});

export default function Feed() {
  const renderedFeed = useMemo(() => feedData.map(item => (
    <FeedItem key={item.id} item={item} />
  )), []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-1 mb-10 px-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Discover</h1>
          <div className="flex gap-1 bg-muted/40 p-1 rounded-full">
            <button className="px-5 py-1.5 text-xs font-bold bg-white dark:bg-[#0f172a] shadow-sm rounded-full text-primary transition-all uppercase tracking-widest">For You</button>
            <button className="px-5 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest">Following</button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Expert training, Indian aesthetics, real results.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-8 px-2 scrollbar-hide no-scrollbar">
        {feedData.map(u => (
          <div key={u.id} className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
            <div className="w-16 h-16 rounded-full border-2 border-primary p-0.5 group-hover:scale-110 transition-transform">
              <Avatar src={u.user.avatar} className="w-full h-full" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground group-hover:text-primary transition-colors">{u.user.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {renderedFeed}
      </div>
    </div>
  );
}
