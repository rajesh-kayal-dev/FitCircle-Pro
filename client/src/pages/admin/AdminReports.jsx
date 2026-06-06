import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { TrendingUp, Users, DollarSign, Calendar, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

const engagementData = [
  { name: "Week 1", posts: 400, workouts: 240, comments: 240 },
  { name: "Week 2", posts: 300, workouts: 139, comments: 2210 },
  { name: "Week 3", posts: 200, workouts: 980, comments: 2290 },
  { name: "Week 4", posts: 278, workouts: 390, comments: 2000 },
];

const planData = [
  { name: "Premium Monthly", value: 400, color: "#2563eb" },
  { name: "Premium Annual", value: 300, color: "#60a5fa" },
  { name: "Free Tier", value: 300, color: "#cbd5e1" },
];

export function AdminReports() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Deeper insights into platform performance and growth.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all">
            <Calendar className="w-4 h-4" />
            <span>Generate PDF Report</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <DollarSign size={20} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              +14.2%
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Monthly Revenue</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">$142,482</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Users size={20} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              +8.7%
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">New Subscriptions</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">1,284</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <TrendingUp size={20} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight size={12} />
              -2.1%
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Active Churn Rate</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">3.4%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
          <h3 className="font-bold text-slate-900 leading-tight mb-6">User Engagement Over Time</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="posts" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="workouts" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
          <h3 className="font-bold text-slate-900 leading-tight mb-6">Subscription Breakdown</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
