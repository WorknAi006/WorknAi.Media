"use client";

import { useEffect, useState } from "react";
import HeroForm from "./HeroForm";
import HeroTable from "./HeroTable";

export type Hero = {
  id: number;
  title: string;
  subtitle: string;
  image_url: string | null;
  video_url?: string | null;
  button_text: string;
};

export default function HeroManager() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [activeTab, setActiveTab] = useState<"main" | "universe" | "new">("main");

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const loadHeroes = async () => {
    try {
      const res = await fetch(`${apiBase}/hero`);
      const json = await res.json();
      const list = json.data || [];
      setHeroes(list);

      // Auto select current active section
      if (activeTab === "main") {
        const main = list.find((h: Hero) => !h.title.toLowerCase().includes("universe")) || list[0] || null;
        setEditingHero(main);
      } else if (activeTab === "universe") {
        const uni = list.find((h: Hero) => h.title.toLowerCase().includes("universe")) || null;
        setEditingHero(uni);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteHero = async (id: number) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    await fetch(`${apiBase}/hero/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    loadHeroes();
  };

  useEffect(() => {
    loadHeroes();
  }, []);

  const handleSelectTab = (tab: "main" | "universe" | "new") => {
    setActiveTab(tab);
    if (tab === "main") {
      const main = heroes.find((h) => !h.title.toLowerCase().includes("universe")) || heroes[0] || null;
      setEditingHero(main);
    } else if (tab === "universe") {
      const uni = heroes.find((h) => h.title.toLowerCase().includes("universe")) || null;
      setEditingHero(uni);
    } else {
      setEditingHero(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Hero & Landing Sections CMS</h1>
        <p className="text-sm text-zinc-400">
          Manage Hero Main Banner and the Explore Our Universe background video & content independently.
        </p>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => handleSelectTab("main")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-md ${
            activeTab === "main"
              ? "border border-blue-500/50 bg-blue-600 text-white shadow-blue-500/30"
              : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span>🌟 Hero Main Banner</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab("universe")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-md ${
            activeTab === "universe"
              ? "border border-cyan-500/50 bg-cyan-600 text-white shadow-cyan-500/30"
              : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span>🌌 Explore Our Universe Section</span>
          <span className="rounded-full bg-cyan-400/30 px-2 py-0.5 text-[10px] text-cyan-200">Video Managed Here</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab("new")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeTab === "new"
              ? "border border-emerald-500/50 bg-emerald-600 text-white"
              : "border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
          }`}
        >
          <span>➕ Add Custom Section</span>
        </button>
      </div>

      <HeroForm
        editingHero={editingHero}
        onSave={() => {
          loadHeroes();
        }}
        onCancel={() => {
          if (activeTab === "new") handleSelectTab("main");
        }}
      />

      <div className="pt-4">
        <h3 className="text-sm font-bold text-zinc-300 mb-3">All Active Landing Sections ({heroes.length})</h3>
        <HeroTable
          heroes={heroes}
          onEdit={(h) => {
            setEditingHero(h);
            if (h.title.toLowerCase().includes("universe")) {
              setActiveTab("universe");
            } else {
              setActiveTab("main");
            }
          }}
          onDelete={deleteHero}
        />
      </div>
    </div>
  );
}