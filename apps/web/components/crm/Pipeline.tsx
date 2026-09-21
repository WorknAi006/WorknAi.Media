"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, MoreHorizontal, Layers } from "lucide-react";
import ClientCard from "./ClientCard";
import { Client, pipelineColumns, ClientStatus } from "./data";

interface PipelineProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onAddClientToColumn?: (status: ClientStatus) => void;
}

export default function Pipeline({
  clients,
  onSelectClient,
  onAddClientToColumn,
}: PipelineProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {pipelineColumns.map((col, colIndex) => {
        const columnClients = clients.filter((c) => c.status === col.id);
        const columnTotalRevenue = columnClients.reduce(
          (acc, c) => acc + c.revenue,
          0
        );

        return (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: colIndex * 0.08 }}
            className="flex flex-col rounded-[26px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-colors hover:border-white/15"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full`}
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
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {col.title}
                </h3>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${col.badgeBg} ${col.badgeBorder} ${col.badgeText} border`}
                >
                  {columnClients.length}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-mono text-xs font-semibold text-zinc-400">
                  ${(columnTotalRevenue / 1000).toFixed(0)}k
                </span>
                {onAddClientToColumn && (
                  <button
                    type="button"
                    onClick={() => onAddClientToColumn(col.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition"
                    title={`Add client to ${col.title}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Column Cards Drop Area */}
            <div className="flex-1 space-y-3 min-h-[220px]">
              {columnClients.map((client, cardIndex) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  index={cardIndex}
                  onSelect={onSelectClient}
                />
              ))}

              {columnClients.length === 0 && (
                <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-4 text-center">
                  <p className="text-xs font-medium text-zinc-500">
                    No deals in {col.title}
                  </p>
                  {onAddClientToColumn && (
                    <button
                      type="button"
                      onClick={() => onAddClientToColumn(col.id)}
                      className="mt-2 text-[11px] font-semibold text-blue-400 hover:underline"
                    >
                      + Add client
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
