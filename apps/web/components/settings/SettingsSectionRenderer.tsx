"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Building2,
  Cpu,
  Bell,
  Users,
  Palette,
  Shield,
  Key,
  Lock,
  Laptop,
  Smartphone,
  Check,
  Copy,
  Plus,
  Trash2,
  Sparkles,
  Sliders,
  Mail,
  Smartphone as PhoneIcon,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { SettingsSectionId } from "./types";
import {
  initialProfileData,
  initialBrandData,
  aiModelsList,
  aiPreferenceToggles,
  notificationsList,
  teamMembersList,
  themeOptions,
  activeSessionsList,
  apiKeysList,
} from "./data";
import ToggleSwitch from "./ToggleSwitch";

interface SettingsSectionRendererProps {
  sectionId: SettingsSectionId;
  onShowToast: (msg: string) => void;
}

export default function SettingsSectionRenderer({
  sectionId,
  onShowToast,
}: SettingsSectionRendererProps) {
  // --- Profile State ---
  const [profile, setProfile] = useState(initialProfileData);

  // --- Brand State ---
  const [brand, setBrand] = useState(initialBrandData);

  // --- AI Preferences State ---
  const [selectedModel, setSelectedModel] = useState("deepmedia-v4");
  const [creativityTemp, setCreativityTemp] = useState(0.75);
  const [aiToggles, setAiToggles] = useState<Record<string, boolean>>(
    aiPreferenceToggles.reduce((acc, item) => ({ ...acc, [item.id]: item.enabled }), {})
  );

  // --- Notifications State ---
  const [notifStates, setNotifStates] = useState<Record<string, { email: boolean; push: boolean }>>(
    notificationsList.reduce(
      (acc, item) => ({ ...acc, [item.id]: { email: item.email, push: item.push } }),
      {}
    )
  );

  // --- Team State ---
  const [team, setTeam] = useState(teamMembersList);
  const [inviteEmail, setInviteEmail] = useState("");

  // --- Theme State ---
  const [selectedTheme, setSelectedTheme] = useState("futuristic-cyan");
  const [blurIntensity, setBlurIntensity] = useState(85);
  const [reduceMotion, setReduceMotion] = useState(false);

  // --- Security State ---
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessions, setSessions] = useState(activeSessionsList);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    onShowToast("API Key copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    onShowToast("Session revoked successfully");
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember = {
      id: `tm-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: "Editor" as const,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80",
      status: "Pending" as const,
      lastActive: "Just invited",
    };
    setTeam([...team, newMember]);
    setInviteEmail("");
    onShowToast(`Invitation sent to ${inviteEmail}`);
  };

  return (
    <motion.div
      key={sectionId}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* ---------------- 1. PROFILE SECTION ---------------- */}
      {sectionId === "profile" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-white/[0.06] pb-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{profile.fullName}</h3>
              <p className="text-xs text-zinc-400">{profile.email} • {profile.role}</p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onShowToast("Avatar upload window opened")}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white transition"
                >
                  Change Avatar
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast("Avatar reset to default")}
                  className="text-xs text-zinc-500 hover:text-zinc-400 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Work Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Role / Position</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Timezone</label>
              <input
                type="text"
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Executive Bio</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* ---------------- 2. BRAND IDENTITY SECTION ---------------- */}
      {sectionId === "brand" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Primary Managed Brand</label>
              <select
                value={brand.activeBrand}
                onChange={(e) => setBrand({ ...brand, activeBrand: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="GoAirClass">GoAirClass (Travel & Luxury Aviation)</option>
                <option value="WorknAI Studio">WorknAI Studio (AI Media)</option>
                <option value="Logix Parcel">Logix Parcel (Supply Chain & Logistics)</option>
                <option value="PG Info">PG Info (Enterprise Cloud)</option>
                <option value="Zenith Tech">Zenith Tech (Hardware)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Brand Voice Directive</label>
              <input
                type="text"
                value={brand.brandVoice}
                onChange={(e) => setBrand({ ...brand, brandVoice: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Target Audience Demographics</label>
            <input
              type="text"
              value={brand.targetDemographic}
              onChange={(e) => setBrand({ ...brand, targetDemographic: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Creative Guidelines & Formatting Rules</label>
            <textarea
              rows={3}
              value={brand.guidelineSummary}
              onChange={(e) => setBrand({ ...brand, guidelineSummary: e.target.value })}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="text-xs font-semibold text-zinc-300">Brand Color Accent</span>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-md shadow-inner" style={{ backgroundColor: brand.primaryColor }} />
                <span className="font-mono text-xs text-zinc-400">{brand.primaryColor}</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="text-xs font-semibold text-zinc-300">Secondary Accent</span>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-md shadow-inner" style={{ backgroundColor: brand.accentColor }} />
                <span className="font-mono text-xs text-zinc-400">{brand.accentColor}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <ToggleSwitch
              checked={brand.autoWatermark}
              onChange={(val) => setBrand({ ...brand, autoWatermark: val })}
              label="Automatic Digital Brand Watermark"
              description="Embed subtle brand watermark on all generated reels, carousels, and visual exports."
            />
          </div>
        </div>
      )}

      {/* ---------------- 3. AI PREFERENCES SECTION ---------------- */}
      {sectionId === "ai" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Default LLM & Generation Engine
              </label>
              <span className="text-[11px] text-zinc-500">Live API Routing</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {aiModelsList.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-blue-500/80 bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/30"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            isSelected ? "border-blue-400 bg-blue-500" : "border-white/20"
                          }`}
                        >
                          {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-bold text-white">{model.name}</span>
                      </div>
                      <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                        {model.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 pl-6.5 text-[11px] text-zinc-400">{model.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Creativity Slider */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Creativity Temperature</h4>
                <p className="text-[11px] text-zinc-400">Controls unpredictability and novel linguistic variations.</p>
              </div>
              <span className="rounded-lg bg-blue-500/20 px-2.5 py-1 font-mono text-xs font-bold text-blue-300">
                {creativityTemp}
              </span>
            </div>

            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={creativityTemp}
              onChange={(e) => setCreativityTemp(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>0.2 (Precise / Factual)</span>
              <span>0.7 (Balanced)</span>
              <span>1.0 (Maximum Novelty)</span>
            </div>
          </div>

          {/* Mapped Toggles */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/[0.06] p-4 space-y-4">
            {aiPreferenceToggles.map((item, idx) => (
              <div key={item.id} className={idx > 0 ? "pt-4" : ""}>
                <ToggleSwitch
                  checked={aiToggles[item.id] ?? item.enabled}
                  onChange={(val) => setAiToggles({ ...aiToggles, [item.id]: val })}
                  label={item.label}
                  description={item.description}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 4. NOTIFICATIONS SECTION ---------------- */}
      {sectionId === "notifications" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs font-semibold text-zinc-400">
              <span>Alert Trigger</span>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email</span>
                <span className="flex items-center gap-1"><PhoneIcon className="h-3.5 w-3.5" /> Push</span>
              </div>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {notificationsList.map((notif) => {
                const curState = notifStates[notif.id] || { email: notif.email, push: notif.push };
                return (
                  <div key={notif.id} className="flex items-center justify-between py-4">
                    <div className="pr-4">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                        <span className="rounded bg-white/5 px-1.5 py-0.2 text-[9px] font-mono uppercase text-zinc-500">
                          {notif.category}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-zinc-400">{notif.description}</p>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0">
                      <ToggleSwitch
                        checked={curState.email}
                        onChange={(val) =>
                          setNotifStates({
                            ...notifStates,
                            [notif.id]: { ...curState, email: val },
                          })
                        }
                      />
                      <ToggleSwitch
                        checked={curState.push}
                        onChange={(val) =>
                          setNotifStates({
                            ...notifStates,
                            [notif.id]: { ...curState, push: val },
                          })
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 5. TEAM MEMBERS SECTION ---------------- */}
      {sectionId === "team" && (
        <div className="space-y-6">
          {/* Invite Form */}
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@worknai.media"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Invite Member</span>
            </button>
          </form>

          {/* Team Members List */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/[0.06] p-4">
            {team.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-9 w-9 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{member.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-semibold border ${
                          member.status === "Active"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                    {member.role}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                    {member.lastActive}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 6. THEME SECTION ---------------- */}
      {sectionId === "theme" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Visual Environment Preset
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themeOptions.map((opt) => {
                const isSelected = selectedTheme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedTheme(opt.id);
                      onShowToast(`Applied ${opt.name}`);
                    }}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-blue-500 bg-white/10 shadow-[0_0_20px_rgba(59,130,246,0.25)] ring-1 ring-blue-400"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className={`h-12 w-full rounded-xl bg-gradient-to-r ${opt.previewGradient} shadow-inner mb-3`} />
                    <h4 className="text-xs font-bold text-white">{opt.name}</h4>
                    <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2">{opt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Glassmorphism Blur Density</h4>
                <p className="text-[11px] text-zinc-400">Calibrates backdrop-filter gaussian radius across all dashboard cards.</p>
              </div>
              <span className="font-mono text-xs font-bold text-blue-400">{blurIntensity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={blurIntensity}
              onChange={(e) => setBlurIntensity(parseInt(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <ToggleSwitch
              checked={reduceMotion}
              onChange={(val) => setReduceMotion(val)}
              label="Reduced Motion Mode"
              description="Simplifies Framer Motion transitions and reduces ambient glow animations."
            />
          </div>
        </div>
      )}

      {/* ---------------- 7. SECURITY & API SECTION ---------------- */}
      {sectionId === "security" && (
        <div className="space-y-6">
          {/* 2FA Card */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</h4>
                <p className="text-[11px] text-zinc-400">Secured via Google Authenticator TOTP token.</p>
              </div>
            </div>

            <ToggleSwitch
              checked={twoFactorEnabled}
              onChange={(val) => {
                setTwoFactorEnabled(val);
                onShowToast(val ? "2FA Enabled" : "2FA Disabled");
              }}
            />
          </div>

          {/* API Keys */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Programmatic API Keys</h4>
                <p className="text-[11px] text-zinc-400">Use to trigger automated AI video generation & webhooks.</p>
              </div>
              <button
                onClick={() => onShowToast("New API key generated")}
                className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition"
              >
                <Plus className="h-3 w-3" />
                <span>Create Key</span>
              </button>
            </div>

            <div className="space-y-2">
              {apiKeysList.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{key.name}</span>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-zinc-400">
                      <span>{key.prefix}</span>
                      <span>• Created {key.created}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(key.id, key.prefix)}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
                  >
                    {copiedKey === key.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === key.id ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <h4 className="text-xs font-bold text-white">Active Device Sessions</h4>

            <div className="space-y-2">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    {sess.device.includes("iPhone") ? (
                      <Smartphone className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <Laptop className="h-4 w-4 text-zinc-400" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="rounded bg-blue-500/20 px-1.5 py-0.2 text-[9px] font-mono text-blue-300">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400">{sess.location} • IP: {sess.ip}</p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 transition"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
