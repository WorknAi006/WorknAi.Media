"use client";

import React from "react";
import PerformanceOverview from "./PerformanceOverview";
import WeeklyEngagement from "./WeeklyEngagement";
import TopPerformingBrand from "./TopPerformingBrand";
import RecentActivity from "./RecentActivity";

export default function AnalyticsSection() {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Analytics & Performance</h2>
          <p className="text-xs text-zinc-400">Live operational overview across connected media accounts</p>
        </div>
      </div>

      {/* Responsive 2-column desktop / 1-column mobile layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PerformanceOverview />
        <WeeklyEngagement />
        <TopPerformingBrand />
        <RecentActivity />
      </div>
    </section>
  );
}
