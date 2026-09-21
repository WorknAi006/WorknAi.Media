"use client";

import { PostStatus, PostType } from "./types";

type Props = {
  status: PostStatus;
  type?: PostType;
};

export default function StatusBadge({ status, type }: Props) {
  const getBadgeStyle = () => {
    switch (status) {
      case "published":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          dot: "bg-emerald-400 animate-pulse",
          label: "Published",
        };
      case "scheduled":
        return {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
          dot: "bg-blue-400 shadow-[0_0_8px_#3b82f6]",
          label: "Scheduled",
        };
      case "draft":
      default:
        return {
          bg: "bg-zinc-500/10 border-zinc-500/30 text-zinc-400",
          dot: "bg-zinc-400",
          label: "Draft",
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <div className="inline-flex items-center gap-2">
      {type && (
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            type === "reel"
              ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
              : "bg-sky-500/10 text-sky-400 border border-sky-500/30"
          }`}
        >
          {type === "reel" ? "🎬 Reel" : "📝 Blog"}
        </span>
      )}
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.bg}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
        {badge.label}
      </span>
    </div>
  );
}
