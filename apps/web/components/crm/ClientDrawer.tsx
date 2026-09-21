"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Clock,
  Calendar,
  DollarSign,
  Download,
  Building2,
  User,
  CheckCircle2,
  Circle,
  ExternalLink,
  Edit2,
  Check,
} from "lucide-react";
import { Client, priorityMeta, paymentMeta, pipelineColumns } from "./data";

interface ClientDrawerProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateClient?: (updated: Client) => void;
}

export default function ClientDrawer({
  client,
  isOpen,
  onClose,
  onUpdateClient,
}: ClientDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "files">(
    "overview"
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  // Sync notes when client changes
  React.useEffect(() => {
    if (client) {
      setNotes(client.notes);
      setIsEditingNotes(false);
    }
  }, [client]);

  if (!client) return null;

  const prio = priorityMeta[client.priority];
  const paym = paymentMeta[client.paymentStatus];

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    if (onUpdateClient && client) {
      onUpdateClient({ ...client, notes });
    }
  };

  const handleWhatsAppClick = () => {
    const cleanPhone = client.phone.replace(/[^0-9]/g, "");
    window.open(
      `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
        client.owner
      )},%20regarding%20${encodeURIComponent(
        client.company
      )}'s%20WorknAI%20media%20campaign...`,
      "_blank"
    );
  };

  const handleEmailClick = () => {
    window.open(
      `mailto:${client.email}?subject=WorknAI%20Media%20Update%20for%20${encodeURIComponent(
        client.company
      )}`,
      "_blank"
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Right-side Sliding Glass Drawer */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 300,
              }}
              className="relative w-screen max-w-xl border-l border-white/10 bg-[#0B1020]/95 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Content */}
              <div>
                {/* Header Profile Section */}
                <div className="relative border-b border-white/[0.08] p-6 sm:p-7">
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white transition"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-xl">
                      <img
                        src={client.logo}
                        alt={client.company}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="pr-8">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-black text-white tracking-wide">
                          {client.company}
                        </h2>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${prio.bg} ${prio.border} ${prio.text}`}
                        >
                          {client.priority} Priority
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-400">
                        {client.service}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-zinc-300">
                          Status: {client.status}
                        </span>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${paym.bg} ${paym.border} ${paym.text}`}
                        >
                          Payment: {client.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Contact CTAs */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleWhatsAppClick}
                      className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 py-2.5 px-3 text-xs font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition hover:bg-emerald-500/25 hover:border-emerald-400"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>WhatsApp Client</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleEmailClick}
                      className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/15 py-2.5 px-3 text-xs font-bold text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition hover:bg-blue-500/25 hover:border-blue-400"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Email Account</span>
                    </button>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-white/[0.08] px-6 text-xs font-semibold">
                  {[
                    { id: "overview", label: "Overview & Notes" },
                    { id: "timeline", label: `Timeline (${client.timeline.length})` },
                    { id: "files", label: `Attached Files (${client.files.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-3.5 mr-6 border-b-2 transition ${
                        activeTab === tab.id
                          ? "border-blue-500 text-white"
                          : "border-transparent text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Contents */}
                <div className="p-6 space-y-6">
                  {activeTab === "overview" && (
                    <>
                      {/* Key Account Stats */}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                            Contract Revenue
                          </span>
                          <p className="mt-1 font-mono text-base font-bold text-white">
                            ${client.revenue.toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                            Next Meeting
                          </span>
                          <p className="mt-1 text-xs font-bold text-blue-300 truncate">
                            {client.nextMeeting}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                            Billing Status
                          </span>
                          <p className="mt-1 text-xs font-bold text-emerald-400">
                            {client.paymentStatus}
                          </p>
                        </div>
                      </div>

                      {/* Contact Details Card */}
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Account Owner
                        </h4>
                        <div className="mt-3 space-y-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-zinc-500" />
                              Contact Name
                            </span>
                            <span className="font-semibold text-white">
                              {client.owner} ({client.role})
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-zinc-500" />
                              Email
                            </span>
                            <span className="font-mono text-zinc-300 hover:text-white">
                              {client.email}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-zinc-500" />
                              Phone / WhatsApp
                            </span>
                            <span className="font-mono text-zinc-300">
                              {client.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Strategic Notes */}
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Client Campaign Notes
                          </h4>
                          {isEditingNotes ? (
                            <button
                              type="button"
                              onClick={handleSaveNotes}
                              className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Save
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setIsEditingNotes(true)}
                              className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </button>
                          )}
                        </div>

                        {isEditingNotes ? (
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {notes || "No notes recorded yet."}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === "timeline" && (
                    <div className="space-y-4">
                      {client.timeline.map((event, idx) => (
                        <div key={idx} className="flex gap-3.5">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                                event.done
                                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                                  : "border-white/20 bg-white/5 text-zinc-500"
                              }`}
                            >
                              {event.done ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <Circle className="h-2 w-2" />
                              )}
                            </div>
                            {idx < client.timeline.length - 1 && (
                              <div className="h-full w-px bg-white/10 my-1" />
                            )}
                          </div>

                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-white">
                                {event.title}
                              </h5>
                              <span className="font-mono text-[10px] text-zinc-400">
                                {event.date}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "files" && (
                    <div className="space-y-2.5">
                      {client.files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06] transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">
                                {file.name}
                              </p>
                              <span className="text-[10px] text-zinc-400 font-mono">
                                {file.size} • {file.date}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => alert(`Downloading ${file.name}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-white/[0.08] p-5 flex items-center justify-between bg-black/40">
                <span className="text-[11px] text-zinc-500">
                  Last updated {client.lastUpdated}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition"
                >
                  Close Drawer
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
