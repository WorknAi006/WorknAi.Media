import Link from "next/link";
import { Sparkles } from "lucide-react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import { SchedulerSection } from "@/components/dashboard/scheduler";

export default function DashboardPage() {
  return (
    <section>

      <div className="mb-8">
        <p className="text-blue-400">WELCOME BACK</p>

        <h1 className="mt-2 text-5xl font-bold">
          AI Media Dashboard
        </h1>

        <p className="mt-3 text-gray-400">
          Manage brands, create content and schedule posts from one place.
        </p>
      </div>

      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8">
        <div className="flex items-center gap-3">
          <Sparkles className="text-blue-400"/>
          <h2 className="text-2xl font-semibold">
            Generate Today's Content
          </h2>
        </div>

        <p className="mt-3 max-w-xl text-gray-300">
          AI can generate Instagram posts, reels, YouTube scripts and banners in one click.
        </p>

        <Link
          href="/dashboard/studio"
          className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500"
        >
          Launch AI Studio
        </Link>
      </div>

      <StatsGrid />

      <AnalyticsSection />

      <SchedulerSection />

    </section>
  );
}
