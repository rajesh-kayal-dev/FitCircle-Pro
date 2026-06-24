import { ArrowLeft, Search, Users, MessageSquare, Edit3, Bot, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { useMessaging } from "../../context/MessagingContext";
import { formatMessageTime } from "./utils";
import { cn } from "../../app/components/ui";

function OnlineDot({ status }) {
  if (status !== "online") return null;
  return (
    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-brand-green rounded-full border-2 border-white" />
  );
}

function UnreadBadge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-2 min-w-[20px] h-5 bg-brand-orange text-white text-[9px] font-black rounded-full flex items-center justify-center px-1.5 flex-shrink-0">
      {count > 9 ? "9+" : count}
    </span>
  );
}

function ActiveUsersStrip({ contacts, conversations, onSelect }) {
  const online = Object.values(contacts).filter((c) => c.status === "online");
  if (online.length === 0) return null;

  return (
    <div className="px-4 pb-3">
      <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-3">
        Active Now
      </p>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
        {online.map((user) => {
          const conv = conversations.find((c) => c.participantId === user.id);
          return (
            <motion.button
              key={user.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => conv && onSelect(conv.id)}
              className="flex flex-col items-center gap-1.5 min-w-[58px] focus:outline-none"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-brand-orange/20 ring-offset-1">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-brand-green rounded-full border-2 border-white" />
              </div>
              <span className="text-[10px] font-bold text-brand-muted truncate w-full text-center">
                {user.name.split(" ")[0]}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── AI Coaches Strip ─────────────────────────────────────────
const AI_AGENTS = [
  { id: "conv_fitcoach_ai",    label: "FitCoach",    emoji: "🏋️", gradient: "from-orange-500 to-red-500" },
  { id: "conv_weightloss_ai", label: "WeightLoss",   emoji: "🔥", gradient: "from-amber-400 to-orange-500" },
  { id: "conv_musclegain_ai", label: "MuscleGain",   emoji: "💪", gradient: "from-purple-500 to-pink-500" },
  { id: "conv_nutrition_ai",  label: "Nutrition",    emoji: "🥗", gradient: "from-green-500 to-teal-500" },
  { id: "conv_workout_ai",    label: "Workouts",     emoji: "📋", gradient: "from-blue-500 to-indigo-500" },
  { id: "conv_homeworkout_ai",label: "HomeGym",      emoji: "🏠", gradient: "from-cyan-500 to-blue-500" },
  { id: "conv_yoga_ai",       label: "Yoga",         emoji: "🧘", gradient: "from-rose-400 to-purple-500" },
  { id: "conv_motivation_ai", label: "Motivation",   emoji: "⚡", gradient: "from-yellow-400 to-orange-500" },
];

function AICoachesStrip({ onSelect }) {
  return (
    <div className="px-4 pb-3">
      <div className="flex items-center gap-1.5 mb-3">
        <Bot size={12} className="text-brand-orange" />
        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">AI Coaches</p>
        <span className="flex items-center gap-0.5 bg-brand-orange/10 text-brand-orange text-[8px] font-black px-1.5 py-0.5 rounded-full border border-brand-orange/20">
          <Sparkles size={7} />Powered by Groq
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
        {AI_AGENTS.map((agent) => (
          <motion.button
            key={agent.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(agent.id)}
            className="flex flex-col items-center gap-1.5 min-w-[54px] focus:outline-none"
          >
            <div className={`relative w-13 h-13 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xl shadow-md`}
              style={{ width: 52, height: 52 }}
            >
              {agent.emoji}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-green rounded-full border-2 border-white animate-pulse" />
            </div>
            <span className="text-[9px] font-bold text-brand-muted truncate w-full text-center">{agent.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function GroupItem({ group }) {
  return (
    <Link to={`/messages/group/${group.id}`}>
      <motion.div
        whileTap={{ scale: 0.995 }}
        className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        {/* Group avatar */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${group.gradient} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}
        >
          {group.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-bold text-brand-text truncate ${group.unreadCount > 0 ? "font-black" : ""
                }`}
            >
              {group.name}
            </span>
            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
              <span className="text-[10px] text-brand-muted font-medium">
                {formatMessageTime(group.lastMessage?.timestamp)}
              </span>
              <UnreadBadge count={group.unreadCount} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span
              className={`text-xs truncate ${group.unreadCount > 0
                  ? "text-brand-text font-semibold"
                  : "text-brand-muted"
                }`}
            >
              {group.lastMessage
                ? `${group.lastMessage.senderName}: ${group.lastMessage.text}`
                : "No messages yet"}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Users size={10} className="text-brand-muted flex-shrink-0" />
            <span className="text-[10px] text-brand-muted">{group.memberCount} members</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function ConversationItem({ conv, contact }) {
  return (
    <Link to={`/messages/${conv.id}`}>
      <motion.div
        whileTap={{ scale: 0.995 }}
        className={cn(
          "flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer",
          location.pathname === `/messages/${conv.id}` && "lg:bg-brand-orange/5 lg:border-r-2 lg:border-brand-orange"
        )}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl overflow-hidden">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-full h-full object-cover"
            />
          </div>
          <OnlineDot status={contact.status} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm text-brand-text truncate ${conv.unreadCount > 0 ? "font-black" : "font-bold"
                }`}
            >
              {contact.name}
            </span>
            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
              <span className="text-[10px] text-brand-muted font-medium">
                {formatMessageTime(conv.lastMessage?.timestamp)}
              </span>
              <UnreadBadge count={conv.unreadCount} />
            </div>
          </div>
          <span
            className={`text-xs truncate block mt-0.5 ${conv.unreadCount > 0 ? "text-brand-text font-semibold" : "text-brand-muted"
              }`}
          >
            {conv.lastMessage
              ? conv.lastMessage.isFromMe
                ? `You: ${conv.lastMessage.text}`
                : conv.lastMessage.text
              : "Say hello!"}
          </span>
          <span className="text-[10px] text-brand-muted block mt-0.5">{contact.role}</span>
        </div>
      </motion.div>
    </Link>
  );
}

const TABS = ["all", "dms", "groups"];

export function MessagesScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { conversations, groups, contacts } = useMessaging();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredConversations = conversations.filter((conv) => {
    const contact = contacts[conv.participantId];
    if (!contact) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return contact.name.toLowerCase().includes(q) || contact.handle.toLowerCase().includes(q);
  });

  const filteredGroups = groups.filter((group) => {
    if (!searchQuery) return true;
    return group.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const showGroups = activeTab === "all" || activeTab === "groups";
  const showDMs = activeTab === "all" || activeTab === "dms";

  const isEmpty =
    (showGroups && filteredGroups.length === 0) &&
    (showDMs && filteredConversations.length === 0);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl text-brand-muted hover:text-brand-text hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center lg:hidden"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-black text-brand-text tracking-tight">Messages</h1>
        </div>
        <button
          className="p-2 rounded-xl text-brand-muted hover:text-brand-text hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="New message"
        >
          <Edit3 size={20} />
        </button>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100 focus-within:border-brand-orange/40 transition-colors">
          <Search size={15} className="text-brand-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-brand-muted/60 text-brand-text"
            aria-label="Search messages"
          />
        </div>
      </div>

      {/* ── Active Users ── */}
      {!searchQuery && (
        <ActiveUsersStrip
          contacts={contacts}
          conversations={conversations}
          onSelect={(id) => navigate(`/messages/${id}`)}
        />
      )}

      {/* ── AI Coaches Strip ── */}
      {!searchQuery && (
        <AICoachesStrip onSelect={(convId) => navigate(`/messages/${convId}`)} />
      )}

      {/* ── Tab Pills ── */}
      <div className="flex gap-1.5 px-4 mb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all min-h-[36px] ${activeTab === tab
                ? "bg-brand-text text-white shadow-sm"
                : "text-brand-muted hover:text-brand-text hover:bg-gray-50"
              }`}
          >
            {tab === "dms" ? "DMs" : tab === "all" ? "All" : "Groups"}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Groups */}
        {showGroups && filteredGroups.length > 0 && (
          <div>
            {activeTab === "all" && (
              <div className="px-4 py-2">
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">
                  Community Groups
                </span>
              </div>
            )}
            {filteredGroups.map((group) => (
              <GroupItem key={group.id} group={group} />
            ))}
          </div>
        )}

        {/* Divider between groups and DMs */}
        {showGroups && showDMs && filteredGroups.length > 0 && filteredConversations.length > 0 && (
          <div className="px-4 py-2 mt-1">
            <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">
              Direct Messages
            </span>
          </div>
        )}

        {/* DMs */}
        {showDMs &&
          filteredConversations.map((conv) => {
            const contact = contacts[conv.participantId];
            if (!contact) return null;
            return <ConversationItem key={conv.id} conv={conv} contact={contact} />;
          })}

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-20 px-8">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-4">
              <MessageSquare size={28} className="text-gray-300" />
            </div>
            <p className="font-black text-brand-text text-sm">No messages found</p>
            <p className="text-xs text-brand-muted mt-1.5 text-center leading-relaxed">
              Start a conversation with trainers and friends
            </p>
          </div>
        )}

        {/* Bottom padding for safe area */}
        <div className="h-6" />
      </div>
    </div>
  );
}
