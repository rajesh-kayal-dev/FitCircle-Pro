import React from "react";
import { User, Bell, Shield, Globe, Mail, Save, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export function AdminSettings() {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-1">Configure your dashboard preferences and platform rules.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile Section */}
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Admin Profile</h3>
              <p className="text-sm text-slate-500 mt-1">Personalize your administrative account details.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
              <input
                type="text"
                defaultValue="System Admin"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Email Address</label>
              <input
                type="email"
                defaultValue="admin@fitcirclepro.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Platform Preferences</h3>
              <p className="text-sm text-slate-500 mt-1">Configure global application behavior.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                <p className="text-xs text-slate-500">Temporarily disable user access to the platform.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out">
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">User Registrations</p>
                <p className="text-xs text-slate-500">Allow new users to sign up for accounts.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out">
                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Automated Moderation</p>
                <p className="text-xs text-slate-500">Enable AI-powered flag detection for posts.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out">
                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => toast.error("Logout feature not implemented in demo.")}
            className="flex items-center gap-2 text-rose-600 font-bold hover:bg-rose-50 px-4 py-2 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out Account</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all group"
          >
            <Save size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
