import React from "react";
import { Search, Bell, User, Menu } from "lucide-react";

export function AdminHeader({ toggleSidebar }) {
  return (
    <header className="sticky top-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 w-full flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-500"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors group">
          <Bell className="w-5 h-5 group-hover:text-slate-900" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">Admin User</p>
            <p className="text-xs text-slate-500 mt-1 leading-none">Administrator</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <User className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
