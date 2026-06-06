import React from "react";
import { Clock, Flame, ChevronRight, Play } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";

export function WorkoutCard({ workout, onClick }) {
  const difficultyColors = {
    Beginner: "bg-green-50 text-green-700 border-green-200",
    Intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Advanced: "bg-red-50 text-red-700 border-red-200"
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer group"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {workout.videoUrl ? (
          <VideoPlayer
            thumbnail={workout.image}
            videoUrl={workout.videoUrl}
            className="w-full h-full"
          />
        ) : (
          <>
            <img
              src={workout.image}
              alt={workout.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {(workout.hasVideo || workout.videoUrl) && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:bg-blue-500 group-hover:scale-110 transition-all">
                  <Play size={24} className="text-slate-900 group-hover:text-white ml-1" fill="currentColor" />
                </div>
              </div>
            )}
          </>
        )}

        {workout.category && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full">
              {workout.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
              {workout.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
              {workout.description || "Expert-led workout program for your fitness goals."}
            </p>
          </div>
          <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>

        {workout.trainer && (
          <div className="flex items-center gap-2 mb-3">
            <img
              src={workout.trainer.image}
              alt={workout.trainer.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-slate-500 font-medium">{workout.trainer.name}</span>
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {workout.difficulty && (
            <span className={`px-2.5 py-1 text-xs font-bold border rounded-lg ${difficultyColors[workout.difficulty] || difficultyColors.Beginner}`}>
              {workout.difficulty}
            </span>
          )}
          {workout.duration && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock size={14} />
              <span className="text-xs font-bold">{workout.duration}</span>
            </div>
          )}
          {workout.calories && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Flame size={14} />
              <span className="text-xs font-bold">{workout.calories} cal</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
