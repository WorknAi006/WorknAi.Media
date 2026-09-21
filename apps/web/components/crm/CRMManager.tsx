"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  DollarSign,
  Briefcase,
  Sparkles,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  Trash2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import Pipeline from "./Pipeline";
import ClientTable from "./ClientTable";
import ClientDrawer from "./ClientDrawer";
import AddClientModal from "./AddClientModal";
import {
  clients as initialClients,
  Client,
  ClientStatus,
} from "./data";

interface Props {
  title?: string;
  subtitle?: string;
}

export default function CRMManager({
  title = "Client CRM & Deal Pipeline",
  subtitle = "Orchestrate enterprise brand accounts, live incoming project requests, and deal pipelines.",
}: Props) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [liveLeads, setLiveLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<"pipeline" | "inbound" | "table">("pipeline");

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<ClientStatus>("Lead");

  // Top Filter state
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [topStatusFilter, setTopStatusFilter] = useState<string>("All");

  // Floating speed dial state
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);

  // Fetch live leads from /api/leads
  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLiveLeads(json.data);

        // Map live leads to Client objects to display in the CRM pipeline
        const mappedLeads: Client[] = json.data.map((lead: any) => {
          const lines = (lead.message || "").split("\n\n");
          let company = "Direct Client";
          let service = "AI Project Directive";
          let brief = lead.message || "";

          lines.forEach((l: string) => {
            if (l.startsWith("Company:")) company = l.replace("Company:", "").trim();
            if (l.startsWith("Interested Service:")) service = l.replace("Interested Service:", "").trim();
          });

          let status: ClientStatus = "Lead";
          if (lead.status === "discussion") status = "Discussion";
          if (lead.status === "active") status = "Active";
          if (lead.status === "completed") status = "Completed";

          return {
            id: Number(lead.id) + 10000,
            company: company || lead.name + " Brand",
            logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
            owner: lead.name,
            role: "Inbound Prospect",
            email: lead.email,
            phone: lead.phone,
            service: service,
            status: status,
            revenue: 50000,
            priority: "High" as const,
            nextMeeting: "Initial Discovery Call",
            lastUpdated: new Date(lead.created_at).toLocaleDateString(),
            paymentStatus: "Pending" as const,
            notes: brief,
            files: [],
            timeline: [
              {
                title: "Project Directive Submitted",
                date: new Date(lead.created_at).toLocaleString(),
                description: `Inbound request submitted via landing page for ${service}.`,
                done: true,
              },
            ],
          };
        });

        setClients(() => {
          const nonDuplicatedInitials = initialClients.filter(
            (c) => !mappedLeads.some((m) => m.email && m.email === c.email)
          );
          return [...mappedLeads, ...nonDuplicatedInitials];
        });
      }
    } catch (err) {
      console.error("Failed to fetch live leads:", err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleUpdateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      loadLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    if (!window.confirm("Are you sure you want to delete this project request?")) return;
    try {
      await fetch(`/api/leads?id=${leadId}`, { method: "DELETE" });
      loadLeads();
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics computation
  const totalPipelineRevenue = useMemo(() => {
    return clients.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [clients]);

  const activeAccountsCount = useMemo(() => {
    return clients.filter((c) => c.status === "Active").length;
  }, [clients]);

  // Filtered clients for the view
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        c.company.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.owner.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.service.toLowerCase().includes(globalSearch.toLowerCase());
      const matchesStatus =
        topStatusFilter === "All" || c.status === topStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, globalSearch, topStatusFilter]);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const handleUpdateClient = (updated: Client) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedClient(updated);
  };

  const openAddModalWithStatus = (status: ClientStatus = "Lead") => {
    setModalDefaultStatus(status);
    setIsAddModalOpen(true);
  };

  const handleQuickWhatsApp = () => {
    const topClient = clients.find((c) => c.status === "Active") || clients[0];
    if (topClient) {
      const cleanPhone = topClient.phone.replace(/[^0-9]/g, "");
      window.open(
        `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
          topClient.owner
        )},%20checking%20in%20from%20WorknAI%20Media%20OS!`,
        "_blank"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[calc(100vh-140px)] space-y-8"
    >
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
            <Users className="h-3.5 w-3.5" />
            <span>Connected Agency CRM Engine</span>
            {liveLeads.length > 0 && (
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                {liveLeads.length} Live Project Requests
              </span>
            )}
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            {subtitle}
          </p>
        </div>

        {/* Top Summary Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-xl">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                Pipeline Value
              </span>
              <span className="font-mono text-sm font-bold text-white">
                ${totalPipelineRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-xl">
            <Briefcase className="h-4 w-4 text-blue-400" />
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                Active Retainers
              </span>
              <span className="font-mono text-sm font-bold text-white">
                {activeAccountsCount} Accounts
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={loadLeads}
            title="Refresh Inbound Leads"
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 px-3.5 py-3 text-xs font-semibold text-zinc-200 transition"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingLeads ? "animate-spin text-blue-400" : ""}`} />
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openAddModalWithStatus("Lead")}
            className="flex items-center gap-2 rounded-2xl border border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Client</span>
          </motion.button>
        </div>
      </div>

      {/* Main Mode Toggle: Pipeline Board vs Inbound Project Requests Table */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveViewTab("pipeline")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeViewTab === "pipeline"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>🎯 Deal Pipeline Board</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab("inbound")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeViewTab === "inbound"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>📥 Inbound Project Directives</span>
            {liveLeads.length > 0 && (
              <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] text-cyan-200 font-mono">
                {liveLeads.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab("table")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeViewTab === "table"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>📋 All Accounts Table</span>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search leads, companies, services..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* VIEW 1: Deal Pipeline (Kanban) */}
      {activeViewTab === "pipeline" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                Deal Pipeline Board
              </h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-zinc-400">
                {filteredClients.length} accounts
              </span>
            </div>

            {/* Status Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mr-1">
                Stage:
              </span>
              {["All", "Lead", "Discussion", "Active", "Completed"].map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setTopStatusFilter(status)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    topStatusFilter === status
                      ? "border border-blue-500/60 bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <Pipeline
            clients={filteredClients}
            onSelectClient={handleSelectClient}
            onAddClientToColumn={openAddModalWithStatus}
          />
        </section>
      )}

      {/* VIEW 2: Inbound Project Directives (Direct from Landing Page Form) */}
      {activeViewTab === "inbound" && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📥 Live Inbound Project Requests</span>
                  <span className="rounded-full bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-0.5 font-mono">
                    {liveLeads.length} Received
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Direct requests submitted via the "Send Project Directive" form on the landing page. Saved in Supabase live.
                </p>
              </div>

              <button
                type="button"
                onClick={loadLeads}
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingLeads ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {liveLeads.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                <Mail className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                <p className="text-sm font-medium">No inbound project requests received yet.</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Submissions from the landing page contact form will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                {liveLeads.map((lead) => {
                  const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : "";
                  return (
                    <div
                      key={lead.id}
                      className="p-5 hover:bg-white/[0.02] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-white text-sm">{lead.name}</span>
                          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-300">
                            {lead.email}
                          </span>
                          {lead.phone && (
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                              <Phone className="h-2.5 w-2.5" />
                              {lead.phone}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(lead.created_at).toLocaleString()}
                          </span>
                        </div>

                        {/* Project Directive Message / Requirements */}
                        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs text-zinc-300 whitespace-pre-line font-sans">
                          {lead.message || "No additional brief provided."}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
                              lead.name
                            )},%20thank%20you%20for%20submitting%20your%20project%20directive%20to%20WorknAI%20Media!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-300 transition"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}?subject=WorknAI%20Media%20-%20Your%20Project%20Directive`}
                            className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/20 hover:bg-blue-500/30 px-3 py-2 text-xs font-bold text-blue-300 transition"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>Email</span>
                          </a>
                        )}

                        <select
                          value={lead.status || "new"}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
                        >
                          <option value="new" className="bg-zinc-900 text-white">Stage: New Lead</option>
                          <option value="discussion" className="bg-zinc-900 text-white">Stage: Discussion</option>
                          <option value="active" className="bg-zinc-900 text-white">Stage: Active Client</option>
                          <option value="completed" className="bg-zinc-900 text-white">Stage: Completed</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          title="Delete Request"
                          className="rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 p-2 text-rose-400 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* VIEW 3: Accounts Table */}
      {activeViewTab === "table" && (
        <section className="mt-4">
          <ClientTable
            clients={clients}
            onSelectClient={handleSelectClient}
          />
        </section>
      )}

      {/* Right-Side Sliding Glass Drawer */}
      <ClientDrawer
        client={selectedClient}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateClient={handleUpdateClient}
      />

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddClient}
        defaultStatus={modalDefaultStatus}
      />
    </motion.div>
  );
}
