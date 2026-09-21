import Link from "next/link";
import { ArrowLeft, Sparkles, Database } from "lucide-react";

type Props = {
  title: string;
  tableName: string;
  description: string;
};

export default function ModulePlaceholder({
  title,
  tableName,
  description,
}: Props) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-center">
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-10 space-y-6 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
          <Sparkles className="h-3.5 w-3.5" />
          WorknAI Media CMS Module
        </div>

        <h1 className="text-3xl font-black text-white">{title}</h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">{description}</p>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 max-w-sm mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <Database className="h-4 w-4 text-emerald-400" />
            <span>Supabase Table:</span>
          </div>
          <span className="font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
            {tableName} (Live)
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to CMS Hub
          </Link>
          <Link
            href="/admin/reels"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            Open Reels CMS
          </Link>
        </div>
      </div>
    </div>
  );
}
