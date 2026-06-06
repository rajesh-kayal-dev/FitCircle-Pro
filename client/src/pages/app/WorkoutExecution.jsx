import { Play, Pause, RotateCcw, ChevronRight, Clock, Flame, Zap, X, CheckCircle, MoreVertical } from "lucide-react";
import React, { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const ExerciseCard = forwardRef(({ exercise, isActive, isCompleted }, ref) => (
  <motion.div 
    ref={ref}
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`p-6 rounded-[2rem] border transition-all ${
      isActive 
        ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-200 ring-4 ring-blue-50' 
        : isCompleted 
          ? 'bg-white text-slate-400 border-slate-100 opacity-60' 
          : 'bg-white text-slate-900 border-slate-100 shadow-sm'
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
          isActive ? 'bg-white/20' : 'bg-slate-50'
        }`}>
          {isCompleted ? <CheckCircle size={20} className="text-blue-600" /> : exercise.id}
        </div>
        <h3 className="font-bold text-lg leading-tight">{exercise.name}</h3>
      </div>
      <MoreVertical size={18} className={isActive ? 'text-white/60' : 'text-slate-300'} />
    </div>

    <div className="flex items-center gap-6 py-4 border-t border-white/10 mt-2">
      <div>
        <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>Reps</p>
        <p className="text-2xl font-black italic">{exercise.reps}</p>
      </div>
      <div className={`w-px h-10 ${isActive ? 'bg-white/10' : 'bg-slate-100'}`} />
      <div>
        <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>Sets</p>
        <p className="text-2xl font-black italic">{exercise.sets}</p>
      </div>
      <div className={`w-px h-10 ${isActive ? 'bg-white/10' : 'bg-slate-100'}`} />
      <div>
        <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>Weight</p>
        <p className="text-2xl font-black italic">{exercise.weight} <span className="text-xs font-bold uppercase not-italic ml-1">kg</span></p>
      </div>
    </div>

    {isActive && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 pt-6 border-t border-white/10 flex gap-3"
      >
        <button className="flex-1 py-4 bg-white text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-transform">
          Log Performance
        </button>
        <button className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
          Notes
        </button>
      </motion.div>
    )}
  </motion.div>
));

ExerciseCard.displayName = "ExerciseCard";

export const WorkoutExecution = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState([]);

  const exercises = [
    { id: 1, name: "Neural Squats (V4)", reps: "12", sets: "4", weight: "85" },
    { id: 2, name: "Stripe Deadlifts", reps: "8", sets: "5", weight: "120" },
    { id: 3, name: "Blue Overhead Press", reps: "10", sets: "3", weight: "45" },
    { id: 4, name: "Steel Row Protocol", reps: "12", sets: "4", weight: "60" }
  ];

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextExercise = () => {
    if (currentIdx < exercises.length - 1) {
      setCompleted([...completed, exercises[currentIdx].id]);
      setCurrentIdx(currentIdx + 1);
    } else {
      toast.success("Workout Complete! Neural sync finished.", {
        description: "Your stats have been synchronized to your evolution profile."
      });
      navigate('/app/feed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <button 
          onClick={() => navigate('/app/workouts')}
          className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 hover:text-blue-600 transition-all shadow-sm"
        >
          <X size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Neural Strength Protocol</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Advanced • Vector 4.0</p>
        </div>
        <button className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 hover:text-blue-600 transition-all shadow-sm">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="relative bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden shadow-2xl shadow-blue-900/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-500/10 blur-[100px] rounded-full" />
        
        <div className="relative flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Training Duration</span>
          </div>
          <p className="text-7xl font-black italic tracking-tighter mb-10 tabular-nums">
            {formatTime(seconds)}
          </p>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSeconds(0)}
              className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <RotateCcw size={24} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-24 h-24 rounded-[2.5rem] bg-blue-600 shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={32} className="fill-white" /> : <Play size={32} className="fill-white ml-1" />}
            </button>
            <button 
              onClick={nextExercise}
              className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-white/10 transition-all"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-white/5 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Flame size={14} className="text-slate-500" />
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Burn</p>
            </div>
            <p className="text-xl font-bold italic">142 <span className="text-[10px] uppercase not-italic opacity-40 ml-1">kcal</span></p>
          </div>
          <div className="border-x border-white/5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap size={14} className="text-slate-500" />
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Load</p>
            </div>
            <p className="text-xl font-bold italic">4,250 <span className="text-[10px] uppercase not-italic opacity-40 ml-1">kg</span></p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock size={14} className="text-slate-500" />
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Avg Heart</p>
            </div>
            <p className="text-xl font-bold italic">132 <span className="text-[10px] uppercase not-italic opacity-40 ml-1">bpm</span></p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-12">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Protocol Sequence</h3>
          <p className="font-bold text-blue-600 text-xs">{currentIdx + 1} of {exercises.length}</p>
        </div>
        <AnimatePresence mode="popLayout">
          {exercises.map((ex, i) => (
            <ExerciseCard 
              key={ex.id} 
              exercise={ex} 
              isActive={currentIdx === i}
              isCompleted={completed.includes(ex.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-40 md:left-[calc(50%+128px)] md:max-w-xl">
        <button 
          onClick={nextExercise}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-sm uppercase tracking-widest shadow-2xl shadow-slate-900/40 flex items-center justify-center gap-3 hover:bg-slate-800 transition-all border border-white/10"
        >
          {currentIdx === exercises.length - 1 ? 'Finalize Protocol' : 'Complete Set & Next'}
          <div className="p-1 bg-blue-600 rounded-lg">
            <ChevronRight size={18} />
          </div>
        </button>
      </div>
    </div>
  );
};
