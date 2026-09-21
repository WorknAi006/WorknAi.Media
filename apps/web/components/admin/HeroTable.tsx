"use client";

import { Hero } from "./HeroManager";

type Props = {
    heroes: Hero[];
    onEdit: (hero: Hero) => void;
    onDelete: (id: number) => void;
};

export default function HeroTable({
    heroes,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-zinc-300">
                    <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3">Subtitle</th>
                        <th className="p-3">Button Text</th>
                        <th className="p-3">Action</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                    {heroes.map((hero) => {
                        const isUniverse = hero.title?.toLowerCase().includes("universe");
                        return (
                            <tr key={hero.id} className="hover:bg-white/[0.02] transition">
                                <td className="p-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-white">{hero.title}</span>
                                        {isUniverse ? (
                                            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                                                🌌 Explore Universe
                                            </span>
                                        ) : (
                                            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                                                🌟 Main Hero
                                            </span>
                                        )}
                                        {hero.video_url && (
                                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                                                🎬 Video Active
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-3 text-zinc-400 text-xs max-w-xs truncate">{hero.subtitle}</td>
                                <td className="p-3 text-zinc-300 text-xs">{hero.button_text}</td>

                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => onEdit(hero)}
                                        className="rounded-lg bg-blue-500/20 border border-blue-500/40 px-3 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-500/30 transition"
                                    >
                                        Edit
                                    </button>

                                <button
                                    onClick={() => onDelete(hero.id)}
                                    className="rounded-lg bg-red-500/20 border border-red-500/40 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/30 transition"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                        );
                    })}

                    {heroes.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-6 text-center text-zinc-500">
                                No Hero Data Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}