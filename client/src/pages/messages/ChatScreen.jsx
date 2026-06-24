import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft, Send, Smile, ImageIcon, MessageSquare,
  Check, CheckCheck, Bot, Sparkles, Download, FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMessaging } from "../../context/MessagingContext";
import { CURRENT_USER_ID } from "../../api/mockMessages";
import { formatChatTime, shouldShowTimeSeparator } from "./utils";
import { isPlanTrigger } from "../../api/aiChatApi";

// ── Download markdown as a file ───────────────────────────────
function downloadMarkdown(content, agentName) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fitcirclepro-plan-${agentName.toLowerCase().replace(/\s+/g, "-")}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Status Indicator ──────────────────────────────────────────
function StatusIndicator({ status, isAI }) {
  if (isAI) {
    return (
      <span className="text-[10px] font-bold flex items-center gap-1 text-brand-green">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green inline-block animate-pulse" />
        Always Online
      </span>
    );
  }
  const colors = { online: "text-brand-green", away: "text-brand-amber", offline: "text-brand-muted" };
  const labels = { online: "Online", away: "Away", offline: "Offline" };
  return (
    <span className={`text-[10px] font-bold flex items-center gap-1 ${colors[status] || colors.offline}`}>
      {status === "online" && <span className="w-1.5 h-1.5 rounded-full bg-brand-green inline-block" />}
      {labels[status] || "Offline"}
    </span>
  );
}

// ── Seen Indicator ────────────────────────────────────────────
function SeenIndicator({ status }) {
  if (!status) return null;
  return (
    <span className="ml-1 inline-flex items-center" aria-label={`Message ${status}`}>
      {status === "sending" && <Check size={11} className="text-gray-300" />}
      {status === "sent" && <Check size={11} className="text-gray-400" />}
      {status === "delivered" && <CheckCheck size={11} className="text-gray-400" />}
      {status === "seen" && <CheckCheck size={11} className="text-brand-cyan" />}
    </span>
  );
}

// ── AI Typing Bubble ──────────────────────────────────────────
function AITypingBubble({ agentName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="flex justify-start"
    >
      <div className="max-w-[78%] px-4 py-3 bg-white/90 text-brand-text rounded-2xl rounded-bl-sm border border-gray-100/60 shadow-sm flex items-center gap-2">
        <Bot size={12} className="text-brand-orange flex-shrink-0" />
        <span className="text-xs text-brand-muted font-medium">{agentName} is thinking</span>
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-orange/60 block"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Plan Message Bubble ───────────────────────────────────────
function PlanMessageBubble({ msg, agentName }) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    downloadMarkdown(msg.text, agentName);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex justify-start"
    >
      <div className="max-w-[88%] rounded-2xl rounded-bl-sm overflow-hidden shadow-md border border-orange-200/60">
        {/* Plan header */}
        <div className="bg-gradient-to-r from-brand-orange to-red-500 px-4 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-xs leading-tight">Personalized Fitness Plan</p>
            <p className="text-white/70 text-[10px] mt-0.5">Ready to download</p>
          </div>
          <Sparkles size={14} className="text-white/60 flex-shrink-0" />
        </div>

        {/* Plan preview */}
        <div className="bg-gradient-to-br from-orange-50/80 to-white px-4 py-3">
          <p className="text-xs text-brand-muted leading-relaxed line-clamp-3 font-medium">
            {msg.text.slice(0, 200).replace(/[#*`|]/g, "").trim()}…
          </p>
        </div>

        {/* Download button */}
        <div className="bg-white/80 px-4 py-3 border-t border-orange-100/60">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleDownload}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
              downloaded
                ? "bg-brand-green/10 text-brand-green border border-brand-green/30"
                : "bg-brand-orange text-white shadow-md shadow-brand-orange/30 hover:bg-orange-600"
            }`}
          >
            <Download size={15} />
            {downloaded ? "Downloaded! ✓" : "Download Fitness Plan (.md)"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Regular Message Bubble ────────────────────────────────────
function MessageBubble({ msg, isMe, isAI }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed break-words shadow-sm whitespace-pre-wrap ${
          isMe
            ? "bg-brand-text text-white rounded-2xl rounded-br-sm"
            : isAI
            ? "bg-gradient-to-br from-white to-orange-50/60 text-brand-text rounded-2xl rounded-bl-sm border border-orange-100/60"
            : "bg-white/90 text-brand-text rounded-2xl rounded-bl-sm border border-gray-100/60"
        }`}
      >
        {msg.text}
        {isMe && (
          <div className="flex justify-end mt-0.5">
            <SeenIndicator status="seen" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Time Separator ────────────────────────────────────────────
function TimeSeparator({ timestamp }) {
  return (
    <div className="flex justify-center my-3">
      <span className="text-[10px] text-brand-muted font-medium bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-100/60">
        {formatChatTime(timestamp)}
      </span>
    </div>
  );
}

// ── Generate Plan Hint Chip ───────────────────────────────────
function GeneratePlanHint({ onTap }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center my-2"
    >
      <button
        onClick={onTap}
        className="flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange text-xs font-black px-4 py-2 rounded-full border border-brand-orange/25 hover:bg-brand-orange/20 transition-colors cursor-pointer"
      >
        <FileText size={12} />
        Tap to generate your plan
      </button>
    </motion.div>
  );
}

// ── Main ChatScreen ───────────────────────────────────────────
export function ChatScreen() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const {
    conversations,
    messages,
    contacts,
    typingConversations,
    sendMessage,
    sendAIMessage,
    markRead,
  } = useMessaging();

  const [text, setText] = useState("");
  const [showPlanHint, setShowPlanHint] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const conversation = conversations.find((c) => c.id === conversationId);
  const contact = conversation ? contacts[conversation.participantId] : null;
  const chatMessages = messages[conversationId] || [];
  const isAIChat = contact?.isAI === true;
  const isTyping = typingConversations[conversationId] === true;

  // Show "generate plan" hint after 4+ messages in an AI chat
  useEffect(() => {
    if (isAIChat && chatMessages.length >= 5) {
      const hasPlan = chatMessages.some((m) => m.isPlan);
      setShowPlanHint(!hasPlan);
    }
  }, [chatMessages.length, isAIChat]);

  useEffect(() => {
    if (conversationId) markRead(conversationId);
  }, [conversationId, markRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length, isTyping]);

  const handleSend = useCallback(
    (overrideText) => {
      const trimmed = (overrideText ?? text).trim();
      if (!trimmed) return;
      setText("");
      inputRef.current?.focus();

      if (isAIChat && contact?.agentId) {
        sendAIMessage(conversationId, trimmed, contact.agentId, chatMessages);
        // Hide hint after user sends generate plan
        if (isPlanTrigger(trimmed)) setShowPlanHint(false);
      } else {
        sendMessage(conversationId, trimmed);
      }
    },
    [text, conversationId, sendMessage, sendAIMessage, isAIChat, contact, chatMessages]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-16 h-16 bg-white/60 rounded-3xl flex items-center justify-center border border-gray-100">
          <MessageSquare size={28} className="text-gray-300" />
        </div>
        <p className="text-brand-muted text-sm font-semibold">Conversation not found</p>
        <button
          onClick={() => navigate("/messages")}
          className="text-brand-orange font-black text-sm hover:underline cursor-pointer"
        >
          Back to Messages
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100/60 backdrop-blur-md flex-shrink-0 ${isAIChat ? "bg-gradient-to-r from-orange-50/80 to-white/80" : "bg-white/60"}`}>
        <button
          onClick={() => navigate("/messages")}
          className="p-2 -ml-2 rounded-xl text-brand-muted hover:text-brand-text hover:bg-white/60 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer lg:hidden"
          aria-label="Back to messages"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative flex-shrink-0">
          <div className={`w-10 h-10 rounded-xl overflow-hidden ring-2 ${isAIChat ? "ring-brand-orange/40" : "ring-white"} shadow-sm`}>
            <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isAIChat ? "bg-brand-green animate-pulse" : contact.status === "online" ? "bg-brand-green" : "hidden"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-black text-brand-text truncate leading-tight">{contact.name}</div>
            {isAIChat && (
              <span className="flex items-center gap-1 bg-brand-orange/10 text-brand-orange text-[9px] font-black px-2 py-0.5 rounded-full border border-brand-orange/20 flex-shrink-0">
                <Sparkles size={8} />
                AI
              </span>
            )}
          </div>
          <StatusIndicator status={contact.status} isAI={isAIChat} />
        </div>
      </div>

      {/* ── AI Info Banner ── */}
      {isAIChat && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-orange/5 to-transparent border-b border-orange-100/40">
          <Bot size={13} className="text-brand-orange flex-shrink-0" />
          <p className="text-[10px] text-brand-muted leading-tight">
            <span className="font-black text-brand-orange">{contact.name}</span> — Collecting your info to build a personalized plan. Say <span className="font-black text-brand-text">"generate plan"</span> when ready.
          </p>
        </div>
      )}

      {/* ── Messages Area ── */}
      <div className={`flex-1 overflow-y-auto px-4 py-4 ${isAIChat ? "bg-gradient-to-b from-orange-50/20 to-transparent" : ""}`}>
        <div className="space-y-1.5">
          {chatMessages.map((msg, idx) => {
            const isMe = msg.senderId === CURRENT_USER_ID;
            const showSeparator = shouldShowTimeSeparator(chatMessages[idx - 1], msg);
            return (
              <div key={msg.id}>
                {showSeparator && <TimeSeparator timestamp={msg.timestamp} />}
                {/* Plan bubble gets a special card treatment */}
                {msg.isPlan ? (
                  <PlanMessageBubble msg={msg} agentName={contact.name} />
                ) : (
                  <MessageBubble msg={msg} isMe={isMe} isAI={!isMe && isAIChat} />
                )}
              </div>
            );
          })}

          {/* AI Typing Indicator */}
          <AnimatePresence>
            {isTyping && <AITypingBubble agentName={contact.name} />}
          </AnimatePresence>

          {/* Generate plan hint chip — appears after enough context */}
          <AnimatePresence>
            {isAIChat && showPlanHint && !isTyping && (
              <GeneratePlanHint onTap={() => handleSend("generate plan")} />
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div className={`px-4 py-3 border-t flex-shrink-0 ${isAIChat ? "border-orange-100/60 bg-orange-50/30 backdrop-blur-md" : "border-gray-100/60 bg-white/60 backdrop-blur-md"}`}>
        <div className={`flex items-center gap-2 bg-white/80 rounded-2xl px-3 py-2 border focus-within:border-brand-orange/40 transition-colors shadow-sm ${isAIChat ? "border-orange-200/60" : "border-gray-100/80"}`}>
          <button
            className="p-1.5 text-brand-muted hover:text-brand-orange transition-colors flex-shrink-0 min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Emoji"
          >
            {isAIChat ? <Sparkles size={18} className="text-brand-orange/50" /> : <Smile size={20} />}
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder={isAIChat ? `Ask ${contact.name.split(" ")[0]}...` : "Message..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-brand-muted/60 text-brand-text min-w-0"
            aria-label="Type a message"
            disabled={isTyping}
          />

          <AnimatePresence mode="wait">
            {text.trim() ? (
              <motion.button
                key="send"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => handleSend()}
                disabled={isTyping}
                className="p-2 bg-brand-orange text-white rounded-xl transition-colors hover:bg-orange-600 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-md shadow-brand-orange/30 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={16} />
              </motion.button>
            ) : (
              !isAIChat && (
                <motion.button
                  key="image"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-brand-muted hover:text-brand-orange transition-colors flex-shrink-0 min-h-[44px] flex items-center justify-center cursor-pointer"
                  aria-label="Send image"
                >
                  <ImageIcon size={20} />
                </motion.button>
              )
            )}
          </AnimatePresence>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => {}}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
