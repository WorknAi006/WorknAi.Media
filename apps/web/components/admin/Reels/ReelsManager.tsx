"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Filter, RefreshCw, X, Sparkles } from "lucide-react";
import ReelsForm from "./ReelsForm";
import ReelsTable from "./ReelsTable";
import { ReelPost } from "./types";

const SOCIAL_FILTER_OPTIONS = [
  { id: "all", label: "All Channels", icon: "🌐" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "youtube", label: "YouTube Shorts", icon: "▶️" },
  { id: "twitter", label: "X / Twitter", icon: "✖️" },
];

export default function ReelsManager() {
  const [reels, setReels] = useState<ReelPost[]>([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [editingReel, setEditingReel] = useState<ReelPost | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "scheduled" | "draft">("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

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

  const loadReels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/posts?type=reel`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      setReels(json.data || []);
      loadBrands();
    } catch (err) {
      console.error("Failed to load reels:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReel = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this reel?")) {
      return;
    }

    try {
      await fetch(`${apiBase}/posts/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      loadReels();
    } catch (err) {
      console.error("Failed to delete reel:", err);
    }
  };

  useEffect(() => {
    loadReels();
    loadBrands();
  }, []);

  // Dynamically compile all available brands from Brands & URLs (/api/clients) + reels
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

  const filteredReels = useMemo(() => {
    return reels.filter((r) => {
      // 1. Status Filter
      if (activeTab !== "all" && r.status !== activeTab) {
        return false;
      }
      // 2. Brand Filter
      if (selectedBrand !== "all") {
        if (!r.brand || r.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
      }
      // 3. Social Media Platform Filter
      if (selectedPlatform !== "all") {
        if (!r.platforms || !r.platforms.includes(selectedPlatform)) {
          return false;
        }
      }
      // 4. Search Filter
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
  }, [reels, activeTab, selectedBrand, selectedPlatform, searchQuery]);

  const hasActiveFilters =
    activeTab !== "all" ||
    selectedBrand !== "all" ||
    selectedPlatform !== "all" ||
    Boolean(searchQuery.trim());

  const resetFilters = () => {
    setActiveTab("all");
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
            WorknAI CMS
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Reels CMS
            <span className="text-sm font-normal text-zinc-400 bg-white/5 border border-white/10 px-3 py-0.5 rounded-full">
              {reels.length} total
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage, publish, and schedule short-form video reels across brands and social media channels.
          </p>
        </div>

        {/* Tab Filters (Status) */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {(["all", "published", "scheduled", "draft"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <ReelsForm
        editingReel={editingReel}
        onSave={() => {
          loadReels();
          setEditingReel(null);
        }}
        onCancel={() => setEditingReel(null)}
      />

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
              {activeTab === "all" ? "All Reels" : `${activeTab.toUpperCase()} Reels`}
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
          onEdit={setEditingReel}
          onDelete={deleteReel}
        />
      </div>
    </div>
  );
}
