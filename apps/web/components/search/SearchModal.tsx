"use client";

import React, { useState, useEffect } from "react";
import { Search, X, ArrowRight, Sparkles, Wrench, Briefcase, GraduationCap, Film, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  sectionId: string;
}

const SEARCH_ITEMS: SearchResult[] = [
  {
    id: "home",
    title: "Hero & Ecosystem Intro",
    category: "Navigation",
    description: "Autonomous media infrastructure and brand universe.",
    icon: Sparkles,
    sectionId: "home",
  },
  {
    id: "caption-gen",
    title: "AI Caption Generator",
    category: "AI Tools",
    description: "Generate viral social media captions with smart hashtag optimization.",
    icon: Wrench,
    sectionId: "intelligence",
  },
  {
    id: "reel-script",
    title: "Reel Script Generator",
    category: "AI Tools",
    description: "Generate 30s-60s retention-optimized video scripts.",
    icon: Wrench,
    sectionId: "intelligence",
  },
  {
    id: "hashtag-gen",
    title: "Hashtag Generator",
    category: "AI Tools",
    description: "Niche and high-reach tag suggestions tailored for Instagram and YouTube.",
    icon: Wrench,
    sectionId: "intelligence",
  },
  {
    id: "thumbnail-ideas",
    title: "Thumbnail Ideas",
    category: "AI Tools",
    description: "AI-generated visual concepts for maximum click-through rates.",
    icon: Wrench,
    sectionId: "intelligence",
  },
  {
    id: "content-planner",
    title: "Content Planner",
    category: "AI Tools",
    description: "Automated content calendar and cross-platform scheduling assistant.",
    icon: Wrench,
    sectionId: "intelligence",
  },
  {
    id: "seo-writer",
    title: "SEO Blog Writer",
    category: "AI Tools",
    description: "Create long-form search optimized articles and executive blogs.",
    icon: Wrench,
    sectionId: "intelligence",
  },
  {
    id: "video-production",
    title: "AI Video Production",
    category: "Solutions",
    description: "Hyper-realistic vertical video engines and cinematic commercials.",
    icon: Briefcase,
    sectionId: "solutions",
  },
  {
    id: "social-management",
    title: "Social Media Management",
    category: "Solutions",
    description: "End-to-end multi-platform content scheduling and audience scaling.",
    icon: Briefcase,
    sectionId: "solutions",
  },
  {
    id: "ai-automation",
    title: "Web & AI Automation",
    category: "Solutions",
    description: "Autonomous CRM workflows, intelligent chatbots, and media APIs.",
    icon: Briefcase,
    sectionId: "solutions",
  },
  {
    id: "growth-strategy",
    title: "Brand Growth Strategy",
    category: "Solutions",
    description: "Data-driven audience funnels and creator growth architectures.",
    icon: Briefcase,
    sectionId: "solutions",
  },
  {
    id: "creator-academy",
    title: "Creator Academy",
    category: "Academy",
    description: "Master modern AI video creation, prompt engineering, and organic distribution.",
    icon: GraduationCap,
    sectionId: "academy",
  },
  {
    id: "portfolio-showcase",
    title: "Showcase & Portfolio",
    category: "Showcase",
    description: "Explore case studies across Travel, Logistics, Housing, and AI Reels.",
    icon: Briefcase,
    sectionId: "showcase",
  },
  {
    id: "reels-stories",
    title: "Creators & Vertical Reels",
    category: "Creators",
    description: "Watch viral 9:16 vertical micro-videos generated autonomously.",
    icon: Film,
    sectionId: "creators",
  },
  {
    id: "inquiry-form",
    title: "Let's Talk (Inquiry)",
    category: "Contact",
    description: "Send project directive, talk on WhatsApp, or request an AI media proposal.",
    icon: Phone,
    sectionId: "contact",
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (sectionId: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectSection }: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = query.trim() === ""
    ? SEARCH_ITEMS
    : SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-[#070b19] p-6 text-white shadow-[0_0_60px_rgba(59,130,246,0.3)] backdrop-blur-2xl"
          >
            {/* Input Header */}
            <div className="relative flex items-center border-b border-white/10 pb-4">
              <Search className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search AI Tools, Solutions, Portfolio, Academy, Sections..."
                className="w-full bg-transparent text-base text-white placeholder-zinc-500 focus:outline-none"
              />
              {query ? (
                <button
                  onClick={() => setQuery("")}
                  className="rounded-lg p-1 text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                  ESC
                </span>
              )}
            </div>

            {/* Results List */}
            <div className="mt-4 max-h-[380px] space-y-2 overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-500">
                  No matching services or tools found for &quot;{query}&quot;
                </div>
              ) : (
                filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectSection(item.sectionId);
                        onClose();
                      }}
                      className="group flex w-full items-center justify-between rounded-2xl border border-transparent p-3 text-left transition hover:border-blue-500/40 hover:bg-blue-500/10"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-400 group-hover:border-blue-500/30 group-hover:bg-blue-500/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white group-hover:text-blue-200">
                              {item.title}
                            </span>
                            <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-400 font-medium">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-zinc-500">
              <span>Navigate through all ecosystem sections</span>
              <span className="font-mono">WorknAI Media Search OS</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
