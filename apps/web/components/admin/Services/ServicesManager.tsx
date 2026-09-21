"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Plus,
  Search,
  RefreshCw,
  Check,
  AlertCircle,
} from "lucide-react";
import CategoryFilter from "@/components/dashboard/portfolio/CategoryFilter";
import ServicesStats from "./ServicesStats";
import ServicesTable from "./ServicesTable";
import ServicesForm from "./ServicesForm";
import { ServiceItem } from "./types";
import { getApiBase, getAuthHeaders } from "@/app/lib/api";

export default function ServicesManager() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const apiBase = getApiBase();

  // Fetch all services from Express + Supabase API
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/services`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setServices(json.data);
      } else {
        // If error message or empty, fallback gracefully
        if (json.error) {
          console.warn("API Note:", json.error);
        }
      }
    } catch (err: any) {
      console.error("Error fetching services:", err);
      showToast("Could not connect to services API");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Save (Create or Update) Service
  const handleSaveService = async (
    data: Partial<ServiceItem>
  ): Promise<boolean> => {
    try {
      if (editingService) {
        // UPDATE
        const res = await fetch(`${apiBase}/services/${editingService.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Service "${data.title}" updated successfully ✅`);
          fetchServices();
          return true;
        } else {
          showToast(json.error || "Failed to update service");
          return false;
        }
      } else {
        // CREATE
        const res = await fetch(`${apiBase}/services`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Service "${data.title}" created successfully ✅`);
          fetchServices();
          return true;
        } else {
          showToast(json.error || "Failed to create service");
          return false;
        }
      }
    } catch (err: any) {
      showToast("Operation failed: " + err.message);
      return false;
    }
  };

  // Delete Service
  const handleDeleteService = async (service: ServiceItem) => {
    if (!window.confirm(`Are you sure you want to delete "${service.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiBase}/services/${service.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Service "${service.title}" deleted 🗑️`);
        fetchServices();
      } else {
        showToast(json.error || "Failed to delete service");
      }
    } catch (err: any) {
      showToast("Delete failed: " + err.message);
    }
  };

  // Categories list
  const categories = [
    "All",
    "AI Production",
    "Social Media Automation",
    "Full-Stack AI",
    "Brand Strategy",
    "Creative Direction",
    "Workflow Automation",
  ];

  // Category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: services.length };
    services.forEach((s) => {
      const cat = s.category?.toLowerCase();
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [services]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.short_description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.category || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory.toLowerCase() === "all" ||
        (s.category && s.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  // Statistics
  const stats = useMemo(() => {
    const totalServices = services.length;
    const publishedServices = services.filter((s) => s.status === "published").length;
    const draftServices = services.filter((s) => s.status === "draft").length;
    const featuredServices = services.filter((s) => s.featured).length;

    return {
      totalServices,
      publishedServices,
      draftServices,
      featuredServices,
    };
  }, [services]);

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

      {/* 1. Header Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 mb-2.5 backdrop-blur-md">
            <Layers className="h-3.5 w-3.5" />
            <span>Services CMS & Agency Solutions OS</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Agency Services & Solutions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Create, manage, and prioritize agency deliverables displayed on the WorknAI Media website with live real-time sync.
          </p>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search services or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={fetchServices}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 backdrop-blur-md hover:bg-white/10 hover:text-white transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingService(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* 2. Statistics Cards */}
      <ServicesStats stats={stats} />

      {/* 3. Category Filter */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Filter by Solution Category
        </span>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
        />
      </div>

      {/* 4. Services Table & Empty State */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-wide">
            Catalogue Directory
          </h3>
          <span className="text-xs text-zinc-500 font-mono">
            Showing {filteredServices.length} of {services.length} services
          </span>
        </div>

        <ServicesTable
          services={filteredServices}
          isLoading={isLoading}
          onEdit={(service) => {
            setEditingService(service);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteService}
          onAddNew={() => {
            setEditingService(null);
            setIsFormOpen(true);
          }}
        />
      </div>

      {/* 5. Create / Edit Modal Form */}
      <ServicesForm
        isOpen={isFormOpen}
        service={editingService}
        onClose={() => {
          setIsFormOpen(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
      />
    </div>
  );
}
