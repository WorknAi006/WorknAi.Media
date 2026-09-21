"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users2,
  Search,
  UserPlus,
  ChevronDown,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import KanbanBoard from "@/components/team/KanbanBoard";
import ActivityTimeline from "@/components/team/ActivityTimeline";
import MeetingPanel from "@/components/team/MeetingPanel";
import InviteMemberModal from "@/components/team/InviteMemberModal";
import {
  team as initialTeam,
  TeamMember,
  TaskItem,
  TaskStatus,
} from "@/components/team/data";

export default function TeamWorkspacePage() {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTeam.tasks);
  const [members, setMembers] = useState<TeamMember[]>(initialTeam.members);
  const [activities, setActivities] = useState(initialTeam.activities);
  const [currentWorkspace, setCurrentWorkspace] = useState(initialTeam.workspaces[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const handleInvite = (newMember: Partial<TeamMember>) => {
    const memberObj: TeamMember = {
      id: `m-${Date.now()}`,
      name: newMember.name || "New Teammate",
      role: newMember.role || "Creator",
      avatar: newMember.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      email: newMember.email || "teammate@worknai.media",
      isOnline: true,
      tasksCount: 0,
    };
    setMembers((prev) => [memberObj, ...prev]);
    showToast(`Invitation sent to ${memberObj.email}`);
  };

  const handleAddTask = (status: TaskStatus) => {
    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title: "New Autonomous Campaign Sprint Item",
      project: "Online Go",
      brandColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
      assignee: members[0],
      priority: "Medium",
      dueDate: "This Friday",
      progress: 0,
      status,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`New task added to ${status} column`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Toast Notification */}
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

      {/* Top Bar Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
            <Users2 className="h-3.5 w-3.5" />
            <span>Enterprise Collaboration</span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Team Workspace & Operations
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Coordinate multi-brand sprints, cross-team approvals, and autonomous creative workflows.
          </p>
        </div>

        {/* Workspace selector & Invite button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Workspace Selector */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200">
            <Layers className="h-3.5 w-3.5 text-blue-400" />
            <select
              value={currentWorkspace}
              onChange={(e) => {
                setCurrentWorkspace(e.target.value);
                showToast(`Switched workspace to ${e.target.value}`);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {initialTeam.workspaces.map((w) => (
                <option key={w} value={w} className="bg-[#0B1020] text-white">
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Invite Member Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite Member</span>
          </motion.button>
        </div>
      </div>

      {/* Top Bar Secondary Row: Team Search & Online Members Avatars */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        {/* Team Search */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tasks, project deliverables, or assignees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Online Members Avatars with pulse */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-zinc-400">
            Active Now ({members.filter((m) => m.isOnline).length}):
          </span>

          <div className="flex -space-x-2 overflow-hidden">
            {members.map((member) => (
              <div
                key={member.id}
                title={`${member.name} (${member.role})`}
                className="group relative"
              >
                <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-[#0B1020] bg-black/40 transition-transform group-hover:scale-110 group-hover:z-10 cursor-pointer">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Avatar Pulse for Online Users */}
                {member.isOnline && (
                  <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-[#0B1020] bg-emerald-500" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Row: Left (7 cols Project Kanban) & Right (5 cols Team Activity) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (7 cols): Project Kanban */}
        <div className="lg:col-span-7">
          <KanbanBoard tasks={filteredTasks} onAddTask={handleAddTask} />
        </div>

        {/* Right Column (5 cols): Team Activity */}
        <div className="lg:col-span-5">
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* Bottom Section: Meeting & Notes */}
      <section>
        <MeetingPanel
          meetings={initialTeam.meetings}
          notes={initialTeam.notes}
          files={initialTeam.files}
          onUploadFile={() => showToast("File upload browser opened")}
          onNewMeeting={() => showToast("Schedule meeting opened")}
          onNewNote={() => showToast("Draft note created")}
        />
      </section>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
      />
    </motion.div>
  );
}
