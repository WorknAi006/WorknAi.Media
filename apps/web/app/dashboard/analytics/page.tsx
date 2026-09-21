"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import KPIGrid from "@/components/analytics/KPIGrid";
import LineChart from "@/components/analytics/LineChart";
import TopContent from "@/components/analytics/TopContent";
import AIInsights from "@/components/analytics/AIInsights";
import Audience from "@/components/analytics/Audience";
import { analytics, filterOptions } from "@/components/analytics/data";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<string>("Last 30 Days");
  const [brand, setBrand] = useState<string>("All Brands");
  const [platform, setPlatform] = useState<string>("All Platforms");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Enterprise Intelligence</span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Analytics Intelligence
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Cross-platform attribution, audience telemetry, and autonomous algorithmic ROI modeling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300">
            Engine: DeepAttribution v2
          </span>
        </div>
      </div>

      {/* Top Row: Filters & Export Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
            <Calendar className="h-3.5 w-3.5 text-blue-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {filterOptions.dateRanges.map((d) => (
                <option key={d} value={d} className="bg-[#0B1020] text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
            <span className="text-zinc-500 font-medium">Brand:</span>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {filterOptions.brands.map((b) => (
                <option key={b} value={b} className="bg-[#0B1020] text-white">
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
            <span className="text-zinc-500 font-medium">Channel:</span>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {filterOptions.platforms.map((p) => (
                <option key={p} value={p} className="bg-[#0B1020] text-white">
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Report Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:opacity-75"
        >
          {exportSuccess ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              <span>Report Downloaded!</span>
            </>
          ) : (
            <>
              <Download className={`h-3.5 w-3.5 ${isExporting ? "animate-bounce" : ""}`} />
              <span>{isExporting ? "Compiling..." : "Export Report"}</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Row 2: 4 KPI Cards */}
      <section>
        <KPIGrid kpis={analytics.kpis} />
      </section>

      {/* Main Area: 8 cols Line Chart, 4 cols Top Content */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <LineChart data={analytics.performance} />
        </div>
        <div className="lg:col-span-4">
          <TopContent items={analytics.topContent} />
        </div>
      </section>

      {/* Bottom Section: AI Insights */}
      <section>
        <AIInsights insights={analytics.insights} />
      </section>

      {/* Bottom Section: Audience Breakdown */}
      <section>
        <Audience audience={analytics.audience} />
      </section>
    </motion.div>
  );
}
