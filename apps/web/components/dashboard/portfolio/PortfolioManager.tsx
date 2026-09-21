"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Search,
  RefreshCw,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import StatsCards from "./StatsCards";
import CategoryFilter from "./CategoryFilter";
import FeaturedPreview, { FeaturedProject } from "./FeaturedPreview";
import PortfolioTable from "./PortfolioTable";
import PortfolioForm from "./PortfolioForm";

export default function PortfolioManager() {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<FeaturedProject | null>(null);
  const [previewProject, setPreviewProject] = useState<FeaturedProject | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (hasBody = false): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (hasBody) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // Fetch all portfolio projects from Express + Supabase API
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/portfolio`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data);

        // Pick top featured project for spotlight preview
        const featured = json.data.find((p: any) => p.featured) || json.data[0] || null;
        setPreviewProject(featured);
      }
    } catch (err: any) {
      console.error("Error fetching portfolio:", err);
      showToast("Error connecting to portfolio service");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Save (Create or Update) Project
  const handleSaveProject = async (
    data: Partial<FeaturedProject>
  ): Promise<boolean> => {
    try {
      if (editingProject) {
        // UPDATE
        const res = await fetch(`${apiBase}/portfolio/${editingProject.id}`, {
          method: "PUT",
          headers: getHeaders(true),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Project "${data.project_title}" updated successfully ✅`);
          fetchProjects();
          return true;
        } else {
          showToast(json.error || "Failed to update project");
          return false;
        }
      } else {
        // CREATE
        const res = await fetch(`${apiBase}/portfolio`, {
          method: "POST",
          headers: getHeaders(true),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Project "${data.project_title}" published successfully ✅`);
          fetchProjects();
          return true;
        } else {
          showToast(json.error || "Failed to create project");
          return false;
        }
      }
    } catch (err: any) {
      showToast("Operation failed: " + err.message);
      return false;
    }
  };

  // Delete Project
  const handleDeleteProject = async (project: FeaturedProject) => {
    if (!window.confirm(`Delete case study "${project.project_title}"?`)) return;

    try {
      const res = await fetch(`${apiBase}/portfolio/${project.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Project "${project.project_title}" deleted 🗑️`);
        fetchProjects();
      } else {
        showToast(json.error || "Failed to delete project");
      }
    } catch (err: any) {
      showToast("Delete failed: " + err.message);
    }
  };

  // Categories list
  const categories = [
    "All",
    "Travel",
    "Logistics",
    "Housing",
    "AI Videos",
    "Branding",
    "Web Apps",
  ];

  // Category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach((p) => {
      const cat = p.category?.toLowerCase();
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "All" ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [projects, searchQuery, selectedCategory]);

  // Statistics calculation
  const stats = useMemo(() => {
    const clientsSet = new Set(projects.map((p) => p.client_name.toLowerCase()));
    return {
      totalProjects: projects.length,
      totalClients: clientsSet.size,
      publishedProjects: projects.filter((p) => p.status === "published").length,
      draftProjects: projects.filter((p) => p.status === "draft").length,
    };
  }, [projects]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-cyan-500/40 bg-[#0B1020]/95 px-5 py-3 text-xs font-semibold text-white shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
          >
            <Check className="h-4 w-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Hero Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 mb-2.5 backdrop-blur-md">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Portfolio CMS & Agency OS</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Projects & Case Studies
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Orchestrate client brand deliverables, high-converting video reels, campaign case studies, and performance ROI metrics.
          </p>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search projects or clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={fetchProjects}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 backdrop-blur-md hover:bg-white/10 hover:text-white transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingProject(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* 2. Statistics Cards */}
      <StatsCards stats={stats} />

      {/* 3. Category Filter */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Filter by Industry
        </span>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
        />
      </div>

      {/* 4. Featured Spotlight Preview Panel */}
      {previewProject && (
        <FeaturedPreview
          project={previewProject}
          onEdit={(p) => {
            setEditingProject(p);
            setIsFormOpen(true);
          }}
        />
      )}

      {/* 5. Portfolio Table & Empty State */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-wide">
            Deliverables Directory
          </h3>
          <span className="text-xs text-zinc-500 font-mono">
            Showing {filteredProjects.length} of {projects.length} deliverables
          </span>
        </div>

        <PortfolioTable
          projects={filteredProjects}
          isLoading={isLoading}
          onEdit={(p) => {
            setEditingProject(p);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteProject}
          onPreview={(p) => setPreviewProject(p)}
          onAddNew={() => {
            setEditingProject(null);
            setIsFormOpen(true);
          }}
        />
      </div>

      {/* 6. Add / Edit Project Modal Form */}
      <PortfolioForm
        isOpen={isFormOpen}
        project={editingProject}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
      />
    </div>
  );
}
