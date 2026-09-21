"use client";

import { ScheduledPost } from "./types";
import StatusBadge from "./StatusBadge";

type Props = {
  posts: ScheduledPost[];
  title?: string;
  subtitle?: string;
  onPublishNow?: (id: number) => void;
  onReschedule?: (post: ScheduledPost) => void;
  onDelete?: (id: number) => void;
};

export default function ScheduledTable({
  posts,
  title = "Scheduled Queue",
  subtitle = "Upcoming and active content waiting for publication.",
  onPublishNow,
  onReschedule,
  onDelete,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.4)]">
      <div className="border-b border-white/10 p-4 bg-white/[0.02]">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          {title}
          <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-xs font-normal text-zinc-400">
            {posts.length}
          </span>
        </h3>
        {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/10 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <tr>
              <th className="p-4">Post</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Scheduled For</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {posts.map((post) => {
              const isPast =
                post.scheduled_at && new Date(post.scheduled_at) <= new Date();

              return (
                <tr
                  key={post.id}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  {/* Post Title & Thumbnail */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {post.thumbnail ? (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-zinc-400">
                            {post.type === "reel" ? "🎬" : "📝"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white line-clamp-1">
                          {post.title}
                        </p>
                        <p className="text-xs text-zinc-500 font-mono">
                          /{post.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wider ${
                        post.type === "reel"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                          : "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                      }`}
                    >
                      {post.type === "reel" ? "Reel" : "Blog"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <StatusBadge status={post.status} />
                    {post.status === "published" && post.meta_post_id && (
                      <a
                        href="https://www.instagram.com/worknaiintern1/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline mt-1 font-medium"
                      >
                        Live on Instagram ↗
                      </a>
                    )}
                    {post.publish_error && (
                      <p className="text-[10px] text-red-400 mt-1 max-w-xs break-words font-sans bg-red-500/10 border border-red-500/20 rounded p-1">
                        ⚠️ {post.publish_error}
                      </p>
                    )}
                  </td>

                  {/* Scheduled For */}
                  <td className="p-4 text-xs">
                    {post.scheduled_at ? (
                      <div>
                        <span
                          className={`font-semibold ${
                            post.status === "scheduled" && isPast
                              ? "text-amber-400"
                              : "text-blue-300"
                          }`}
                        >
                          {new Date(post.scheduled_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <p className="text-[11px] text-zinc-400">
                          {new Date(post.scheduled_at).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                          {post.status === "scheduled" && isPast && (
                            <span className="ml-1 text-amber-400 text-[10px]">
                              (Due now)
                            </span>
                          )}
                        </p>
                      </div>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === "scheduled" && onPublishNow && (
                        <button
                          onClick={() => onPublishNow(post.id)}
                          className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition"
                          title="Publish immediately"
                        >
                          Publish Now
                        </button>
                      )}

                      {onReschedule && (
                        <button
                          onClick={() => onReschedule(post)}
                          className="rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-medium text-blue-300 hover:bg-blue-500/20 transition"
                          title="Change schedule date & time"
                        >
                          Reschedule
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(post.id)}
                          className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition"
                          title="Delete post"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-sm text-zinc-500"
                >
                  <p className="font-medium text-zinc-400">No Posts in this list</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Scheduled posts will automatically appear here.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
