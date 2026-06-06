import React, { useMemo, useState } from 'react';
import { workouts } from '../../api/mockData';
import { Card, Button, Input, cn, Badge } from '../../components/ui';
import { Dumbbell, Clock, Gauge, Filter, Search as SearchIcon, Sparkles, TrendingUp } from "lucide-react";
import { motion } from 'motion/react';

const WorkoutCard = React.memo(({ workout, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Card className="flex flex-col h-full bg-white dark:bg-[#0f172a] hover:border-primary transition-all group border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
      {index === 0 && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-primary/90 backdrop-blur-md border-primary-foreground/20 text-[10px] uppercase font-bold tracking-widest px-3 py-1">AI Choice</Badge>
        </div>
      )}
      <div className="relative aspect-[16/10] overflow-hidden group-hover:brightness-90 transition-all">
        <img src={workout.image} alt={workout.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-sm bg-[#0f172a]/80 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/10">
            {workout.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/20 to-transparent opacity-60 pointer-events-none" />
      </div>
      <div className="p-6 flex flex-col flex-1 gap-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter group-hover:text-primary transition-colors uppercase">{workout.title}</h3>
          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {workout.duration}</span>
            <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-primary" /> {workout.difficulty}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {workout.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter border border-border/50">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-border/5">
          <Button variant="primary" className="w-full font-black uppercase tracking-widest text-[11px] h-12 rounded-sm shadow-lg shadow-primary/20 active:scale-[0.98] group/btn">
            Enter Arena <TrendingUp className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  </motion.div>
));

export default function Workouts() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => ['All', 'Strength', 'HIIT', 'Yoga', 'Cardio', 'Abs'], []);

  const filteredWorkouts = useMemo(() =>
    workouts.filter(w =>
      (filter === 'All' || w.category === filter) &&
      w.title.toLowerCase().includes(search.toLowerCase())
    ),
    [search, filter]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-8 px-2">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Optimized Programs</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">Arena <span className="text-primary italic">Elite</span></h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl font-medium text-lg">Elite Indian training methodology. Precision engineering for the human body.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search training protocols..."
              className="pl-12 h-14 bg-white dark:bg-[#0f172a] border-border/40 focus:border-primary transition-all rounded-sm uppercase font-bold text-[11px] tracking-widest"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 border-border/40 bg-white dark:bg-[#0f172a] rounded-sm px-8 font-black uppercase text-[11px] tracking-widest hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide no-scrollbar -mx-2 px-2 scroll-smooth border-b border-border/5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "whitespace-nowrap px-8 py-3 rounded-sm text-[11px] font-black uppercase tracking-[0.2em] transition-all border border-transparent cursor-pointer active:scale-95",
              filter === cat
                ? "bg-primary text-white shadow-xl shadow-primary/30"
                : "bg-white dark:bg-[#0f172a] text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-border"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredWorkouts.map((workout, idx) => (
          <WorkoutCard key={workout.id} workout={workout} index={idx} />
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-6">
            <Dumbbell className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">No Protocols Found</h3>
          <p className="text-slate-400 max-w-xs mt-3 font-medium uppercase text-[10px] tracking-widest">Adjust search parameters to initialize training.</p>
          <Button variant="ghost" className="mt-8 text-primary font-black uppercase tracking-widest text-[11px]" onClick={() => { setSearch(''); setFilter('All') }}>Reset Interface</Button>
        </div>
      )}
    </div>
  );
}
