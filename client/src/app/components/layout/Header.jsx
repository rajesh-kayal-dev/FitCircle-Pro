import React from "react";
import { Link } from "react-router";
import { MessageSquare, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "../Logo";
import { cn } from "../ui";
import { getUserAvatar } from "../../../utils/avatar";

export function Header({ user, totalUnread, dropdownOpen, setDropdownOpen, dropdownRef, ProfileDropdown }) {
  const avatarSrc = getUserAvatar(user);

  return (
    <header className="sticky top-0 w-full h-16 bg-white/85 backdrop-blur-lg border-b border-gray-100/80 flex items-center justify-between px-4 lg:px-6 z-40 shadow-sm shadow-gray-100/50">
      {/* mobile logo */}
      <div className="lg:hidden flex items-center">
        <Logo size="md" />
      </div>

      {/* right side */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Messages icon (Global) */}
        <Link
          to="/messages"
          className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
          aria-label={`Messages${totalUnread > 0 ? `, ${totalUnread} unread` : ""}`}
        >
          <MessageSquare className="w-5 h-5 text-brand-muted" />
          {totalUnread > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-brand-orange text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-white">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </Link>

        {/* Profile dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 cursor-pointer"
            aria-label="Profile menu"
            aria-expanded={dropdownOpen}
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-brand-orange/30 ring-offset-1 hover:ring-brand-orange/60 transition-all">
              <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <ChevronDown
              size={14}
              className={cn("text-brand-muted transition-transform hidden lg:block", dropdownOpen && "rotate-180")}
            />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <ProfileDropdown
                user={user}
                onClose={() => setDropdownOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
