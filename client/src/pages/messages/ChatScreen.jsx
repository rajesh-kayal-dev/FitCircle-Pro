import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Send, Smile, ImageIcon, MessageSquare, Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMessaging } from "../../context/MessagingContext";
import { CURRENT_USER_ID } from "../../api/mockMessages";
import { formatChatTime, shouldShowTimeSeparator } from "./utils";

function StatusIndicator({ status }) {
  const colors = {
    online: "text-brand-green",
    away: "text-brand-amber",
    offline: "text-brand-muted",
  };
  const labels = { online: "Online", away: "Away", offline: "Offline" };

  return (
    <span className={`text-[10px] font-bold flex items-center gap-1 ${colors[status] || colors.offline}`}>
      {status === "online" && (
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green inline-block" />
      )}
      {labels[status] || "Offline"}
    </span>
  );
}

function SeenIndicator({ status }) {
  // status: "sending" | "sent" | "delivered" | "seen"
  if (!status) return null;
  return (
    <span className="ml-1 inline-flex items-center" aria-label={`Message ${status}`}>
      {status === "sending" && (
        <Check size={11} className="text-gray-300" />
      )}
      {status === "sent" && (
        <Check size={11} className="text-gray-400" />
      )}
      {status === "delivered" && (
        <CheckCheck size={11} className="text-gray-400" />
      )}
      {status === "seen" && (
        <CheckCheck size={11} className="text-brand-cyan" />
      )}
    </span>
  );
}

function MessageBubble({ msg, isMe }) {
  // Simulate delivery status based on message age
  const status = isMe
    ? msg.seenStatus || (msg.id?.includes("sent") ? "sent" : "seen")
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed break-words shadow-sm ${isMe
            ? "bg-brand-text text-white rounded-2xl rounded-br-sm"
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

function TimeSeparator({ timestamp }) {
  return (
    <div className="flex justify-center my-3">
      <span className="text-[10px] text-brand-muted font-medium bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-100/60">
        {formatChatTime(timestamp)}
      </span>
    </div>
  );
}

export function ChatScreen() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { conversations, messages, contacts, sendMessage, markRead } = useMessaging();

  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const conversation = conversations.find((c) => c.id === conversationId);
  const contact = conversation ? contacts[conversation.participantId] : null;
  const chatMessages = messages[conversationId] || [];

  useEffect(() => {
    if (conversationId) markRead(conversationId);
  }, [conversationId, markRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(conversationId, trimmed);
    setText("");
    inputRef.current?.focus();
  }, [text, conversationId, sendMessage]);

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
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100/60 bg-white/60 backdrop-blur-md flex-shrink-0">
        <button
          onClick={() => navigate("/messages")}
          className="p-2 -ml-2 rounded-xl text-brand-muted hover:text-brand-text hover:bg-white/60 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer lg:hidden"
          aria-label="Back to messages"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white shadow-sm">
            <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
          </div>
          {contact.status === "online" && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-green rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-black text-brand-text truncate leading-tight">{contact.name}</div>
          <StatusIndicator status={contact.status} />
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-1.5">
          {chatMessages.map((msg, idx) => {
            const isMe = msg.senderId === CURRENT_USER_ID;
            const showSeparator = shouldShowTimeSeparator(chatMessages[idx - 1], msg);
            return (
              <div key={msg.id}>
                {showSeparator && <TimeSeparator timestamp={msg.timestamp} />}
                <MessageBubble msg={msg} isMe={isMe} />
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div className="px-4 py-3 border-t border-gray-100/60 bg-white/60 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-2 bg-white/80 rounded-2xl px-3 py-2 border border-gray-100/80 focus-within:border-brand-orange/40 transition-colors shadow-sm">
          <button
            className="p-1.5 text-brand-muted hover:text-brand-orange transition-colors flex-shrink-0 min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Emoji"
          >
            <Smile size={20} />
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-brand-muted/60 text-brand-text min-w-0"
            aria-label="Type a message"
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
                onClick={handleSend}
                className="p-2 bg-brand-orange text-white rounded-xl transition-colors hover:bg-orange-600 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-md shadow-brand-orange/30"
                aria-label="Send message"
              >
                <Send size={16} />
              </motion.button>
            ) : (
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
            )}
          </AnimatePresence>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => { }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
