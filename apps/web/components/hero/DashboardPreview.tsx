"use client";

import { Calendar, ImageIcon, BarChart3 } from "lucide-react";

const cards = [
  {
    title: "Scheduled",
    value: "28",
    icon: Calendar,
    color: "bg-blue-600",
  },
  {
    title: "AI Generated",
    value: "143",
    icon: ImageIcon,
    color: "bg-zinc-900",
  },
  {
    title: "Reach",
    value: "2.8M",
    icon: BarChart3,
    color: "bg-zinc-900",
  },
];

export default function DashboardPreview() {
  return (
    <section className="mt-24">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <h3 className="text-lg font-semibold">
              Social Media Studio
            </h3>
            <p className="text-sm text-zinc-400">
              Instagram • Facebook • YouTube
            </p>
          </div>

          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">
            ● Live
          </span>
        </div>

        {/* Cards */}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className={`${card.color} rounded-2xl p-5 transition hover:scale-[1.03]`}
              >
                <Icon size={22} />

                <p className="mt-4 text-sm text-zinc-300">
                  {card.title}
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  {card.value}
                </h2>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}