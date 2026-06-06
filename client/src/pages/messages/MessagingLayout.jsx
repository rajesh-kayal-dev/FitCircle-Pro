import React, { useState } from "react";
import { Outlet, useParams, useLocation } from "react-router";
import { MessageSquare } from "lucide-react";
import { Sidebar } from "../../app/components/layout/Sidebar";
import { Header } from "../../app/components/layout/Header";
import { useAuth } from "../../context/AuthContext";
import { useMessaging } from "../../context/MessagingContext";
import { MessagesScreen } from "./MessagesScreen";

/**
 * Empty state for desktop messaging when no chat is selected.
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-8 text-center">
      <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
        <MessageSquare size={42} className="text-gray-200" />
      </div>
      <h2 className="text-xl font-black text-brand-text tracking-tight mb-2">Your Messages</h2>
      <p className="text-sm text-brand-muted max-w-[280px] leading-relaxed">
        Send private photos and messages to a friend or group.
      </p>
      <button className="mt-6 energy-gradient text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-brand-orange/20 hover:scale-105 transition-transform">
        Send Message
      </button>
    </div>
  );
}

export function MessagingLayout() {
  const { conversationId, groupId } = useParams();
  const { user } = useAuth();
  const { totalUnread } = useMessaging();
  const isAnyChatSelected = !!(conversationId || groupId);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg flex overflow-hidden">
      {/* ── Desktop Layout (lg+) ── */}
      <div className="hidden lg:block h-screen w-full overflow-hidden">
        {/* Fixed Sidebar with collapse state */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Content dynamically shifts based on sidebar state */}
        <div
          className="h-screen flex flex-col transition-all duration-300 ease-in-out"
          style={{
            marginLeft: isCollapsed ? 80 : 260,
            width: `calc(100% - ${isCollapsed ? 80 : 260}px)`
          }}
        >
          <Header
            user={user}
            totalUnread={totalUnread}
            dropdownOpen={false}
            setDropdownOpen={() => { }}
            dropdownRef={{ current: null }}
            ProfileDropdown={() => null}
          />

          <div className="flex-1 grid grid-cols-[350px_1fr] overflow-hidden">
            {/* Chat List (middle column) */}
            <div className="flex flex-col border-r border-gray-100 overflow-y-auto">
              <MessagesScreen />
            </div>

            {/* Chat Window (right column) */}
            <div className="flex flex-col overflow-hidden bg-gray-50/30">
              {isAnyChatSelected ? <Outlet /> : <EmptyState />}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Layout (<lg) ── */}
      <div className="lg:hidden fixed inset-0 z-[100] flex flex-col bg-white overflow-hidden">
        {/* Use the existing glassmorphism feel for mobile if desired, 
            but the user said "DO NOT change mobile view". 
            The original MessagingLayout had a background image. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&h=900&fit=crop"
            alt=""
            className="w-full h-full object-cover scale-110 opacity-30 blur-3xl"
          />
        </div>
        <div className="relative flex-1 flex flex-col h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
