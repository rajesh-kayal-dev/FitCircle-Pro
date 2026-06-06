/**
 * Format timestamp for conversation list preview (e.g. "2m", "3h", "Yesterday", "Mon")
 */
export function formatMessageTime(date) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

/**
 * Format timestamp for chat message grouping labels
 */
export function formatChatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (days === 0) return timeStr;
  if (days === 1) return `Yesterday ${timeStr}`;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })} ${timeStr}`;
}

/**
 * Determine if a time separator should be shown between two messages
 * Show separator if gap > 5 minutes or it's the first message
 */
export function shouldShowTimeSeparator(prevMsg, currMsg) {
  if (!prevMsg) return true;
  const prev = new Date(prevMsg.timestamp).getTime();
  const curr = new Date(currMsg.timestamp).getTime();
  return curr - prev > 5 * 60 * 1000;
}
