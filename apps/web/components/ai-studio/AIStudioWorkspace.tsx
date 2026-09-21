"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, History, Zap, Sliders, ChevronRight } from "lucide-react";
import ContentTypeSelector from "./ContentTypeSelector";
import BrandSelector from "./BrandSelector";
import PromptStudio from "./PromptStudio";
import PreviewCard from "./PreviewCard";
import { ContentTypeId, Brand, GeneratedContent } from "./types";
import {
  brandsList,
  contentTypesList,
  generationSteps,
  initialGeneratedContents,
} from "./data";

export default function AIStudioWorkspace() {
  const [selectedType, setSelectedType] = useState<ContentTypeId>("instagram");
  const [selectedBrand, setSelectedBrand] = useState<Brand>(brandsList[0]);
  const [prompt, setPrompt] = useState<string>(contentTypesList[0].defaultPrompt);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepMessage, setCurrentStepMessage] = useState("");
  const [generatedContents, setGeneratedContents] =
    useState<Record<string, GeneratedContent>>(initialGeneratedContents);
  const [activeRightTab, setActiveRightTab] = useState<"preview" | "history">("preview");
  const [historyList, setHistoryList] = useState<GeneratedContent[]>([
    initialGeneratedContents.instagram,
    initialGeneratedContents.reel,
    initialGeneratedContents.youtube,
  ]);

  const currentTypeConfig =
    contentTypesList.find((c) => c.id === selectedType) || contentTypesList[0];

  // Auto-fill default prompt when switching format if user hasn't heavily customized
  const handleSelectType = (id: ContentTypeId) => {
    setSelectedType(id);
    const config = contentTypesList.find((c) => c.id === id);
    if (config) {
      setPrompt(config.defaultPrompt);
    }
  };

  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setActiveRightTab("preview");

    // Cycle through realistic loading step messages
    let step = 0;
    setCurrentStepMessage(generationSteps[0]);

    const interval = setInterval(() => {
      step++;
      if (step < generationSteps.length) {
        setCurrentStepMessage(generationSteps[step]);
      } else {
        clearInterval(interval);
        finalizeGeneration();
      }
    }, 400);
  };

  const finalizeGeneration = () => {
    setIsGenerating(false);

    // Create realistic tailored output based on user input & brand
    const newId = `gen-${Date.now()}`;
    const baseSample = initialGeneratedContents[selectedType];

    const generated: GeneratedContent = {
      ...baseSample,
      id: newId,
      brand: selectedBrand,
      title: prompt.length > 50 ? `${prompt.slice(0, 50)}...` : prompt,
      timestamp: "Just now",
      metricsEstimated: {
        reach: `${Math.floor(Math.random() * 40 + 30)}K - ${Math.floor(Math.random() * 50 + 70)}K`,
        engagement: `${(Math.random() * 4 + 4).toFixed(1)}%`,
        viralScore: Math.floor(Math.random() * 15 + 85),
      },
    };

    setGeneratedContents((prev) => ({
      ...prev,
      [selectedType]: generated,
    }));

    setHistoryList((prev) => [generated, ...prev.slice(0, 8)]);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-3 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Multi-Modal Generative Engine</span>
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            AI Studio Workspace
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Generate high-converting social campaigns, viral reels, scripts, ads, and photorealistic graphics in one unified terminal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300">
            Model: DeepMedia-V4 Omni
          </span>
        </div>
      </motion.div>

      {/* Main 2-Column Responsive Workspace Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Creator Studio Inputs (7 cols on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 lg:col-span-7"
        >
          {/* 1. Format Selector */}
          <ContentTypeSelector
            selectedType={selectedType}
            onSelectType={handleSelectType}
          />

          {/* 2. Brand Selector */}
          <BrandSelector
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
          />

          {/* 3. Prompt Directive & Generate Button */}
          <PromptStudio
            prompt={prompt}
            setPrompt={setPrompt}
            selectedContentType={currentTypeConfig}
            selectedBrand={selectedBrand}
            isGenerating={isGenerating}
            currentStepMessage={currentStepMessage}
            onGenerate={handleGenerate}
          />
        </motion.div>

        {/* Right Column: Live Generated Preview & History (5 cols on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col space-y-4 lg:col-span-5"
        >
          {/* Right Column Sub-Header Tabs */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl">
            <button
              onClick={() => setActiveRightTab("preview")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                activeRightTab === "preview"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Live Generated Output</span>
            </button>

            <button
              onClick={() => setActiveRightTab("history")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                activeRightTab === "history"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>History ({historyList.length})</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeRightTab === "preview" ? (
              <PreviewCard
                content={
                  generatedContents[selectedType] || initialGeneratedContents.instagram
                }
                onRegenerate={handleGenerate}
              />
            ) : (
              <div className="space-y-3">
                {historyList.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setSelectedType(item.type);
                      setActiveRightTab("preview");
                    }}
                    className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 backdrop-blur-md transition-all hover:border-blue-500/40 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-mono uppercase text-blue-400">
                          {item.type}
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-blue-200">
                          {item.brand.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{item.timestamp}</span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-zinc-400 font-medium">
                      {item.title}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
