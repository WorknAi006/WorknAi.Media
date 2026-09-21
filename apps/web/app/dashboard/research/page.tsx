"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, AlertCircle, CheckCircle2 } from "lucide-react";
import SearchPanel from "@/components/research/SearchPanel";
import TrendingTopics from "@/components/research/TrendingTopics";
import CompetitorCard from "@/components/research/CompetitorCard";
import ViralIdeas from "@/components/research/ViralIdeas";
import Report from "@/components/research/Report";
import {
  trendingTopics,
  competitorDatabase,
  viralReelIdeas,
  defaultResearchReport,
  ResearchReportData,
  ViralReelIdea,
} from "@/components/research/data";
import { useRouter } from "next/navigation";

export default function ResearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("Autonomous Travel & Experience Booking");
  const [selectedTopic, setSelectedTopic] = useState<string>("AI & Autonomous Media OS");
  const [selectedCompetitorName, setSelectedCompetitorName] = useState<string>("MakeMyTrip");
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchProgress, setResearchProgress] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [report, setReport] = useState<ResearchReportData>(defaultResearchReport);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    // Switch competitor if matches
    if (competitorDatabase[q]) {
      setSelectedCompetitorName(q);
    }
    setReport((prev) => ({
      ...prev,
      query: q,
      generatedDate: "Just now",
    }));
    showToast(`Quick search completed for "${q}"`);
  };

  const handleDeepResearch = (q: string) => {
    const targetQuery = q.trim() || query;
    setIsResearching(true);
    setResearchProgress(15);

    const interval = setInterval(() => {
      setResearchProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsResearching(false);
            setResearchProgress(100);
            setReport({
              query: targetQuery,
              generatedDate: "Just now",
              confidenceScore: 97,
              marketOpportunity: `High organic interest detected for "${targetQuery}". Audience sentiment points to high engagement on Instagram Reels and YouTube Shorts with multi-lingual audio hooks.`,
              competitorGap: `Competitors currently produce generic English text updates and lack automated video attribution or direct WhatsApp CTA pipelines for "${targetQuery}".`,
              suggestedStrategy: [
                `Produce 6 vertical reels weekly focusing on "${targetQuery}" problem-solving hooks.`,
                "Deploy local language regional subtitles in Hindi & Marathi for tier-2 resonance.",
                "Incorporate instantaneous WhatsApp booking links into bio and pinned comments.",
                "Leverage WorknAI autonomous telematics demonstrations to build buyer confidence.",
              ],
              recommendedHashtags: [
                `#${targetQuery.replace(/\s+/g, "")}`,
                "#WorknAI2026",
                "#ViralGrowthHacks",
                "#AutonomousMedia",
                "#HighRetentionReels",
                "#SmartAgencyOS",
              ],
              bestPostingTime: {
                window: "7:30 PM – 8:45 PM IST",
                peakDay: "Wednesday & Friday Evenings",
                projectedBoost: "+46% Organic Distribution",
              },
            });
            showToast(`Deep AI Research report synthesized for "${targetQuery}"`);
          }, 300);
          return 90;
        }
        return prev + 25;
      });
    }, 280);
  };

  const handleSaveReport = () => {
    setSavedSuccess(true);
    showToast("Report saved to Enterprise Workspace Library");
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSelectTopic = (topicName: string) => {
    setSelectedTopic(topicName);
    setQuery(topicName);
    handleDeepResearch(topicName);
  };

  const handleSelectCompetitor = (name: string) => {
    if (competitorDatabase[name]) {
      setSelectedCompetitorName(name);
    } else {
      setSelectedCompetitorName("MakeMyTrip");
    }
    showToast(`Switched competitor focus to ${name}`);
  };

  const handleGenerateSimilar = (idea: ViralReelIdea) => {
    showToast(`Loading format "${idea.hook.slice(0, 32)}..." into AI Studio`);
    setTimeout(() => {
      router.push("/dashboard/studio");
    }, 600);
  };

  const handleExport = (format: "pdf" | "docx" | "share") => {
    if (format === "share") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Share link copied to clipboard!");
    } else {
      showToast(`Generating and exporting ${format.toUpperCase()} report bundle...`);
    }
  };

  const activeCompetitor =
    competitorDatabase[selectedCompetitorName] || competitorDatabase["MakeMyTrip"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-blue-500/40 bg-[#0B1020]/95 px-4 py-3 text-xs font-semibold text-white shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Search Workspace */}
      <SearchPanel
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        onDeepResearch={handleDeepResearch}
        onSaveReport={handleSaveReport}
        isResearching={isResearching}
        researchProgress={researchProgress}
        savedSuccess={savedSuccess}
      />

      {/* 3 Columns Responsive Grid: Left (Trending), Center (Competitor), Right (Viral Ideas) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (3 cols on desktop): Trending Topics */}
        <div className="lg:col-span-3">
          <TrendingTopics
            topics={trendingTopics}
            selectedTopic={selectedTopic}
            onSelectTopic={handleSelectTopic}
          />
        </div>

        {/* Center Column (5 cols on desktop): Competitor Analysis */}
        <div className="lg:col-span-5">
          <CompetitorCard
            competitor={activeCompetitor}
            competitorsList={Object.values(competitorDatabase)}
            onSelectCompetitor={handleSelectCompetitor}
          />
        </div>

        {/* Right Column (4 cols on desktop): Viral Reel Ideas */}
        <div className="lg:col-span-4">
          <ViralIdeas
            ideas={viralReelIdeas}
            onGenerateSimilar={handleGenerateSimilar}
          />
        </div>
      </div>

      {/* Bottom Section: AI Research Report */}
      <section>
        {isResearching ? (
          /* Skeleton Loader Card */
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl space-y-6 animate-pulse">
            <div className="h-8 w-1/3 rounded-xl bg-white/10" />
            <div className="grid grid-cols-2 gap-6">
              <div className="h-32 rounded-2xl bg-white/5" />
              <div className="h-32 rounded-2xl bg-white/5" />
            </div>
            <div className="h-28 rounded-2xl bg-white/5" />
          </div>
        ) : (
          <Report report={report} onExport={handleExport} />
        )}
      </section>
    </motion.div>
  );
}
