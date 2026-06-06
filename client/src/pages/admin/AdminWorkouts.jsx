import { Dumbbell, Plus, Trash2, Play, LayoutGrid, List, Zap, MoreVertical, Edit2 } from "lucide-react";
import React, { useState } from "react";
import { DataTable } from "../../app/components/admin/DataTable";

const workoutData = [
  { id: 1, name: "Advanced HIIT Core", difficulty: "Hard", duration: "45 mins", category: "HIIT", users: 1240, rating: 4.8, status: "Active" }, { id: 2, name: "Beginner Yoga Flow", difficulty: "Easy", duration: "20 mins", category: "Yoga", users: 3410, rating: 4.9, status: "Active" }, { id: 3, name: "Power Lifting 101", difficulty: "Hard", duration: "60 mins", category: "Strength", users: 890, rating: 4.7, status: "Draft" }, { id: 4, name: "Morning Cardio Blast", difficulty: "Medium", duration: "30 mins", category: "Cardio", users: 5620, rating: 4.6, status: "Active" }, { id: 5, name: "Full Body Mobility", difficulty: "Easy", duration: "15 mins", category: "Recovery", users: 1450, rating: 4.9, status: "Active" }, ];

export function AdminWorkouts() {
  const [workouts, setWorkouts] = useState(workoutData);

  const columns = [
    {
      header: "Plan Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight">{row.name}</div>
            <div className="text-xs text-slate-500 leading-tight mt-0.5">{row.category}</div>
          </div>
        </div>
      ),
 }, {
      header: "Difficulty",
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
          row.difficulty === "Hard" ? "bg-rose-50 text-rose-600" : 
          row.difficulty === "Medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
        }`}>
          {row.difficulty}
        </span>
      ),
 }, {
      header: "Details",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <div className="text-sm font-medium text-slate-700">{row.duration}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
             <Zap size={10} className="fill-slate-400 text-slate-400" />
             {row.users} users enrolled
          </div>
        </div>
      ),
 }, {
      header: "Rating",
      render: (row) => (
        <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
          <span className="text-amber-500"></span>
          {row.rating}
        </div>
      ),
 }, {
      header: "Status",
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
          row.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
        }`}>
          {row.status}
        </span>
      ),
 }, ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workout Library</h1>
          <p className="text-slate-500 mt-1">Manage and curate official workout plans for your users.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all group">
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span>New Workout Plan</span>
        </button>
      </div>

      <div className="flex gap-4 mb-2">
        <div className="flex p-1 bg-slate-100 rounded-lg">
          <button className="p-1.5 bg-white text-blue-600 rounded-md shadow-sm">
            <LayoutGrid size={18} />
          </button>
          <button className="p-1.5 text-slate-500 hover:text-slate-700">
            <List size={18} />
          </button>
        </div>
        <div className="flex gap-2">
           {["Strength", "HIIT", "Yoga", "Cardio"].map(cat => (
             <button key={cat} className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:border-slate-300 transition-colors">
               {cat}
             </button>
           ))}
        </div>
      </div>

      <DataTable 
        title="Workout Plans"
        description="A comprehensive library of all workout sessions available on the platform."
        columns={columns}
        data={workouts}
        onSearch={(val) => {
          const filtered = workoutData.filter(w => 
            w.name.toLowerCase().includes(val.toLowerCase()) || 
            w.category.toLowerCase().includes(val.toLowerCase())
          );
          setWorkouts(filtered);
        }}
      />
    </div>
  );
}
