import { MessageSquare, ThumbsUp, CheckCircle, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { DataTable } from "../../app/components/admin/DataTable";

const postData = [
  { id: 1, author: "Alex Thompson", title: "Just completed my first 5k run!", preview: "I never thought I could do it, but today I pushed past my limits and...", status: "Published", likes: 124, comments: 12, date: "2 mins ago" },
  { id: 2, author: "Sarah Jenkins", title: "New high protein meal prep idea", preview: "Looking for something quick and healthy? Try this chicken and avocado bowl...", status: "Published", likes: 89, comments: 24, date: "15 mins ago" },
  { id: 3, author: "Mike Ross", title: "Warning: Equipment issues at Downtown Gym", preview: "Just wanted to let everyone know that the Smith machine is currently...", status: "Flagged", likes: 5, comments: 42, date: "1 hour ago" },
  { id: 4, author: "Emma Watson", title: "7-Day transformation progress!", preview: "Feeling stronger every day. Here is a comparison of how I looked just...", status: "Pending", likes: 0, comments: 0, date: "3 hours ago" },
];

export function AdminPosts() {
  const [posts, setPosts] = useState(postData);

  const columns = [
    {
      header: "Author",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-brand-text text-sm border border-gray-100 shadow-sm">
            {row.author.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-black text-brand-text text-sm">{row.author}</span>
        </div>
      ),
    },
    {
      header: "Content",
      render: (row) => (
        <div className="max-w-md py-1">
          <div className="font-black text-brand-text truncate leading-tight text-sm tracking-tight">{row.title}</div>
          <div className="text-xs font-medium text-brand-muted truncate mt-1 leading-tight">{row.preview}</div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${row.status === "Published" ? "bg-brand-green/10 text-brand-green" :
            row.status === "Flagged" ? "bg-brand-red/10 text-brand-red" : "bg-amber-500/10 text-amber-500"
          }`}>
          {row.status === "Published" ? <CheckCircle size={12} strokeWidth={3} /> :
            row.status === "Flagged" ? <AlertCircle size={12} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
          {row.status}
        </span>
      ),
    },
    {
      header: "Engagement",
      render: (row) => (
        <div className="flex items-center gap-4 text-brand-text text-xs font-black">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
            <ThumbsUp size={14} className="text-brand-orange" />
            <span>{row.likes}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
            <MessageSquare size={14} className="text-blue-500" />
            <span>{row.comments}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Posted",
      accessor: "date",
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-text tracking-tight">Post Moderation</h1>
          <p className="text-brand-muted font-medium mt-1">Monitor and manage community posts and engagement.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 text-brand-text font-black rounded-2xl shadow-sm hover:bg-gray-50 hover:border-brand-orange/30 hover:shadow-md active:scale-[0.98] transition-all">
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <DataTable
        title="Community Posts"
        description="A live feed of all posts created by users. Flagged posts require immediate action."
        columns={columns}
        data={posts}
        onSearch={(val) => {
          const filtered = postData.filter(p =>
            p.title.toLowerCase().includes(val.toLowerCase()) ||
            p.author.toLowerCase().includes(val.toLowerCase())
          );
          setPosts(filtered);
        }}
      />
    </div>
  );
}
