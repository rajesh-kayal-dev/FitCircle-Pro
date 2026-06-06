import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Send, Smile, ImageIcon, Users, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMessaging } from "../../context/MessagingContext";
import { CURRENT_USER_ID, CURRENT_USER } from "../../api/mockMessages";
import { formatChatTime, shouldShowTimeSeparator } from "./utils";

function TimeSeparator({ timestamp }) {
  return (
    <div className="flex justify-center my-3">
      <span className="text-[10px] text-brand-muted font-medium bg-gray-50 px-3 py-1 rounded-full">
        {formatChatTime(timestamp)}
      </span>
    </div>
  );
}

function GroupMessageBubble({ msg, isMe, showSender }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Sender avatar (only for received messages) */}
      {!isMe && (
        <div className="flex-shrink-0 self-end mb-0.5">
          {showSender ? (
            <div className="w-7 h-7 rounded-lg overflow-hidden">
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-7" />
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
        {/* Sender name (only for received, only when first in sequence) */}
        {!isMe && showSender && (
          <span className="text-[10px] font-black text-brand-muted ml-1 mb-1 uppercase tracking-wide">
            {msg.senderName}
          </span>
        )}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed break-words ${isMe
              ? "bg-brand-text text-white rounded-2xl rounded-br-sm"
              : "bg-gray-100 text-brand-text rounded-2xl rounded-bl-sm"
            }`}
        >
          {msg.text}
        </div>
      </div>
    </motion.div>
  );
}

export function GroupChatScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { groups, groupMessages, sendGroupMessage, markGroupRead } = useMessaging();

  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const group = groups.find((g) => g.id === groupId);
  const chatMessages = groupMessages[groupId] || [];

  useEffect(() => {
    if (groupId) markGroupRead(groupId);
  }, [groupId, markGroupRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendGroupMessage(groupId, trimmed, "You", CURRENT_USER.avatar);
    setText("");
    inputRef.current?.focus();
  }, [text, groupId, sendGroupMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center">
          <MessageSquare size={28} className="text-gray-300" />
        </div>
        <p className="text-brand-muted text-sm font-semibold">Group not found</p>
        <button
          onClick={() => navigate("/messages")}
          className="text-brand-orange font-black text-sm hover:underline"
        >
          Back to Messages
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white/95 backdrop-blur-md flex-shrink-0">
        <button
          onClick={() => navigate("/messages")}
          className="p-2 -ml-2 rounded-xl text-brand-muted hover:text-brand-text hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center lg:hidden"
          aria-label="Back to messages"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Group avatar */}
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${group.gradient} flex items-center justify-center text-xl flex-shrink-0`}
        >
          {group.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-black text-brand-text truncate leading-tight">
            {group.name}
          </div>
          <div className="flex items-center gap-1">
            <Users size={10} className="text-brand-muted" />
            <span className="text-[10px] font-bold text-brand-muted">
              {group.memberCount} members
            </span>
          </div>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          {chatMessages.map((msg, idx) => {
            const isMe = msg.senderId === CURRENT_USER_ID;
            const showSeparator = shouldShowTimeSeparator(chatMessages[idx - 1], msg);
            const prevMsg = chatMessages[idx - 1];
            const showSender = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);

            return (
              <div key={msg.id}>
                {showSeparator && <TimeSeparator timestamp={msg.timestamp} />}
                <GroupMessageBubble msg={msg} isMe={isMe} showSender={showSender} />
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2 border border-gray-100 focus-within:border-brand-orange/40 transition-colors">
          <button
            className="p-1.5 text-brand-muted hover:text-brand-orange transition-colors flex-shrink-0 min-h-[44px] flex items-center justify-center"
            aria-label="Emoji"
          >
            <Smile size={20} />
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Message group..."
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
                className="p-2 bg-brand-orange text-white rounded-xl transition-colors hover:bg-orange-600 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                className="p-1.5 text-brand-muted hover:text-brand-orange transition-colors flex-shrink-0 min-h-[44px] flex items-center justify-center"
                aria-label="Send image"
              >
                <ImageIcon size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
