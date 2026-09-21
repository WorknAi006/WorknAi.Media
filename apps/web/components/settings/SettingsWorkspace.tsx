"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  Cpu,
  Bell,
  Users,
  Palette,
  Shield,
  CheckCircle2,
  Sparkles,
  Save,
} from "lucide-react";
import { SettingsSectionId } from "./types";
import { settingsTabs } from "./data";
import SettingsSectionRenderer from "./SettingsSectionRenderer";

export default function SettingsWorkspace() {
  const [activeTab, setActiveTab] = useState<SettingsSectionId>("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("All settings saved successfully");
    }, 600);
  };

  const getTabIcon = (id: SettingsSectionId) => {
    const cls = "h-4 w-4";
    switch (id) {
      case "profile":
        return <User className={cls} />;
      case "brand":
        return <Building2 className={cls} />;
      case "ai":
        return <Cpu className={cls} />;
      case "notifications":
        return <Bell className={cls} />;
      case "team":
        return <Users className={cls} />;
      case "theme":
        return <Palette className={cls} />;
      case "security":
        return <Shield className={cls} />;
      default:
        return null;
    }
  };

  const currentTabInfo = settingsTabs.find((t) => t.id === activeTab) || settingsTabs[0];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-[#050816]/90 px-4 py-3 text-xs font-semibold text-emerald-400 shadow-2xl backdrop-blur-xl ring-1 ring-emerald-500/20"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Workspace Administration</span>
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Settings & Preferences
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Configure brand guidelines, AI generation autonomy, security tokens, team collaboration, and visual theme.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveAll}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </motion.button>
      </motion.div>

      {/* Main Settings Grid: Left Nav Tabs, Right Section Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Tabs Nav (4 cols on desktop) */}
        <div className="space-y-1.5 lg:col-span-4">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
            {settingsTabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all ${
                    isActive
                      ? "bg-blue-600/20 text-white border border-blue-500/40 shadow-sm"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-500 text-white shadow-md shadow-blue-500/40"
                          : "border border-white/10 bg-white/5 text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      {getTabIcon(tab.id)}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{tab.label}</div>
                      <div className="text-[10px] text-zinc-500 line-clamp-1">
                        {tab.description}
                      </div>
                    </div>
                  </div>

                  {tab.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold border ${
                        isActive
                          ? "border-blue-400/40 bg-blue-500/20 text-blue-200"
                          : "border-white/10 bg-white/5 text-zinc-400"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section Content (8 cols on desktop) */}
        <div className="lg:col-span-8">
          <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            {/* Header of Active Section */}
            <div className="border-b border-white/[0.06] pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                    {getTabIcon(currentTabInfo.id)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {currentTabInfo.label}
                    </h2>
                    <p className="text-xs text-zinc-400">
                      {currentTabInfo.description}
                    </p>
                  </div>
                </div>

                {currentTabInfo.badge && (
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-300">
                    {currentTabInfo.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Mapped Section Renderer */}
            <SettingsSectionRenderer
              sectionId={activeTab}
              onShowToast={showToast}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
