import { Activity, AlertCircle, BarChart2, CheckCircle, Download, Edit2, Eye, FileImage, LayoutDashboard, LogOut, MoreHorizontal, Music2, Package, Pause, Play, Plus, Search, ShieldCheck, ShoppingBag, Star, Trash2, TrendingDown, TrendingUp, Upload, Users, XCircle } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useMusic } from "../context/MusicContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  adminGetUsers,
  adminUpdateUserStatus,
  adminDeleteUser
} from "../api/endpoints";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ─── Mock Data ─────────────────────────────────────────── */

const kpiData = [
  {
    label: "Total Users",
    value: "42,518",
    change: "+12.4%",
    up: true,
    icon: Users,
    color: "bg-brand-orange/10 text-brand-orange",
 }, {
    label: "Active Workouts",
    value: "1.24M",
    change: "+8.1%",
    up: true,
    icon: Activity,
    color: "bg-brand-green/10 text-brand-green",
 }, {
    label: "Monthly Revenue",
    value: "₹38.6L",
    change: "+21.3%",
    up: true,
    icon: ShoppingBag,
    color: "bg-purple-100 text-purple-600",
 }, {
    label: "Pending Approvals",
    value: "247",
    change: "+34 today",
    up: false,
    icon: AlertCircle, color: "bg-brand-red/10 text-brand-red",
 }, ];

const revenueData = [
  { month: "Oct", revenue: 2100, users: 340 }, { month: "Nov", revenue: 2800, users: 420 }, { month: "Dec", revenue: 3600, users: 510 }, { month: "Jan", revenue: 3100, users: 480 }, { month: "Feb", revenue: 4200, users: 610 }, { month: "Mar", revenue: 3860, users: 720 }, ];

const weeklyActiveData = [
  { day: "Mon", users: 3200 }, { day: "Tue", users: 4100 }, { day: "Wed", users: 3800 }, { day: "Thu", users: 5200 }, { day: "Fri", users: 4800 }, { day: "Sat", users: 6100 }, { day: "Sun", users: 5500 }, ];

const categoryData = [
  { name: "Protein", value: 38, color: "#F97316" }, { name: "Equipment", value: 24, color: "#22C55E" }, { name: "Supplements", value: 21, color: "#EF4444" }, { name: "Accessories", value: 17, color: "#9CA3AF" }, ];

const usersMock = [
  {
    id: 1,
    name: "Arjun Sharma",
    handle: "@arjun_lifts",
    email: "arjun@fitcircle.pro",
    role: "Influencer",
    status: "Active",
    followers: "2.4M",
    joined: "Jan 12, 2025",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop",
 }, {
    id: 2,
    name: "Priya Mehta",
    handle: "@priya_yoga",
    email: "priya@gmail.com",
    role: "Member",
    status: "Active",
    followers: "12.1K",
    joined: "Mar 05, 2025",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
 }, {
    id: 3,
    name: "Rohan Verma",
    handle: "@rohan_gains",
    email: "rohan.v@outlook.com",
    role: "Member",
    status: "Banned",
    followers: "890",
    joined: "Feb 18, 2025",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
 }, {
    id: 4,
    name: "Sneha Kapoor",
    handle: "@sneha_athlete",
    email: "sneha@fitcircle.pro",
    role: "Influencer",
    status: "Active",
    followers: "1.8M",
    joined: "Nov 22, 2024",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
 }, {
    id: 5,
    name: "Vikram Nair",
    handle: "@vik_hiit",
    email: "vikram@domain.io",
    role: "Trainer",
    status: "Active",
    followers: "45.2K",
    joined: "Dec 01, 2024",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80&h=80&fit=crop",
 }, ];

const pendingContent = [
  {
    id: 1,
    type: "Post",
    author: "Arjun Sharma",
    caption: "Day 5 of the Shred Program. Consistency is everything.",
    thumb: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    submitted: "2h ago",
 }, {
    id: 2,
    type: "Reel",
    author: "Priya Mehta",
    caption: "Morning mobility flow — your joints will thank you!",
    thumb: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop",
    submitted: "4h ago",
 }, {
    id: 3,
    type: "Post",
    author: "Vikram Nair",
    caption: "New PR today — 140kg squat. The grind never stops.",
    thumb: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
    submitted: "6h ago",
 }, {
    id: 4,
    type: "Reel",
    author: "Sneha Kapoor",
    caption: "Explosive plyometric circuits for real power gains.",
    thumb: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
    submitted: "8h ago",
 }, ];

const products = [
  {
    id: 1,
    name: "Whey Isolate 2kg",
    brand: "Optimum Nutrition",
    category: "Protein",
    price: "₹5,499",
    stock: 142,
    rating: 4.9,
    status: "Active",
 }, {
    id: 2,
    name: "Creatine Monohydrate",
    brand: "MuscleTech",
    category: "Supplements",
    price: "₹1,299",
    stock: 88,
    rating: 4.8,
    status: "Active",
 }, {
    id: 3,
    name: "Resistance Band Set",
    brand: "Decathlon",
    category: "Equipment",
    price: "₹899",
    stock: 0,
    rating: 4.7,
    status: "Out of Stock",
 }, {
    id: 4,
    name: "Pre-Workout Ignite",
    brand: "BigMuscles",
    category: "Supplements",
    price: "₹2,199",
    stock: 34,
    rating: 4.6,
    status: "Active",
 }, {
    id: 5,
    name: "Yoga Mat (Non-Slip)",
    brand: "FitCircle",
    category: "Equipment",
    price: "₹1,499",
    stock: 210,
    rating: 4.9,
    status: "Active",
 }, ];

const recentActivity = [
  { id: 1, text: "New influencer application: Rahul S.", time: "2m ago", icon: Users, color: "text-brand-orange" }, { id: 2, text: "Product 'Whey Isolate' restocked (200 units).", time: "18m ago", icon: Package, color: "text-brand-green" }, { id: 3, text: "Post flagged for review by 5 users.", time: "45m ago", icon: AlertCircle, color: "text-brand-red" }, { id: 4, text: "New order #4812 placed — ₹3,498.", time: "1h ago", icon: ShoppingBag, color: "text-purple-500" }, { id: 5, text: "User @rohan_gains account suspended.", time: "3h ago", icon: ShieldCheck, color: "text-brand-muted" }, ];

/* ─── Sub-components ────────────────────────────────────── */

const StatusBadge = ({ status }) => {
  const map = {
    ACTIVE: "bg-brand-green/10 text-brand-green",
    BANNED: "bg-brand-red/10 text-brand-red",
    PENDING: "bg-brand-orange/10 text-brand-orange",
    "OUT OF STOCK": "bg-brand-red/10 text-brand-red",
    APPROVED: "bg-brand-green/10 text-brand-green",
    REJECTED: "bg-brand-muted/20 text-brand-muted",
  };
  const displayStatus = status?.toUpperCase() || "UNKNOWN";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${map[displayStatus] || "bg-gray-100 text-gray-500"}`}>
      {displayStatus}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const map = {
    INFLUENCER: "bg-brand-orange/10 text-brand-orange",
    TRAINER: "bg-purple-100 text-purple-600",
    MEMBER: "bg-gray-100 text-gray-500",
    ADMIN: "bg-brand-text/10 text-brand-text",
    USER: "bg-gray-100 text-gray-500",
  };
  const displayRole = role?.toUpperCase() || "USER";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${map[displayRole] || "bg-gray-100 text-gray-500"}`}>
      {displayRole}
    </span>
  );
};

const KPICard = ({ item, index }) => {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${item.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold ${item.up ? "text-brand-green" : "text-brand-red"}`}>
          {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {item.change}
        </span>
      </div>
      <div className="text-2xl font-black text-brand-text mb-1">{item.value}</div>
      <div className="text-xs text-brand-muted font-semibold uppercase tracking-wider">{item.label}</div>
    </motion.div>
  );
};

/* ─── Tab Panels ────────────────────────────────────────── */

function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((item, i) => (
          <KPICard key={item.label} item={item} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-brand-text">Revenue Overview</h3>
              <p className="text-xs text-brand-muted font-medium mt-0.5">Last 6 months</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-text px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 transition-colors">
              <Download className="w-3 h-3" />
              Export CSV
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 12 }}
                cursor={{ stroke: "#F97316", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-black text-brand-text mb-6">Recent Activity</h3>
          <ul className="space-y-4">
            {recentActivity.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-brand-text leading-snug">{item.text}</p>
                    <span className="text-[10px] text-brand-muted font-medium">{item.time}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-black text-brand-text">Weekly Active Users</h3>
            <p className="text-xs text-brand-muted font-medium mt-0.5">Current week</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyActiveData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 12 }}
              cursor={{ fill: "#F9FAFB" }}
            />
            <Bar dataKey="users" fill="#F97316" radius={[8, 8, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminGetUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load users ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const response = await adminUpdateUserStatus(id);
      toast.success(response.data.message);
      fetchUsers();
    } catch (error) {
      toast.error("Action failed ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This delete the user forever!")) return;
    try {
      const response = await adminDeleteUser(id);
      toast.success(response.data.message);
      fetchUsers();
    } catch (error) {
      toast.error("Deletion failed ❌");
    }
  };

  const filters = ["All", "ACTIVE", "BANNED", "ADMIN"];

  const filtered = users.filter((u) => {
    const matchSearch =
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      u.status === filter ||
      u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 w-full sm:w-72 shadow-sm">
          <Search className="w-4 h-4 text-brand-muted" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${filter === f
                  ? "bg-brand-text text-white border-brand-text shadow-md"
                  : "bg-white text-brand-muted border-gray-200 hover:bg-gray-50"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center"><p className="text-brand-muted animate-pulse font-bold">Fetching real-time data...</p></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-6 py-4">User</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4 hidden md:table-cell">Role</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4 hidden lg:table-cell">Joined</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4">Status</th>
                  <th className="text-right text-[10px] font-black uppercase tracking-widest text-brand-muted px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-gray-50 shadow-sm">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-black text-xs border border-brand-orange/20">
                              {user.displayName?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-brand-text truncate">{user.displayName}</div>
                          <div className="text-[10px] text-brand-muted truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-[11px] text-brand-muted font-bold uppercase tracking-tight">{user.joined}</span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleToggleBlock(user.id)}
                          className={`p-2 rounded-xl transition-all ${user.status === "BANNED" ? "bg-brand-green/10 text-brand-green hover:bg-brand-green/20" : "bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20"}`}
                          title={user.status === "BANNED" ? "Unblock User" : "Block User"}
                        >
                          {user.status === "BANNED" ? <ShieldCheck className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-brand-red/10 text-brand-red hover:bg-brand-red/20 rounded-xl transition-all" 
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-brand-muted font-black text-sm uppercase tracking-widest">No matching users found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContentTab() {
  const [items, setItems] = useState(pendingContent);

  const handleApprove = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const handleReject = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-brand-text">Content Moderation</h3>
          <p className="text-xs text-brand-muted mt-0.5">{items.length} item(s) awaiting review</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
          <CheckCircle className="w-10 h-10 text-brand-green mx-auto mb-4" />
          <p className="font-black text-brand-text text-lg">All caught up!</p>
          <p className="text-sm text-brand-muted mt-1">No content pending review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img src={item.thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.type === "Reel" ? "bg-brand-orange text-white" : "bg-white/90 text-brand-text"}`}>
                    {item.type}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-xs font-bold line-clamp-1">{item.author}</p>
                    <p className="text-white/70 text-[10px] line-clamp-2 mt-0.5">{item.caption}</p>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-green/10 text-brand-green rounded-xl text-xs font-black hover:bg-brand-green hover:text-white transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-red/10 text-brand-red rounded-xl text-xs font-black hover:bg-brand-red hover:text-white transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
                <p className="text-[10px] text-brand-muted font-medium text-center pb-3">{item.submitted}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ProductsTab() {
  const [productList, setProductList] = useState(products);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-brand-text">Product Inventory</h3>
          <p className="text-xs text-brand-muted mt-0.5">{productList.length} products listed</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-text text-white rounded-2xl text-xs font-black hover:bg-brand-orange transition-all shadow-lg shadow-gray-200">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-6 py-4">Product</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4 hidden md:table-cell">Category</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4">Price</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4 hidden lg:table-cell">Stock</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4 hidden lg:table-cell">Rating</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4">Status</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productList.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-bold text-brand-text">{p.name}</div>
                      <div className="text-xs text-brand-muted">{p.brand}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs font-bold text-brand-muted">{p.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-black text-brand-text">{p.price}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className={`text-sm font-bold ${p.stock === 0 ? "text-brand-red" : "text-brand-text"}`}>
                      {p.stock === 0 ? "0 (Out)" : p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                      <span className="text-sm font-bold text-brand-text">{p.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-gray-100 rounded-xl text-brand-muted hover:text-brand-text transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProductList((prev) => prev.filter((x) => x.id !== p.id))}
                        className="p-2 hover:bg-brand-red/10 rounded-xl text-brand-muted hover:text-brand-red transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue area chart */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-black text-brand-text mb-1">Revenue & Users</h3>
          <p className="text-xs text-brand-muted mb-6">Last 6 months comparison</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue (₹00)" stroke="#F97316" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
              <Area type="monotone" dataKey="users" name="New Users" stroke="#22C55E" strokeWidth={2.5} fill="url(#userGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-black text-brand-text mb-1">Sales by Category</h3>
          <p className="text-xs text-brand-muted mb-6">Revenue share breakdown</p>
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 12 }}
                  formatter={(value) => [`${value}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs font-bold text-brand-text">{item.name}</span>
                  <span className="text-xs font-black text-brand-muted ml-auto pl-4">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart full width */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-base font-black text-brand-text mb-1">Weekly Active Users</h3>
        <p className="text-xs text-brand-muted mb-6">Daily breakdown — current week</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyActiveData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 12 }} cursor={{ fill: "#F9FAFB" }} />
            <Bar dataKey="users" name="Active Users" fill="#111827" radius={[8, 8, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── Main Admin Page ───────────────────────────────────── */

/* ─── Orders Tab ─────────────────────────────────────────── */

const ordersData = [
  { id: "#4821", customer: "Arjun Sharma", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", items: "Whey Isolate 2kg × 1", amount: "₹5,499", status: "Pending", date: "Mar 21, 2026", city: "Bangalore" }, { id: "#4820", customer: "Priya Mehta", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", items: "Yoga Mat × 2", amount: "₹2,998", status: "Shipped", date: "Mar 20, 2026", city: "Delhi" }, { id: "#4819", customer: "Rohan Verma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", items: "Creatine × 1", amount: "₹1,299", status: "Delivered", date: "Mar 19, 2026", city: "Pune" }, { id: "#4818", customer: "Sneha Kapoor", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop", items: "Pre-Workout × 2, Shaker × 1", amount: "₹4,897", status: "Confirmed", date: "Mar 18, 2026", city: "Mumbai" }, { id: "#4817", customer: "Vikram Nair", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80&h=80&fit=crop", items: "Resistance Band Set × 1", amount: "₹899", status: "Cancelled", date: "Mar 18, 2026", city: "Chennai" }, { id: "#4816", customer: "Nandini G.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop", items: "BCAA Energy × 3", amount: "₹5,397", status: "Delivered", date: "Mar 17, 2026", city: "Hyderabad" }, ];

const ORDER_STATUS_COLORS = {
  Pending: "bg-brand-amber/10 text-brand-amber",
  Confirmed: "bg-brand-cyan/10 text-brand-cyan",
  Shipped: "bg-brand-purple/10 text-brand-purple",
  Delivered: "bg-brand-green/10 text-brand-green",
  Cancelled: "bg-brand-red/10 text-brand-red",
};

function OrdersTab() {
  const [orderList, setOrderList] = useState(ordersData);
  const [filterStatus, setFilterStatus] = useState("All");
  const statusFilters = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  const allStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

  const filtered = filterStatus === "All" ? orderList : orderList.filter((o) => o.status === filterStatus);

  const updateStatus = (id, newStatus) => {
    setOrderList((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-brand-text">Order Management</h3>
          <p className="text-xs text-brand-muted mt-0.5">{orderList.length} total orders</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${filterStatus === f
                  ? "bg-brand-text text-white border-brand-text"
                  : "bg-white text-brand-muted border-gray-200 hover:bg-gray-50"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-6 py-4">Order</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4">Customer</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4 hidden md:table-cell">Items</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4">Amount</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4">Status</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4 hidden lg:table-cell">Date</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-brand-orange">{order.id}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <img src={order.avatar} alt={order.customer} className="w-8 h-8 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-bold text-brand-text">{order.customer}</p>
                        <p className="text-[10px] text-brand-muted">{order.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-brand-muted font-medium">{order.items}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-black text-brand-text">{order.amount}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-500"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-brand-muted font-medium">{order.date}</span>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-xs font-bold text-brand-text bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 focus:outline-none focus:border-brand-orange cursor-pointer"
                    >
                      {allStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-brand-muted font-semibold text-sm">No orders found.</div>
        )}
      </div>
    </div>
  );
}

/* ─── Admin Music Tab ─────────────────────────────────────── */
function MusicTab() {
  const { albums, addAlbum, playTrack, currentTrack, isPlaying } = useMusic();
  const [form, setForm] = useState({ title: "", artist: "", genre: "Hip-Hop", duration: "3:00", cover: "", audioUrl: "" });
  const [showForm, setShowForm] = useState(false);
  const coverRef = useRef(null);

  const GENRES = ["Hip-Hop", "EDM", "Rock", "Chill", "Metal", "Pop", "Reggae", "Jazz"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.artist) { toast.error("Title and artist are required."); return; }
    addAlbum({
      ...form,
      cover: form.cover || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop`,
      audioUrl: form.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    });
    setForm({ title: "", artist: "", genre: "Hip-Hop", duration: "3:00", cover: "", audioUrl: "" });
    setShowForm(false);
    toast.success("Track added to Vibe Zone!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-brand-text">Vibe Zone — Music Library</h3>
          <p className="text-xs text-brand-muted mt-0.5">{albums.length} tracks available</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-text text-white rounded-2xl text-xs font-black hover:bg-brand-orange transition-all shadow-lg shadow-gray-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Track
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h4 className="text-sm font-black text-brand-text mb-4">New Track</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-brand-muted uppercase tracking-widest mb-1.5 block">Track Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Beast Mode"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs font-black text-brand-muted uppercase tracking-widest mb-1.5 block">Artist *</label>
              <input
                type="text"
                value={form.artist}
                onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
                placeholder="e.g. Workout Hits"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs font-black text-brand-muted uppercase tracking-widest mb-1.5 block">Genre</label>
              <select
                value={form.genre}
                onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-brand-orange transition-colors cursor-pointer"
              >
                {GENRES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-brand-muted uppercase tracking-widest mb-1.5 block">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 3:42"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-black text-brand-muted uppercase tracking-widest mb-1.5 block">Cover Image URL</label>
              <input
                type="url"
                value={form.cover}
                onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-black text-brand-muted uppercase tracking-widest mb-1.5 block">Audio URL</label>
              <input
                type="url"
                value={form.audioUrl}
                onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-brand-orange transition-colors"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-black hover:bg-orange-600 transition-colors shadow-md shadow-brand-orange/20 cursor-pointer">
                <Upload className="w-4 h-4" /> Add to Library
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-brand-muted rounded-xl text-sm font-black hover:bg-gray-200 transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Track list */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-6 py-4">Track</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4 hidden md:table-cell">Genre</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4 hidden lg:table-cell">Duration</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-brand-muted px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {albums.map((album) => {
                const isActive = currentTrack?.id === album.id;
                return (
                  <tr key={album.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
                          {isActive && (
                            <div className="absolute inset-0 bg-brand-orange/80 flex items-center justify-center">
                              {isPlaying ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white fill-white" />}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className={`text-sm font-bold ${isActive ? "text-brand-orange" : "text-brand-text"}`}>{album.title}</div>
                          <div className="text-xs text-brand-muted">{album.artist}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs font-bold text-brand-muted">{album.genre}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm font-bold text-brand-text">{album.duration}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => playTrack(album)}
                          className="p-2 hover:bg-brand-orange/10 rounded-xl text-brand-muted hover:text-brand-orange transition-colors cursor-pointer"
                          title={isActive && isPlaying ? "Pause" : "Play"}
                        >
                          {isActive && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard }, { id: "users", label: "Users", icon: Users }, { id: "content", label: "Content", icon: FileImage }, { id: "products", label: "Products", icon: ShoppingBag }, { id: "orders", label: "Orders", icon: Package }, { id: "analytics", label: "Analytics", icon: BarChart2 }, { id: "music", label: "Music", icon: Music2 }, ];

export default function Admin() {
  const [activeTab, setActiveTabState] = useState(() => {
    return localStorage.getItem("admin_active_tab") || "overview";
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    localStorage.setItem("admin_active_tab", tab);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "users": return <UsersTab />;
      case "content": return <ContentTab />;
      case "products": return <ProductsTab />;
      case "orders": return <OrdersTab />;
      case "analytics": return <AnalyticsTab />;
      case "music": return <MusicTab />;
      default: return null;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-brand-orange" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Admin Panel</span>
          </div>
          <h1 className="text-3xl font-black text-brand-text tracking-tighter">Dashboard</h1>
          <p className="text-brand-muted font-medium text-sm mt-1">Manage users, content, products and platform analytics.</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("fitcircle_token");
            localStorage.removeItem("admin_active_tab");
            window.location.href = "/";
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-2xl font-black text-xs transition-colors border border-red-100 shadow-sm whitespace-nowrap"
        >
          <LogOut className="w-4 h-4" />
          Admin Logout
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto hide-scrollbar bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-8">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive
                  ? "bg-brand-text text-white shadow-md"
                  : "text-brand-muted hover:text-brand-text hover:bg-gray-50"
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
