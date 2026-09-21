"use client";

import React from "react";
import Link from "next/link";
import { ReelFilterStatus } from "./useReels";

interface Props {
  basePath?: string; // e.g. "/admin/reels" or "/dashboard/reels"
  currentStatus: ReelFilterStatus;
  counts?: Record<string, number>;
}

const TABS: { id: ReelFilterStatus; label: string; subpath: string }[] = [
  { id: "all", label: "All", subpath: "" },
  { id: "published", label: "Published", subpath: "/published" },
  { id: "scheduled", label: "Scheduled", subpath: "/scheduled" },
  { id: "draft", label: "Draft", subpath: "/draft" },
];

export default function ReelsStatusTabs({
  basePath = "/admin/reels",
  currentStatus = "all",
  counts,
}: Props) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
      {TABS.map((tab) => {
        const isActive = currentStatus === tab.id;
        const href = `${basePath}${tab.subpath}`;
        const count = counts?.[tab.id];

        return (
          <Link
            key={tab.id}
            href={href}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)] border border-blue-500/50"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{tab.label}</span>
            {typeof count === "number" && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  isActive ? "bg-white/20 text-white" : "bg-white/10 text-zinc-400"
                }`}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
