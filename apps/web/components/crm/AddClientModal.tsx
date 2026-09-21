"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, User, DollarSign, Sparkles, Check } from "lucide-react";
import { Client, ClientStatus, PriorityLevel, pipelineColumns } from "./data";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  defaultStatus?: ClientStatus;
}

export default function AddClientModal({
  isOpen,
  onClose,
  onSave,
  defaultStatus = "Lead",
}: AddClientModalProps) {
  const [company, setCompany] = useState("");
  const [owner, setOwner] = useState("");
  const [role, setRole] = useState("Marketing Director");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [service, setService] = useState("");
  const [revenue, setRevenue] = useState("150000");
  const [status, setStatus] = useState<ClientStatus>(defaultStatus);
  const [priority, setPriority] = useState<PriorityLevel>("High");

  React.useEffect(() => {
    if (defaultStatus) setStatus(defaultStatus);
  }, [defaultStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !owner) return;

    const newClient: Client = {
      id: Date.now(),
      company,
      logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80",
      owner,
      role,
      email: email || `${owner.toLowerCase().replace(/\s+/g, ".")}@${company.toLowerCase().replace(/\s+/g, "")}.com`,
      phone: phone || "+91 98000 00000",
      service: service || "Autonomous Social & Media OS",
      status,
      revenue: parseInt(revenue, 10) || 100000,
      priority,
      nextMeeting: "TBD Next Week",
      lastUpdated: "Just now",
      paymentStatus: "Pending",
      notes: "Newly onboarded prospective client account via CRM Quick Action.",
      files: [],
      timeline: [
        {
          title: "Account Created",
          date: "Sep 07, 2026",
          description: "Client entered into Agency CRM pipeline.",
          done: true,
        },
      ],
    };

    onSave(newClient);
    onClose();
    // reset
    setCompany("");
    setOwner("");
    setService("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
              },
            }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/15 bg-[#0B1020]/95 p-6 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.85)] backdrop-blur-3xl"
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/15 text-blue-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    Add Client to Pipeline
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Create new account profile & track revenue milestone
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sameer Khanna"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">WhatsApp / Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Target Service</label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous Reels & Travel Media Engine"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Budget ($)</label>
                  <input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Pipeline Stage</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ClientStatus)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {pipelineColumns.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl border border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Client
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
