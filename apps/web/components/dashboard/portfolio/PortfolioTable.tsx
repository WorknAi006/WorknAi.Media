import React from "react";
import {
  Edit2,
  Trash2,
  Play,
  Briefcase,
  Plus,
  ExternalLink,
  Calendar,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { FeaturedProject } from "./FeaturedPreview";

interface PortfolioTableProps {
  projects: FeaturedProject[];
  isLoading: boolean;
  onEdit: (project: FeaturedProject) => void;
  onDelete: (project: FeaturedProject) => void;
  onPreview: (project: FeaturedProject) => void;
  onAddNew: () => void;
}

export default function PortfolioTable({
  projects,
  isLoading,
  onEdit,
  onDelete,
  onPreview,
  onAddNew,
}: PortfolioTableProps) {
  if (!isLoading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-white/15 bg-white/[0.02] p-12 text-center backdrop-blur-xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)] mb-4">
          <Briefcase className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">
          Create your first case study
        </h3>
        <p className="max-w-md text-xs sm:text-sm text-zinc-400 mb-6">
          Showcase client brand deliverables, video reels, and performance metrics in the WorknAI public showcase ecosystem.
        </p>
        <button
          type="button"
          onClick={onAddNew}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
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
              <th className="p-4 pl-6">Project & Thumbnail</th>
              <th className="p-4">Client</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-20 rounded-xl bg-white/10" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-32 rounded bg-white/10" />
                        <div className="h-3 w-20 rounded bg-white/5" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><div className="h-4 w-24 rounded bg-white/10" /></td>
                  <td className="p-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                  <td className="p-4"><div className="h-5 w-16 rounded-full bg-white/10" /></td>
                  <td className="p-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                  <td className="p-4 pr-6 text-right"><div className="h-8 w-20 rounded bg-white/10 ml-auto" /></td>
                </tr>
              ))
            ) : (
              projects.map((project) => {
                const thumbnail =
                  project.thumbnail_url ||
                  project.thumbnail ||
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80";

                return (
                  <tr
                    key={project.id}
                    className="group hover:bg-white/[0.03] transition-colors"
                  >
                    {/* Thumbnail + Project Title */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/40 shadow-md group-hover:border-cyan-400/50 transition">
                          <img
                            src={thumbnail}
                            alt={project.project_title}
                            className="h-full w-full object-cover object-center group-hover:scale-110 transition duration-300"
                          />
                          {project.video_url && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="h-3.5 w-3.5 fill-white text-white drop-shadow" />
                            </div>
                          )}
                        </div>

                        <div className="max-w-xs">
                          <p className="font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                            {project.project_title}
                          </p>
                          <p className="text-xs text-zinc-400 line-clamp-1">
                            {project.description || "Client deliverable"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Client Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 font-bold text-[10px] text-cyan-400">
                          {project.client_name.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="font-semibold text-zinc-200">
                          {project.client_name}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300">
                        {project.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge
                        status={project.status}
                        featured={project.featured}
                      />
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-xs text-zinc-400 font-mono">
                      {project.created_at
                        ? new Date(project.created_at).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPreview(project)}
                          title="Preview Spotlight"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:border-cyan-400/50 hover:bg-cyan-500/15 hover:text-cyan-300 transition"
                        >
                          <Play className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(project)}
                          title="Edit Project"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:border-blue-500/50 hover:bg-blue-500/15 hover:text-blue-300 transition"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(project)}
                          title="Delete Project"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-300 transition"
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
