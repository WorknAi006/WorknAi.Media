import React from "react";
import { CheckCircle2, FileEdit, Sparkles, Archive } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  featured?: boolean;
}

export default function StatusBadge({ status, featured }: StatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase() || "draft";

  const getBadgeStyle = () => {
    switch (normalizedStatus) {
      case "published":
        return {
          icon: CheckCircle2,
          text: "Published",
          color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        };
      case "draft":
        return {
          icon: FileEdit,
          text: "Draft",
          color: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        };
      case "archived":
        return {
          icon: Archive,
          text: "Archived",
          color: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
        };
      default:
        return {
          icon: CheckCircle2,
          text: status,
          color: "border-blue-500/30 bg-blue-500/10 text-blue-400",
        };
    }
  };

  const badge = getBadgeStyle();
  const Icon = badge.icon;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide backdrop-blur-md ${badge.color}`}
      >
        <Icon className="h-3 w-3" />
        <span>{badge.text}</span>
      </span>

      {featured && (
        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          <Sparkles className="h-2.5 w-2.5 text-cyan-300" />
          <span>Featured</span>
        </span>
      )}
    </div>
  );
}
