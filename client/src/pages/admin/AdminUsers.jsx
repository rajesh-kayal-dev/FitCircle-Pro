import React, { useState } from "react";
import { DataTable } from "../../app/components/admin/DataTable";
import { User, ShieldCheck, ShieldAlert, Mail, UserPlus, Trash2, Eye, Ban } from "lucide-react";

const userData = [
  { id: 1, name: "Alex Thompson", email: "alex.t@example.com", status: "Active", role: "Premium", joined: "Oct 12, 2026", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
  { id: 2, name: "Sarah Jenkins", email: "sarah.j@example.com", status: "Active", role: "Free", joined: "Oct 15, 2026", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: 3, name: "Mike Ross", email: "mike.ross@example.com", status: "Suspended", role: "Premium", joined: "Sep 20, 2026", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" },
  { id: 4, name: "Emma Watson", email: "emma.w@example.com", status: "Active", role: "Premium", joined: "Oct 20, 2026", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  { id: 5, name: "John Doe", email: "john.doe@example.com", status: "Inactive", role: "Free", joined: "Aug 10, 2026", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { id: 6, name: "Robert Fox", email: "robert.f@example.com", status: "Active", role: "Premium", joined: "Oct 22, 2026", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
];

export function AdminUsers() {
  const [users, setUsers] = useState(userData);

  const columns = [
    {
      header: "User",
      render: (row) => (
        <div className="flex items-center gap-4 py-2">
          <img src={row.avatar} alt={row.name} className="w-12 h-12 rounded-[1rem] object-cover border border-gray-100 shadow-sm" />
          <div>
            <div className="font-black text-brand-text leading-tight text-sm tracking-tight">{row.name}</div>
            <div className="text-xs font-bold text-brand-muted leading-tight mt-1">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${row.status === "Active" ? "bg-brand-green/10 text-brand-green" :
            row.status === "Suspended" ? "bg-brand-red/10 text-brand-red" : "bg-gray-100 text-gray-500"
          }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Plan",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${row.role === "Premium" ? "bg-brand-orange/10 text-brand-orange" : "bg-gray-100 text-gray-400"}`}>
            {row.role === "Premium" ? (
              <ShieldCheck size={16} />
            ) : (
              <ShieldAlert size={16} />
            )}
          </div>
          <span className="font-bold text-brand-text text-sm">{row.role}</span>
        </div>
      ),
    },
    {
      header: "Joined Date",
      accessor: "joined",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-text tracking-tight">User Management</h1>
          <p className="text-brand-muted font-medium mt-1">View and manage all registered platform users.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-brand-text text-white font-black rounded-2xl shadow-lg hover:bg-gray-800 active:scale-[0.98] transition-all group">
          <UserPlus size={18} className="group-hover:translate-x-0.5 transition-transform" />
          <span>Add New User</span>
        </button>
      </div>

      <DataTable
        title="All Users"
        description="A list of all users in your community including their name, role and status."
        columns={columns}
        data={users}
        onSearch={(val) => {
          const filtered = userData.filter(u =>
            u.name.toLowerCase().includes(val.toLowerCase()) ||
            u.email.toLowerCase().includes(val.toLowerCase())
          );
          setUsers(filtered);
        }}
      />
    </div>
  );
}
