"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Video,
  FileText,
  Mic,
  Paperclip,
  Plus,
  Play,
  Square,
  Upload,
  ExternalLink,
  Users,
} from "lucide-react";
import { MeetingItem, SharedNote, AttachedTeamFile } from "./data";

interface MeetingPanelProps {
  meetings: MeetingItem[];
  notes: SharedNote[];
  files: AttachedTeamFile[];
  onUploadFile?: () => void;
  onNewMeeting?: () => void;
  onNewNote?: () => void;
}

export default function MeetingPanel({
  meetings,
  notes,
  files,
  onUploadFile,
  onNewMeeting,
  onNewNote,
}: MeetingPanelProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordSeconds(0);
    } else {
      setIsRecording(false);
    }
  };

  React.useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. Upcoming Meetings Card */}
      <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400">
                <Video className="h-3.5 w-3.5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Upcoming Meetings
              </h4>
            </div>

            {onNewMeeting && (
              <button
                type="button"
                onClick={onNewMeeting}
                className="text-zinc-400 hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white line-clamp-1">{m.title}</span>
                  <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-blue-300">
                    {m.date}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>{m.time}</span>
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-semibold text-blue-400 hover:underline"
                  >
                    <span>Join</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-[10px] text-zinc-500 text-center">
          Integrated with Google Meet & Zoom
        </div>
      </div>

      {/* 2. Shared Notes Card */}
      <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Shared Notes
              </h4>
            </div>

            {onNewNote && (
              <button
                type="button"
                onClick={onNewNote}
                className="text-zinc-400 hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {notes.map((n) => (
              <div
                key={n.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white line-clamp-1">{n.title}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{n.date}</span>
                </div>

                <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {n.snippet}
                </p>

                <div className="mt-2 flex flex-wrap gap-1">
                  {n.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-zinc-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-[10px] text-zinc-500 text-center">
          Collaborative markdown notes
        </div>
      </div>

      {/* 3. Quick Voice Note Card */}
      <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-pink-500/30 bg-pink-500/10 text-pink-400">
                <Mic className="h-3.5 w-3.5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Quick Voice Note
              </h4>
            </div>

            {isRecording && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 font-mono animate-pulse">
                REC {formatSecs(recordSeconds)}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center">
            {/* Record Action Circle */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleRecording}
              className={`flex h-14 w-14 items-center justify-center rounded-full border shadow-lg transition-all ${
                isRecording
                  ? "border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse"
                  : "border-pink-500/40 bg-pink-500/15 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:bg-pink-500/25 hover:border-pink-400 hover:text-white"
              }`}
            >
              {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </motion.button>

            {/* Audio Waveform visualization */}
            {isRecording ? (
              <div className="mt-4 flex items-center gap-1">
                {[12, 28, 45, 20, 36, 18, 50, 32, 16].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [h * 0.4, h, h * 0.6] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.08 }}
                    className="w-1 rounded-full bg-pink-400"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-zinc-400">
                Click mic to dictate AI task briefing
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 text-[10px] text-zinc-500 text-center">
          Auto-transcribed into task briefing
        </div>
      </div>

      {/* 4. Attach Files Card */}
      <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <Paperclip className="h-3.5 w-3.5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Attached Files
              </h4>
            </div>

            {onUploadFile && (
              <button
                type="button"
                onClick={onUploadFile}
                className="text-zinc-400 hover:text-white transition"
              >
                <Upload className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-xs hover:bg-white/[0.05] transition"
              >
                <div className="min-w-0 pr-2">
                  <span className="block font-bold text-white truncate text-[11px]">
                    {f.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {f.size} • by {f.uploadedBy.split(" ")[0]}
                  </span>
                </div>

                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-zinc-300">
                  {f.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-[10px] text-zinc-500 text-center">
          Encrypted team workspace storage
        </div>
      </div>
    </div>
  );
}
