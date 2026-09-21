"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Video, CheckCircle2, Film, Link as LinkIcon, AlertCircle } from "lucide-react";

interface UploadVideoProps {
  currentUrl: string;
  onVideoUploaded: (url: string) => void;
}

export default function UploadVideo({
  currentUrl,
  onVideoUploaded,
}: UploadVideoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrlInput, setVideoUrlInput] = useState(currentUrl);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate Cloud / Supabase Storage upload pipeline
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(100);
            const objectUrl = URL.createObjectURL(file);
            setVideoUrlInput(objectUrl);
            onVideoUploaded(objectUrl);
          }, 300);
          return 95;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleManualUrlSave = () => {
    if (videoUrlInput.trim()) {
      onVideoUploaded(videoUrlInput.trim());
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <Film className="h-3.5 w-3.5 text-blue-400" />
          Hero MP4 Video Asset
        </label>

        {/* Tab switcher */}
        <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`rounded-md px-2 py-0.5 font-medium transition ${
              activeTab === "upload"
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Upload MP4
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`rounded-md px-2 py-0.5 font-medium transition ${
              activeTab === "url"
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Video URL
          </button>
        </div>
      </div>

      {activeTab === "upload" ? (
        <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-5 text-center transition hover:border-blue-500/50 hover:bg-white/[0.04]">
          <input
            type="file"
            accept="video/mp4,video/webm"
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={isUploading}
          />

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 mb-2">
            <Upload className={`h-5 w-5 ${isUploading ? "animate-bounce" : ""}`} />
          </div>

          <p className="text-xs font-semibold text-white">
            {isUploading ? "Uploading to Cloud Storage..." : "Click or drag MP4 video here"}
          </p>
          <p className="mt-0.5 text-[10px] text-zinc-400">
            H.264 / MP4 up to 100MB (Later powered by Supabase Storage)
          </p>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-3 w-full max-w-xs space-y-1">
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>Storing asset</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              placeholder="e.g. /videos/go.mp4 or https://cdn.worknai.media/hero.mp4"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleManualUrlSave}
            className="rounded-xl border border-blue-500/40 bg-blue-600/20 px-3 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-600/30 hover:text-white transition"
          >
            Apply
          </button>
        </div>
      )}

      {/* Video Preview Player */}
      {currentUrl && (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 p-2">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-1.5 px-1">
            <span className="flex items-center gap-1">
              <Video className="h-3 w-3 text-emerald-400" />
              Active Video Source:
            </span>
            <span className="truncate max-w-[200px] text-zinc-300">{currentUrl}</span>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
            <video
              src={currentUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
