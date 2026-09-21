import Link from "next/link";
import { Film, Calendar, FileText, Plus, RefreshCw } from "lucide-react";
import { ReelPost } from "./types";

type Props = {
  reels: ReelPost[];
  onEdit: (reel: ReelPost) => void;
  onDelete: (id: number) => void;
  status?: "all" | "published" | "scheduled" | "draft";
  createHref?: string;
  onOpenCreate?: () => void;
  isLoading?: boolean;
};

export default function ReelsTable({
  reels,
  onEdit,
  onDelete,
  status = "all",
  createHref = "/admin/reels",
  onOpenCreate,
  isLoading = false,
}: Props) {
  const getStatusBadge = (status: ReelPost["status"]) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Published
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 text-xs font-semibold text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Scheduled
          </span>
        );
      case "draft":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/10 border border-zinc-500/30 px-2.5 py-1 text-xs font-medium text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.4)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/10 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <tr>
              <th className="p-4">Reel</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Channels</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Status</th>
              <th className="p-4">Schedule / Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {reels.map((reel) => (
              <tr
                key={reel.id}
                className="hover:bg-white/[0.03] transition-colors"
              >
                {/* Media & Title */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-9 rounded-lg bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {reel.thumbnail ? (
                        <img
                          src={reel.thumbnail}
                          alt={reel.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          ▶
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white line-clamp-1">
                        {reel.title}
                      </p>
                      {reel.content && (
                        <p className="text-xs text-zinc-400 line-clamp-1 max-w-xs mt-0.5">
                          {reel.content}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Brand */}
                <td className="p-4 whitespace-nowrap">
                  {reel.brand ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      <span>🏢</span> {reel.brand}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono">—</span>
                  )}
                </td>

                {/* Social Media Channels */}
                <td className="p-4 whitespace-nowrap">
                  {reel.platforms && reel.platforms.length > 0 ? (
                    <div className="flex items-center gap-1">
                      {reel.platforms.map((platform) => {
                        const icon =
                          platform === "instagram"
                            ? "📸"
                            : platform === "facebook"
                            ? "📘"
                            : platform === "linkedin"
                            ? "💼"
                            : platform === "youtube"
                            ? "▶️"
                            : platform === "twitter"
                            ? "✖️"
                            : "🌐";
                        return (
                          <span
                            key={platform}
                            title={platform}
                            className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-white/5 border border-white/10 text-xs"
                          >
                            {icon}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-[11px] text-zinc-500 font-mono">Omnichannel</span>
                  )}
                </td>

                {/* Slug */}
                <td className="p-4 font-mono text-xs text-zinc-400">
                  /{reel.slug}
                </td>

                {/* Status Badge */}
                <td className="p-4">{getStatusBadge(reel.status)}</td>

                {/* Schedule / Date */}
                <td className="p-4 text-xs text-zinc-400 whitespace-nowrap">
                  {reel.status === "scheduled" && reel.scheduled_at ? (
                    <div>
                      <span className="text-blue-300 font-medium">
                        {new Date(reel.scheduled_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        {new Date(reel.scheduled_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ) : reel.created_at ? (
                    new Date(reel.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })
                  ) : (
                    "—"
                  )}
                </td>

                {/* Actions */}
                <td className="p-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(reel)}
                      className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(reel.id)}
                      className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
                    <span>Loading {status === "all" ? "" : status} reels...</span>
                  </div>
                </td>
              </tr>
            ) : reels.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="mx-auto max-w-sm flex flex-col items-center justify-center text-center space-y-3">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-xl ${
                        status === "published"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : status === "scheduled"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                          : status === "draft"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                      }`}
                    >
                      {status === "scheduled" ? (
                        <Calendar className="h-7 w-7" />
                      ) : status === "draft" ? (
                        <FileText className="h-7 w-7" />
                      ) : (
                        <Film className="h-7 w-7" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {status === "published"
                          ? "No Published Reels"
                          : status === "scheduled"
                          ? "No Scheduled Reels"
                          : status === "draft"
                          ? "No Draft Reels"
                          : "No Reels Found"}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Create a reel or change its publishing status.
                      </p>
                    </div>

                    {onOpenCreate ? (
                      <button
                        type="button"
                        onClick={onOpenCreate}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 text-xs font-semibold text-blue-200 transition shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create New Reel</span>
                      </button>
                    ) : (
                      <Link
                        href={createHref}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 text-xs font-semibold text-blue-200 transition shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create New Reel</span>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
