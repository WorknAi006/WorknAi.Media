"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  RefreshCw,
  Send,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Radio,
  Clock,
  Plus,
  Trash2,
  Star,
  X,
  KeyRound,
  User,
  Hash,
  Layers,
  HelpCircle,
} from "lucide-react";
import PlatformIcon from "@/components/dashboard/scheduler/PlatformIcon";

interface ConnectedAccount {
  id: string;
  platform: string;
  account_id: string;
  account_name: string;
  connected: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface InstagramAccountData {
  id: string;
  username: string;
  accountType: string;
  mediaCount: number;
}

export default function IntegrationsPage() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [activeAccountData, setActiveAccountData] = useState<InstagramAccountData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testPublishing, setTestPublishing] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // New Account Form State
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(true);

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (hasBody = false): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (hasBody) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // Load all connected accounts and status of active default
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch all connected accounts
      const accRes = await fetch(`${apiBase}/scheduler/instagram/accounts`, {
        cache: "no-store",
        headers: getHeaders(),
      });
      const accJson = await accRes.json();
      if (accJson.success) {
        setAccounts(accJson.accounts || []);
      }

      // 2. Fetch live status of primary active account
      const statRes = await fetch(`${apiBase}/scheduler/instagram/status`, {
        cache: "no-store",
        headers: getHeaders(),
      });
      const statJson = await statRes.json();
      if (statJson.success && statJson.connected) {
        setActiveAccountData(statJson.account);
      } else {
        setActiveAccountData(null);
        if (accJson.accounts?.length > 0) {
          setError(statJson.error || "Primary account not reachable.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load integrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setTesting(true);
    setTestResult(null);
    await loadData();
    setTesting(false);
  };

  // Set account as default
  const handleSetDefault = async (id: string, name: string) => {
    try {
      const res = await fetch(`${apiBase}/scheduler/instagram/accounts/${id}/default`, {
        method: "PUT",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(`@${name} is now the primary active Instagram account.`);
        await loadData();
      } else {
        alert(data.error || "Failed to set default account");
      }
    } catch (err: any) {
      alert(err.message || "Request failed");
    }
  };

  // Disconnect / Delete account
  const handleDeleteAccount = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to disconnect @${name}?`)) return;

    try {
      const res = await fetch(`${apiBase}/scheduler/instagram/accounts/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(`@${name} has been disconnected.`);
        await loadData();
      } else {
        alert(data.error || "Failed to disconnect account");
      }
    } catch (err: any) {
      alert(err.message || "Request failed");
    }
  };

  // Test live publish
  const handleTestPublish = async (accName?: string) => {
    const target = accName || activeAccountData?.username || "connected profile";
    if (!confirm(`Publish a live test photo to @${target} on Instagram?`)) return;

    setTestPublishing(target);
    setTestResult(null);
    try {
      const res = await fetch(`${apiBase}/scheduler/instagram/test`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({
          title: "WorknAI Media OS Live Test 🚀",
          content: "Automated test dispatch from WorknAI Media Studio Scheduler.\n\n#WorknAI #Automation #AIStudio #MarketingOS",
          media_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
          type: "image",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResult(`Success! Post published to Instagram. Meta Post ID: ${data.metaPostId}`);
        await loadData();
      } else {
        setTestResult(`Failed: ${data.error}`);
      }
    } catch (err: any) {
      setTestResult(`Error: ${err.message}`);
    } finally {
      setTestPublishing(null);
    }
  };

  // Submit New Account Form
  const handleAddAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!accountName.trim() || !accountId.trim() || !accessToken.trim()) {
      setModalError("Please fill in Account Handle, Account ID, and Access Token.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/scheduler/instagram/accounts`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({
          account_name: accountName.trim(),
          account_id: accountId.trim(),
          access_token: accessToken.trim(),
          set_as_default: setAsDefault,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setModalError(data.error || "Failed to verify or connect Instagram account.");
        return;
      }

      // Success
      setShowAddModal(false);
      setAccountName("");
      setAccountId("");
      setAccessToken("");
      setTestResult(`🎉 Successfully connected @${data.account.account_name}!`);
      await loadData();
    } catch (err: any) {
      setModalError(err.message || "Failed to connect to backend server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>Social API Connectors</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Connected Channels & Profiles
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage authenticated Instagram Business accounts, tokens, and multi-profile autonomous dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setModalError(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:brightness-110 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Instagram Account</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={testing}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${testing ? "animate-spin text-blue-400" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Global Alert Notification */}
      {testResult && (
        <div
          className={`rounded-2xl border p-4 text-xs font-medium flex items-center justify-between ${
            testResult.startsWith("Success") || testResult.includes("🎉") || testResult.includes("primary")
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/30 bg-amber-500/10 text-amber-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{testResult}</span>
          </div>
          {testResult.startsWith("Success") && (
            <a
              href={`https://www.instagram.com/${activeAccountData?.username || "worknaiintern1"}/`}
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 hover:text-white"
            >
              <span>View on Instagram</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      {error && !testResult && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-medium text-red-300 flex items-center gap-2.5">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Connected Instagram Profiles Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Connected Instagram Profiles</span>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-xs text-blue-400 font-mono">
              {accounts.length}
            </span>
          </h2>
          <span className="text-xs text-zinc-400">
            Active default profile is used for scheduled autonomous publishing.
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {accounts.map((acc) => {
            const isPrimary = acc.is_default;
            return (
              <div
                key={acc.id}
                className={`rounded-3xl border p-6 backdrop-blur-2xl transition relative overflow-hidden ${
                  isPrimary
                    ? "border-blue-500/40 bg-gradient-to-b from-[#0F172A] to-[#070D1D] shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                {/* Glow for default */}
                {isPrimary && (
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
                )}

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
                  <div className="flex items-start gap-4">
                    {/* Platform Icon */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-rose-500/20">
                      <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0A0E1A]">
                        <PlatformIcon platform="Instagram" className="h-7 w-7 text-white" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-white tracking-wide">
                          @{acc.account_name}
                        </h3>

                        {isPrimary ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <Star className="h-3 w-3 fill-emerald-400" />
                            Primary Default
                          </span>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-zinc-400">
                            Secondary
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                          Meta Graph API v21.0
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                        <span>
                          Account ID: <code className="text-zinc-300 font-mono">{acc.account_id}</code>
                        </span>
                        <span>
                          Connected: <span className="text-zinc-300">{new Date(acc.created_at).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this Account */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {!isPrimary && (
                      <button
                        onClick={() => handleSetDefault(acc.id, acc.account_name)}
                        className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition"
                      >
                        Set as Default
                      </button>
                    )}

                    <button
                      onClick={() => handleTestPublish(acc.account_name)}
                      disabled={testPublishing === acc.account_name}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 hover:from-rose-500 hover:to-purple-500 transition disabled:opacity-50"
                    >
                      <Send className={`h-3 w-3 ${testPublishing === acc.account_name ? "animate-bounce" : ""}`} />
                      <span>{testPublishing === acc.account_name ? "Publishing..." : "Test Post"}</span>
                    </button>

                    <a
                      href={`https://www.instagram.com/${acc.account_name}/`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 transition"
                    >
                      <span>Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    {accounts.length > 1 && (
                      <button
                        onClick={() => handleDeleteAccount(acc.id, acc.account_name)}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition"
                        title="Disconnect profile"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {accounts.length === 0 && !loading && (
            <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center space-y-4">
              <PlatformIcon platform="Instagram" className="h-12 w-12 mx-auto text-zinc-500" />
              <div>
                <h3 className="text-base font-bold text-white">No Instagram Profiles Connected</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                  Connect your Instagram Business or Creator account to enable autonomous publishing.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition"
              >
                + Connect Your First Profile
              </button>
            </div>
          )}
        </div>

        {/* Footnote */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Tokens are securely stored in Supabase <code className="text-zinc-300 font-mono">social_integrations</code></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            <span>Auto-Publish Scheduler runs every 1 minute</span>
          </div>
        </div>
      </div>

      {/* Other Channels Roadmap */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
          Upcoming Connectors
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Facebook */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <PlatformIcon platform="Facebook" className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Ready (Page Linked)
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Facebook Pages</h4>
            <p className="mt-1 text-xs text-zinc-400">
              Synced via WorknAI Media Facebook Page ID 1369626656226358.
            </p>
          </div>

          {/* YouTube */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl opacity-75">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-400 border border-red-500/20">
                <PlatformIcon platform="YouTube" className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                Roadmap
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">YouTube Shorts</h4>
            <p className="mt-1 text-xs text-zinc-400">
              Google Cloud OAuth 2.0 connector for direct 4K Shorts deployment.
            </p>
          </div>

          {/* LinkedIn */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl opacity-75">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600/10 text-sky-400 border border-sky-500/20">
                <PlatformIcon platform="LinkedIn" className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                Roadmap
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">LinkedIn Company</h4>
            <p className="mt-1 text-xs text-zinc-400">
              B2B thought leadership articles & video dispatches.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Connect New Instagram Account */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-900">
                    <PlatformIcon platform="Instagram" className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Add Instagram Account</h3>
                  <p className="text-xs text-zinc-400">Connect a new Business or Creator profile via Meta API</p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-white/10 p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Error Notification in Modal */}
            {modalError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 break-words">{modalError}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddAccountSubmit} className="space-y-4">
              {/* Account Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-400" />
                  <span>Account Username / Handle *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm text-zinc-500">@</span>
                  <input
                    type="text"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value.replace(/^@/, ""))}
                    placeholder="my_brand_name"
                    className="w-full rounded-xl border border-white/10 bg-black/50 py-2.5 pl-8 pr-4 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">Your Instagram username without the '@'.</p>
              </div>

              {/* Account ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-blue-400" />
                  <span>Instagram Account ID *</span>
                </label>
                <input
                  type="text"
                  required
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value.trim())}
                  placeholder="e.g. 17841400000000000 or 28517787071171649"
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none font-mono transition"
                />
                <p className="text-[11px] text-zinc-500">Instagram User ID or Business ID from Meta Graph API Explorer.</p>
              </div>

              {/* Access Token */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-blue-400" />
                  <span>Long-Lived Access Token *</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value.trim())}
                  placeholder="Paste your Instagram Access Token (starts with IGAA... or EA...)"
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none font-mono transition"
                />
                <p className="text-[11px] text-zinc-500">Must have permissions: instagram_basic, instagram_content_publish.</p>
              </div>

              {/* Set as Default Option */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="setDefault"
                  checked={setAsDefault}
                  onChange={(e) => setSetAsDefault(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/50 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="setDefault" className="text-xs text-zinc-300 font-medium cursor-pointer">
                  Set as Primary Active Account (default for scheduling)
                </label>
              </div>

              {/* Helper collapsible */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-zinc-400 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center justify-between w-full font-medium text-blue-400 hover:text-blue-300"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5" />
                    How to get these credentials?
                  </span>
                  <span>{showHelp ? "▲" : "▼"}</span>
                </button>

                {showHelp && (
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-400 pt-1 border-t border-white/5">
                    <li>Make sure the Instagram account is set to <strong>Professional (Business or Creator)</strong>.</li>
                    <li>Add the account as <strong>Instagram Tester</strong> in Meta Developer App Roles.</li>
                    <li>Accept the invitation in Instagram App &gt; Settings &gt; Apps &amp; Websites.</li>
                    <li>In <strong>Meta Graph API Explorer</strong>, select User Token with <code className="text-zinc-200">instagram_basic</code> &amp; <code className="text-zinc-200">instagram_content_publish</code>.</li>
                  </ol>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:brightness-110 transition disabled:opacity-50"
                >
                  {isSubmitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isSubmitting ? "Verifying with Meta..." : "Verify & Connect Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
