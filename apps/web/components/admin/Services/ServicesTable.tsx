import React from "react";
import {
  Edit2,
  Trash2,
  Layers,
  Plus,
  Sparkles,
  Video,
  Share2,
  Cpu,
  TrendingUp,
  Rocket,
  Wand2,
} from "lucide-react";
import { ServiceItem } from "./types";
import StatusBadge from "@/components/dashboard/portfolio/StatusBadge";

interface ServicesTableProps {
  services: ServiceItem[];
  isLoading: boolean;
  onEdit: (service: ServiceItem) => void;
  onDelete: (service: ServiceItem) => void;
  onAddNew: () => void;
}

const getIconComponent = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case "video":
      return Video;
    case "share2":
    case "share":
      return Share2;
    case "cpu":
      return Cpu;
    case "trendingup":
    case "trending":
      return TrendingUp;
    case "rocket":
      return Rocket;
    case "wand2":
    case "wand":
      return Wand2;
    case "layers":
      return Layers;
    default:
      return Sparkles;
  }
};

export default function ServicesTable({
  services,
  isLoading,
  onEdit,
  onDelete,
  onAddNew,
}: ServicesTableProps) {
  if (!isLoading && services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-white/15 bg-white/[0.02] p-12 text-center backdrop-blur-xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)] mb-4">
          <Layers className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">
          No services published yet
        </h3>
        <p className="max-w-md text-xs sm:text-sm text-zinc-400 mb-6">
          Create AI agency offerings such as AI Video Production, Social Automation, and Brand Strategy to showcase on the home page.
        </p>
        <button
          type="button"
          onClick={onAddNew}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-6">Service & Slug</th>
              <th className="p-4">Category</th>
              <th className="p-4">Icon</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Order</th>
              <th className="p-4 text-center">Featured</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/10" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-32 rounded bg-white/10" />
                        <div className="h-3 w-20 rounded bg-white/5" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                  <td className="p-4"><div className="h-6 w-6 rounded bg-white/10" /></td>
                  <td className="p-4"><div className="h-5 w-16 rounded-full bg-white/10" /></td>
                  <td className="p-4 text-center"><div className="h-4 w-8 rounded bg-white/10 mx-auto" /></td>
                  <td className="p-4 text-center"><div className="h-4 w-12 rounded bg-white/10 mx-auto" /></td>
                  <td className="p-4 pr-6 text-right"><div className="h-8 w-20 rounded bg-white/10 ml-auto" /></td>
                </tr>
              ))
            ) : (
              services.map((service) => {
                const IconComponent = getIconComponent(service.icon);

                return (
                  <tr
                    key={service.id}
                    className="group hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 text-cyan-400">
                          {service.cover_image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={service.cover_image}
                              alt={service.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <IconComponent className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {service.title}
                          </p>
                          <p className="text-[11px] font-mono text-cyan-400/80">
                            /{service.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300 font-medium">
                        {service.category || "General"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs text-zinc-300">
                        <IconComponent className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="font-mono text-[11px]">{service.icon || "Sparkles"}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={service.status || "draft"} />
                    </td>

                    <td className="p-4 text-center">
                      <span className="font-mono text-xs text-zinc-300 font-semibold">
                        {service.display_order ?? 0}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {service.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(service)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
                          title="Edit Service"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(service)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition"
                          title="Delete Service"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
