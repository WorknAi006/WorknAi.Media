"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Client, ClientStatus, pipelineColumns, priorityMeta } from "./data";

interface ClientTableProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
}

export default function ClientTable({
  clients,
  onSelectClient,
}: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "All" || c.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, currentPage, itemsPerPage]);

  const getStatusBadge = (status: ClientStatus) => {
    const col = pipelineColumns.find((p) => p.id === status);
    if (!col) return null;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md ${col.badgeBg} ${col.badgeBorder} ${col.badgeText}`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor:
              col.id === "Lead"
                ? "#3B82F6"
                : col.id === "Discussion"
                ? "#A855F7"
                : col.id === "Active"
                ? "#10B981"
                : "#06B6D4",
          }}
        />
        {status}
      </span>
    );
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
      {/* Table Controls Row: Search + Status Filter Tabs */}
      <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Client Directory & Deal Pipeline
          </h3>
          <p className="text-xs text-zinc-400">
            Comprehensive account records, billing milestones, and activity
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search companies, owners..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-1.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-0.5 text-xs">
            {["All", "Lead", "Discussion", "Active", "Completed"].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => {
                  setSelectedStatus(s);
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-2.5 py-1 font-medium transition ${
                  selectedStatus === s
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              <th className="py-3.5 px-3">Company</th>
              <th className="py-3.5 px-3">Owner</th>
              <th className="py-3.5 px-3">Project / Service</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3 text-right">Revenue</th>
              <th className="py-3.5 px-3 text-right">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {paginatedClients.map((client, idx) => (
              <motion.tr
                key={client.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                onClick={() => onSelectClient(client)}
                className="group cursor-pointer transition-colors hover:bg-white/[0.05]"
              >
                {/* Company Logo + Name */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      <img
                        src={client.logo}
                        alt={client.company}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
                        {client.company}
                      </span>
                      <span className="block text-[10px] text-zinc-500">
                        ID: #{client.id.toString().padStart(4, "0")}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Owner */}
                <td className="py-3.5 px-3">
                  <div>
                    <span className="font-semibold text-zinc-200">
                      {client.owner}
                    </span>
                    <span className="block text-[10px] text-zinc-500">
                      {client.role}
                    </span>
                  </div>
                </td>

                {/* Project / Service */}
                <td className="py-3.5 px-3 max-w-[220px]">
                  <span className="line-clamp-1 font-medium text-zinc-300">
                    {client.service}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-3">{getStatusBadge(client.status)}</td>

                {/* Revenue */}
                <td className="py-3.5 px-3 text-right">
                  <span className="font-mono font-bold text-white tracking-wide">
                    ${client.revenue.toLocaleString()}
                  </span>
                </td>

                {/* Last Updated */}
                <td className="py-3.5 px-3 text-right text-zinc-400 font-mono">
                  {client.lastUpdated}
                </td>
              </motion.tr>
            ))}

            {paginatedClients.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-zinc-500">
                  No accounts found matching your search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-4 sm:flex-row">
        <div className="text-xs text-zinc-400">
          Showing{" "}
          <span className="font-semibold text-white">
            {filteredClients.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-white">
            {Math.min(currentPage * itemsPerPage, filteredClients.length)}
          </span>{" "}
          of <span className="font-semibold text-white">{filteredClients.length}</span> clients
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-xs font-mono text-zinc-400 px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
