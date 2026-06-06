import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ImagePlus, Video, Tag, Send, BookmarkPlus, Smile, Trash2, Play } from "lucide-react";
import { cn } from "../ui";
import { toast } from "sonner";

const EMOJI_LIST = ["💪", "", "🏋️", "😤", "🚀", "", "🎯", "💯", "🏃", "🧘"];
const SUGGESTED_TAGS = ["#fitness", "#workout", "#gains", "#motivation", "#health", "#gym", "#yoga", "#cardio", "#nutrition", "#transformation"];

export function CreatePostModal({ open, onClose, onPost }) {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // "image" | "video"
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const resetForm = useCallback(() => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setCaption("");
    setTags([]);
    setTagInput("");
    setShowEmojis(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleFile = useCallback((file) => {
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast.error("Please upload an image or video file.");
      return;
    }
    setMediaFile(file);
    setMediaType(isVideo ? "video" : "image");
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const addTag = useCallback((tag) => {
    const formatted = tag.startsWith("#") ? tag : `#${tag}`;
    if (!tags.includes(formatted) && tags.length < 10) {
      setTags((prev) => [...prev, formatted]);
    }
    setTagInput("");
  }, [tags]);

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const insertEmoji = (emoji) => {
    setCaption((prev) => prev + emoji);
    setShowEmojis(false);
  };

  const handleSubmit = (isDraft = false) => {
    if (!mediaPreview && !caption.trim()) {
      toast.error("Add a photo, video or caption.");
      return;
    }
    const post = { id: Date.now(), mediaPreview, mediaType, caption, tags, isDraft };
    onPost?.(post);
    toast.success(isDraft ? "Saved as draft!" : "Post published! 🎉");
    handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed inset-0 lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-[90] flex flex-col bg-white lg:rounded-3xl overflow-hidden shadow-2xl shadow-black/20 lg:w-[560px] lg:max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-base font-black text-brand-text">Create Post</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {/* Media Upload Zone */}
              {!mediaPreview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "mx-5 mt-5 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 py-12 transition-colors cursor-pointer group",
                    isDragging
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-gray-200 hover:border-brand-orange/50 hover:bg-gray-50"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                      <ImagePlus size={22} className="text-brand-orange" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center group-hover:bg-brand-purple/20 transition-colors">
                      <Video size={22} className="text-brand-purple" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-brand-text">Drop photo or video here</p>
                    <p className="text-xs text-brand-muted font-medium mt-1">or click to browse from your device</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="relative mx-5 mt-5 rounded-2xl overflow-hidden bg-black">
                  {mediaType === "video" ? (
                    <video
                      src={mediaPreview}
                      className="w-full max-h-72 object-contain"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full max-h-72 object-contain"
                    />
                  )}
                  <button
                    onClick={() => { setMediaFile(null); setMediaPreview(null); setMediaType(null); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
                    aria-label="Remove media"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-2 left-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
                    aria-label="Change media"
                  >
                    <ImagePlus size={14} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* Caption */}
              <div className="px-5 pt-4">
                <div className="relative bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-brand-orange/50 transition-colors">
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption... share your fitness story 💪"
                    rows={3}
                    maxLength={500}
                    className="w-full bg-transparent resize-none outline-none text-sm text-brand-text font-medium placeholder:text-brand-muted/60 p-4 pb-10"
                  />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEmojis((v) => !v)}
                        className="p-1 rounded-lg hover:bg-gray-100 text-brand-muted hover:text-brand-orange transition-colors cursor-pointer"
                        aria-label="Emoji picker"
                      >
                        <Smile size={16} />
                      </button>
                      <AnimatePresence>
                        {showEmojis && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            className="absolute bottom-8 left-0 bg-white border border-gray-200 rounded-2xl p-2 shadow-xl z-10 grid grid-cols-5 gap-1"
                          >
                            {EMOJI_LIST.map((em) => (
                              <button
                                key={em}
                                onClick={() => insertEmoji(em)}
                                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                              >
                                {em}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="text-[10px] text-brand-muted font-medium">{caption.length}/500</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="px-5 pt-3 pb-2">
                <div className="flex items-center gap-2 flex-wrap bg-gray-50 rounded-2xl border border-gray-100 px-3 py-2.5 focus-within:border-brand-orange/50 transition-colors">
                  <Tag size={14} className="text-brand-muted flex-shrink-0" />
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2.5 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-xs font-bold"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-brand-red transition-colors cursor-pointer"
                        aria-label={`Remove ${tag}`}
                      >
                        <X size={10} strokeWidth={3} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={tags.length === 0 ? "Add tags (e.g. #fitness)..." : ""}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-xs font-medium text-brand-text placeholder:text-brand-muted/60"
                  />
                </div>
                {/* Suggested tags */}
                <div className="flex gap-1.5 flex-wrap mt-2">
                  {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).slice(0, 6).map((t) => (
                    <button
                      key={t}
                      onClick={() => addTag(t)}
                      className="px-2.5 py-1 bg-white border border-gray-200 text-brand-muted rounded-full text-[10px] font-bold hover:border-brand-orange/50 hover:text-brand-orange transition-colors cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
              <button
                onClick={() => handleSubmit(true)}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-2xl border-2 border-gray-200 text-brand-muted hover:border-brand-orange/30 hover:text-brand-orange font-black text-sm transition-all cursor-pointer"
              >
                <BookmarkPlus size={16} />
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-2xl bg-brand-orange text-white font-black text-sm hover:bg-orange-600 transition-all shadow-lg shadow-brand-orange/30 cursor-pointer"
              >
                <Send size={16} />
                Post Now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
