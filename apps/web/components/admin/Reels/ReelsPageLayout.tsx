import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, RefreshCw, X, Sparkles, Plus } from "lucide-react";
import ReelsForm from "./ReelsForm";
import ReelsTable from "./ReelsTable";
import ReelsStatusTabs from "./ReelsStatusTabs";
import { useReels, ReelFilterStatus } from "./useReels";
import { ReelPost } from "./types";

const SOCIAL_FILTER_OPTIONS = [
  { id: "all", label: "All Channels", icon: "🌐" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "youtube", label: "YouTube Shorts", icon: "▶️" },
  { id: "twitter", label: "X / Twitter", icon: "✖️" },
];

interface Props {
  basePath?: string; // "/admin/reels" | "/dashboard/reels"
  status?: ReelFilterStatus; // "all" | "published" | "scheduled" | "draft"
}

export default function ReelsPageLayout({
  basePath = "/admin/reels",
  status = "all",
}: Props) {
  // Use status-specific backend query hook
  const { reels, isLoading, loadReels, deleteReel } = useReels(status);

  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [editingReel, setEditingReel] = useState<ReelPost | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [counts, setCounts] = useState<Record<string, number>>({
    all: 0,
    published: 0,
    scheduled: 0,
    draft: 0,
  });

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const loadCounts = async () => {
    try {
      const res = await fetch(`${apiBase}/posts?type=reel`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCounts({
          all: json.data.length,
          published: json.data.filter((r: any) => r.status === "published").length,
          scheduled: json.data.filter((r: any) => r.status === "scheduled").length,
          draft: json.data.filter((r: any) => r.status === "draft").length,
        });
      }
    } catch {}
  };

  useEffect(() => {
    loadCounts();
  }, [reels]);

  // Load brands from clients table for the brand filter
  const loadBrands = async () => {
    try {
      const res = await fetch(`${apiBase}/clients`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBrands(json.data);
      }
    } catch (err) {
      console.error("Failed to load brands:", err);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // Dynamically compile available brands
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    brands.forEach((b) => {
      if (b.name) set.add(b.name.trim());
    });
    reels.forEach((r) => {
      if (r.brand) set.add(r.brand.trim());
    });
    ["WorknAI", "Loveza", "Car Hub", "Online Go", "GoLogix", "PG Info"].forEach((b) => set.add(b));
    return Array.from(set);
  }, [brands, reels]);

  // Client-side brand, channel, and search filtering
  const filteredReels = useMemo(() => {
    return reels.filter((r) => {
      // 1. Brand Filter
      if (selectedBrand !== "all") {
        if (!r.brand || r.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
      }
      // 2. Social Media Platform Filter
      if (selectedPlatform !== "all") {
        if (!r.platforms || !r.platforms.includes(selectedPlatform)) {
          return false;
        }
      }
      // 3. Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title?.toLowerCase().includes(q);
        const matchBrand = r.brand?.toLowerCase().includes(q);
        const matchContent = r.content?.toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchContent) {
          return false;
        }
      }
      return true;
    });
  }, [reels, selectedBrand, selectedPlatform, searchQuery]);

  const hasActiveFilters =
    selectedBrand !== "all" ||
    selectedPlatform !== "all" ||
    Boolean(searchQuery.trim());

  const resetFilters = () => {
    setSelectedBrand("all");
    setSelectedPlatform("all");
    setSearchQuery("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WorknAI CMS</span>
            {status !== "all" && (
              <span className="rounded-full bg-blue-400/20 px-2 py-0.5 text-[10px] text-blue-300 capitalize font-mono">
                {status} Only
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Reels CMS</span>
            <span className="text-sm font-normal text-zinc-400 bg-white/5 border border-white/10 px-3 py-0.5 rounded-full">
              {reels.length} {status === "all" ? "total" : status}
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage, publish, and schedule short-form video reels across brands and social media channels.
          </p>
        </div>

        {/* Dedicated Navigation Tabs & Create Button */}
        <div className="flex flex-wrap items-center gap-3">
          <ReelsStatusTabs
            basePath={basePath}
            currentStatus={status}
            counts={counts}
          />
          <button
            type="button"
            onClick={() => {
              if (showCreateForm || editingReel) {
                setShowCreateForm(false);
                setEditingReel(null);
              } else {
                setShowCreateForm(true);
              }
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-lg ${
              showCreateForm || editingReel
                ? "bg-zinc-800 text-zinc-300 border border-white/15 hover:bg-zinc-700"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:brightness-110 border border-blue-400/30"
            }`}
          >
            {showCreateForm || editingReel ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create New Reel</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conditionally Render Form Section */}
      {(showCreateForm || editingReel) && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-200">
          <ReelsForm
            editingReel={editingReel}
            onSave={() => {
              loadReels();
              setEditingReel(null);
              setShowCreateForm(false);
            }}
            onCancel={() => {
              setEditingReel(null);
              setShowCreateForm(false);
            }}
          />
        </div>
      )}

      {/* Interactive Filters Bar */}
      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search reels by title, brand, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Dynamic Brand Dropdown Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">
              🏢 Brand:
            </span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-medium text-white focus:border-blue-500 focus:outline-none transition min-w-[160px]"
            >
              <option value="all">All Brands ({reels.length})</option>
              {availableBrands.map((brandName) => {
                const count = reels.filter((r) => r.brand?.toLowerCase() === brandName.toLowerCase()).length;
                return (
                  <option key={brandName} value={brandName}>
                    {brandName} {count > 0 ? `(${count})` : ""}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-xs text-red-300 font-medium transition"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        {/* Social Media Channels Filter Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto scrollbar-none">
          <span className="text-xs font-medium text-zinc-400 whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3 h-3 text-blue-400" /> Channel:
          </span>
          <div className="flex items-center gap-1.5">
            {SOCIAL_FILTER_OPTIONS.map((opt) => {
              const isActive = selectedPlatform === opt.id;
              const count =
                opt.id === "all"
                  ? reels.length
                  : reels.filter((r) => r.platforms?.includes(opt.id)).length;

              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPlatform(opt.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-blue-600/30 border border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                      : "bg-black/30 hover:bg-white/5 border border-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                  {count > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isActive
                          ? "bg-blue-500/30 text-blue-200"
                          : "bg-white/10 text-zinc-400"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>
              {status === "all" ? "All Reels" : `${status.toUpperCase()} Reels`}
            </span>
            <span className="text-xs font-normal text-zinc-500">
              ({filteredReels.length} matching)
            </span>
            {selectedBrand !== "all" && (
              <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-md">
                Brand: {selectedBrand}
              </span>
            )}
            {selectedPlatform !== "all" && (
              <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-md">
                Channel: {selectedPlatform}
              </span>
            )}
          </h2>
          {isLoading && (
            <span className="text-xs text-blue-400 animate-pulse flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> Refreshing...
            </span>
          )}
        </div>

        <ReelsTable
          reels={filteredReels}
          onEdit={(reel) => {
            setEditingReel(reel);
            setShowCreateForm(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onDelete={deleteReel}
          status={status}
          createHref={basePath}
          onOpenCreate={() => {
            setShowCreateForm(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
