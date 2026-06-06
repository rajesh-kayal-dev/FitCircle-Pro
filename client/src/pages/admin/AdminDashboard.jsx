import { Users, FileText, Dumbbell, Calendar, Zap, Clock, TrendingUp, CheckCircle } from "lucide-react";
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { StatCard } from "../../app/components/admin/StatCard";

const chartData = [
  { name: "Mon", users: 400, posts: 240, workouts: 240 },
  { name: "Tue", users: 300, posts: 139, workouts: 2210 },
  { name: "Wed", users: 200, posts: 980, workouts: 2290 },
  { name: "Thu", users: 278, posts: 390, workouts: 2000 },
  { name: "Fri", users: 189, posts: 480, workouts: 2181 },
  { name: "Sat", users: 239, posts: 380, workouts: 2500 },
  { name: "Sun", users: 349, posts: 430, workouts: 2100 },
];

const recentActivity = [
  { id: 1, user: "Alex Thompson", action: "Completed 'Advanced Core Workout'", time: "2 minutes ago", icon: Dumbbell, color: "bg-brand-orange/10 text-brand-orange" },
  { id: 2, user: "Sarah Jenkins", action: "Posted a new transformation photo", time: "15 minutes ago", icon: FileText, color: "bg-blue-500/10 text-blue-500" },
  { id: 3, user: "Mike Ross", action: "Joined FitCircle Pro", time: "1 hour ago", icon: Users, color: "bg-brand-green/10 text-brand-green" },
  { id: 4, user: "Emma Watson", action: "Earned '7-Day Streak' badge", time: "3 hours ago", icon: Zap, color: "bg-amber-500/10 text-amber-500" },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-text tracking-tight">Dashboard Overview</h1>
          <p className="text-brand-muted font-medium mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm text-brand-text font-black shadow-sm group hover:border-brand-orange transition-colors cursor-pointer">
          <Calendar className="w-4 h-4 text-brand-muted group-hover:text-brand-orange transition-colors" />
          <span>Oct 24 - Oct 30, 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="12,482"
          change="12.5"
          isPositive={true}
          icon={Users}
          delay={0.1}
        />
        <StatCard
          title="Active Users"
          value="2,841"
          change="4.2"
          isPositive={true}
          icon={Zap}
          delay={0.2}
        />
        <StatCard
          title="Total Posts"
          value="45,291"
          change="1.2"
          isPositive={false}
          icon={FileText}
          delay={0.3}
        />
        <StatCard
          title="Workouts Done"
          value="89,402"
          change="18.7"
          isPositive={true}
          icon={CheckCircle}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-[400px] hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center">
                <TrendingUp className="text-brand-text w-5 h-5" />
              </div>
              <h3 className="font-black text-xl text-brand-text tracking-tight">User Growth</h3>
            </div>
            <select className="bg-brand-bg border border-transparent hover:border-gray-200 focus:border-brand-orange rounded-xl text-xs font-black px-4 py-2 outline-none text-brand-text transition-all cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4500" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ff4500" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    fontWeight: 900,
                    color: '#0f172a'
                  }}
                  itemStyle={{
                    fontWeight: 900,
                    color: '#ff4500'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#ff4500"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-[400px] hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center">
                <Clock className="text-brand-text w-5 h-5" />
              </div>
              <h3 className="font-black text-xl text-brand-text tracking-tight">Recent Activity</h3>
            </div>
            <button className="text-xs text-brand-orange font-black hover:text-brand-text transition-colors uppercase tracking-widest bg-brand-orange/10 px-3 py-1.5 rounded-lg hover:bg-gray-100">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-5 pr-2 hide-scrollbar">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 relative group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-black text-brand-text leading-tight group-hover:text-brand-orange transition-colors">{activity.user}</p>
                  <p className="text-xs font-bold text-brand-muted mt-1 truncate">{activity.action}</p>
                  <div className="flex items-center gap-1 mt-1.5 opacity-70">
                    <Clock className="w-3 h-3 text-brand-muted" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-brand-muted">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
