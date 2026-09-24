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
  Layers,
  Sparkles,
  Link2,
  Unlink,
} from "lucide-react";
import PlatformIcon from "@/components/dashboard/scheduler/PlatformIcon";

interface BrandItem {
  id: number | string;
  name: string;
  website?: string | null;
  logo?: string | null;
}

interface InstagramIntegration {
  id: string;
  platform: string;
  instagram_id: string;
  username: string;
  display_name: string;
  profile_picture?: string | null;
  expires_at?: string | null;
  connected_at?: string;
  is_primary: boolean;
  status: "connected" | "reconnect_required" | "disconnected" | string;
  connected: boolean;
}

interface BrandCardItem {
  brand: BrandItem | null;
  integration: InstagramIntegration | null;
}

export default function IntegrationsPage() {
  const [loading, setLoading] = useState(true);
  const [brandCards, setBrandCards] = useState<BrandCardItem[]>([]);
  const [availableBrands, setAvailableBrands] = useState<BrandItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testPublishing, setTestPublishing] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Simplified Modal State (Brand Dropdown + Connect Instagram Button ONLY)
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [isStartingOAuth, setIsStartingOAuth] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (hasBody = false): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (hasBody) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // Load all brands and connected integrations
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch integrations overview with brand mappings
      const res = await fetch(`${apiBase}/integrations`, {
        cache: "no-store",
        headers: getHeaders(),
      });
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setBrandCards(json.data);
      } else {
        // Fallback to legacy scheduler endpoint if needed
        const legacyRes = await fetch(`${apiBase}/scheduler/instagram/accounts`, {
          cache: "no-store",
          headers: getHeaders(),
        });
        const legacyJson = await legacyRes.json();
        if (legacyJson.success) {
          const mapped = (legacyJson.accounts || []).map((acc: any) => ({
            brand: { id: acc.account_id, name: acc.account_name },
            integration: {
              id: acc.id,
              platform: "instagram",
              instagram_id: acc.account_id,
              username: acc.account_name,
              display_name: acc.account_name,
              is_primary: acc.is_default,
              status: acc.connected ? "connected" : "disconnected",
              connected: acc.connected,
              created_at: acc.created_at,
            },
          }));
          setBrandCards(mapped);
        }
      }

      // 2. Fetch list of clients/brands for the modal dropdown
      const clientsRes = await fetch(`${apiBase}/clients`, {
        cache: "no-store",
        headers: getHeaders(),
      });
      const clientsJson = await clientsRes.json();
      if (clientsJson.success && Array.isArray(clientsJson.data)) {
        setAvailableBrands(clientsJson.data);
        if (clientsJson.data.length > 0 && !selectedBrandId) {
          setSelectedBrandId(String(clientsJson.data[0].id));
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load social integrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Listen for OAuth completion message from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "INSTAGRAM_OAUTH_SUCCESS") {
        setShowAddModal(false);
        setIsStartingOAuth(false);
        const username = event.data.account?.username;
        setTestResult(`🎉 Successfully connected @${username || "Instagram profile"} with 60-day auto-refresh token!`);
        loadData();
      } else if (event.data?.type === "INSTAGRAM_OAUTH_FAILURE") {
        setIsStartingOAuth(false);
        setModalError(event.data.error || "Instagram authorization failed.");
        loadData();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleRefresh = async () => {
    setTesting(true);
    setTestResult(null);
    await loadData();
    setTesting(false);
  };

  // Launch 1-Click Instagram OAuth Popup
  const startOAuthFlow = async (brandId?: string | number) => {
    setModalError(null);
    setIsStartingOAuth(true);

    const targetBrand = brandId !== undefined ? String(brandId) : selectedBrandId;

    try {
      const width = 600;
      const height = 750;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      // Open blank popup immediately to avoid browser popup blockers
      const popup = window.open(
        "about:blank",
        "InstagramConnectPopup",
        `width=${width},height=${height},left=${left},top=${top},status=0,toolbar=0,menubar=0,location=1`
      );

      if (!popup) {
        throw new Error("Popup blocked by browser. Please allow popups for this site.");
      }

      popup.document.write(`
        <html>
          <body style="background: #09090b; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <div style="text-align: center;">
              <h3 style="margin-bottom: 8px;">Connecting to Instagram...</h3>
              <p style="color: #a1a1aa; font-size: 13px;">Redirecting to Meta Instagram Login</p>
            </div>
          </body>
        </html>
      `);

      // Fetch signed authorization URL from backend
      const res = await fetch(`${apiBase}/oauth/instagram/start?brand_id=${encodeURIComponent(targetBrand)}`, {
        headers: getHeaders(),
      });
      const data = await res.json();

      if (!data.success || !data.authUrl) {
        popup.close();
        throw new Error(data.error || "Failed to generate Meta Instagram authorization link.");
      }

      // Redirect popup to Meta OAuth
      popup.location.href = data.authUrl;
    } catch (err: any) {
      setModalError(err.message || "Failed to start Instagram authorization.");
    } finally {
      setIsStartingOAuth(false);
    }
  };

  // Set account as primary default
  const handleSetPrimary = async (id: string, name: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`${apiBase}/integrations/${id}/primary`, {
        method: "PUT",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(`@${name} is now the primary active Instagram account.`);
        await loadData();
      } else {
        alert(data.error || "Failed to set primary account");
      }
    } catch (err: any) {
      alert(err.message || "Request failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Refresh Instagram Profile (Avatar, username, display name)
  const handleRefreshProfile = async (id: string, name: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`${apiBase}/integrations/${id}/refresh-profile`, {
        method: "POST",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(`Refreshed live Instagram profile for @${name}`);
        await loadData();
      } else {
        alert(data.error || "Failed to refresh profile");
      }
    } catch (err: any) {
      alert(err.message || "Request failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Disconnect Instagram Account
  const handleDisconnect = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to disconnect @${name}? You can reconnect anytime with 1 click.`)) return;

    setActionLoadingId(id);
    try {
      const res = await fetch(`${apiBase}/integrations/${id}/disconnect`, {
        method: "POST",
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
    } finally {
      setActionLoadingId(null);
    }
  };

  // Permanently delete Instagram Account record
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete @${name}? You will need to connect it again from scratch.`)) return;

    setActionLoadingId(id);
    try {
      const res = await fetch(`${apiBase}/integrations/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(`@${name} has been deleted.`);
        await loadData();
      } else {
        alert(data.error || "Failed to delete account");
      }
    } catch (err: any) {
      alert(err.message || "Request failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Live test post
  const handleTestPublish = async (brandName: string, accName?: string) => {
    const target = accName || brandName;
    if (!confirm(`Publish a live test photo to @${target} on Instagram?`)) return;

    setTestPublishing(target);
    setTestResult(null);
    try {
      const res = await fetch(`${apiBase}/scheduler/instagram/test`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({
          title: `WorknAI Media OS Live Test 🚀 [${brandName}]`,
          content: `Autonomous test dispatch from WorknAI Media OS for ${brandName}.\n\n#WorknAI #MarketingOS #AIStudio #Automation`,
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

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>Instagram 1-Click OAuth</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Connected Channels & Profiles
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage authenticated Instagram Business accounts, 60-day auto-refreshing tokens, and autonomous brand dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setModalError(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:brightness-110 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Connect Instagram</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={testing}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 transition disabled:opacity-50 cursor-pointer"
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
            testResult.startsWith("Success") || testResult.includes("🎉") || testResult.includes("primary") || testResult.includes("Refreshed")
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/30 bg-amber-500/10 text-amber-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{testResult}</span>
          </div>
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
            <span>Managed Brand Integrations</span>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-xs text-blue-400 font-mono">
              {brandCards.length}
            </span>
          </h2>
          <span className="text-xs text-zinc-400">
            Tokens auto-refresh daily before 60-day expiry. No manual token paste required.
          </span>
        </div>

        {/* Brand Integration Cards Grid */}
        <div className="grid grid-cols-1 gap-5">
          {brandCards.map((item, idx) => {
            const brand = item.brand;
            const integration = item.integration;
            const isConnected = Boolean(integration && integration.connected && integration.status === "connected");
            const isReconnectRequired = Boolean(integration && integration.status === "reconnect_required");
            const isPrimary = Boolean(integration && integration.is_primary);

            const brandName = brand?.name || integration?.display_name || "Managed Brand";
            const brandHandle = integration?.username ? `@${integration.username}` : brand?.website ? brand.website.replace(/^https?:\/\//, "") : null;

            return (
              <div
                key={integration?.id || `brand-${brand?.id || idx}`}
                className={`rounded-3xl border p-6 backdrop-blur-2xl transition relative overflow-hidden ${
                  isPrimary
                    ? "border-blue-500/40 bg-gradient-to-b from-[#0F172A] to-[#070D1D] shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                    : isConnected
                    ? "border-white/10 bg-white/[0.03] hover:border-white/20"
                    : "border-white/5 bg-black/30 hover:border-white/15"
                }`}
              >
                {/* Glow for Primary Default */}
                {isPrimary && (
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
                )}

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
                  <div className="flex items-start gap-4">
                    {/* Platform & Avatar Icon */}
                    <div className="relative shrink-0">
                      {integration?.profile_picture ? (
                        <img
                          src={integration.profile_picture}
                          alt={brandName}
                          className="h-14 w-14 rounded-2xl object-cover border border-white/10 shadow-lg shadow-purple-500/10"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-rose-500/20">
                          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0A0E1A]">
                            <PlatformIcon platform="Instagram" className="h-7 w-7 text-white" />
                          </div>
                        </div>
                      )}
                      {isConnected && (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#0A0E1A]">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-white tracking-wide">
                          {brandName}
                        </h3>

                        {/* Status Badges */}
                        {isConnected ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <CheckCircle2 className="h-3 w-3" />
                            Connected
                          </span>
                        ) : isReconnectRequired ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
                            <AlertCircle className="h-3 w-3" />
                            Reconnect Required
                          </span>
                        ) : (
                          <span className="rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
                            Not Connected
                          </span>
                        )}

                        {isPrimary && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blue-300">
                            <Star className="h-3 w-3 fill-blue-400" />
                            Primary Account
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300">
                          Meta Instagram OAuth
                        </span>
                      </div>

                      {/* Subtitle / Handle */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
                        {brandHandle && (
                          <span className="text-zinc-300 font-medium font-mono">
                            {brandHandle}
                          </span>
                        )}
                        {integration?.instagram_id && (
                          <span>
                            ID: <code className="text-zinc-400 font-mono">{integration.instagram_id}</code>
                          </span>
                        )}
                        {integration?.expires_at && (
                          <span className="text-zinc-400">
                            Expires: <span className="text-zinc-300">{new Date(integration.expires_at).toLocaleDateString()}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for this Card */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {integration && isConnected ? (
                      <>
                        {/* Set as Primary */}
                        {!isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(integration.id, integration.username)}
                            disabled={actionLoadingId === integration.id}
                            className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition cursor-pointer"
                          >
                            Set as Primary
                          </button>
                        )}

                        {/* Test Publish */}
                        <button
                          onClick={() => handleTestPublish(brandName, integration.username)}
                          disabled={testPublishing === integration.username}
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 hover:from-rose-500 hover:to-purple-500 transition disabled:opacity-50 cursor-pointer"
                        >
                          <Send className={`h-3 w-3 ${testPublishing === integration.username ? "animate-bounce" : ""}`} />
                          <span>{testPublishing === integration.username ? "Publishing..." : "Test Reel"}</span>
                        </button>

                        {/* Refresh Profile */}
                        <button
                          onClick={() => handleRefreshProfile(integration.id, integration.username)}
                          disabled={actionLoadingId === integration.id}
                          className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 transition cursor-pointer"
                          title="Refresh avatar and profile name from Instagram"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${actionLoadingId === integration.id ? "animate-spin" : ""}`} />
                          <span>Refresh Profile</span>
                        </button>

                        {/* View Profile on Instagram */}
                        <a
                          href={`https://www.instagram.com/${integration.username}/`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 transition"
                        >
                          <span>Profile</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>

                        {/* Disconnect Button */}
                        <button
                          onClick={() => handleDisconnect(integration.id, integration.username)}
                          disabled={actionLoadingId === integration.id}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                          title="Disconnect Instagram profile"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Not Connected or Reconnect Required: 1-Click Connect Button */}
                        <button
                          onClick={() => startOAuthFlow(brand?.id)}
                          disabled={isStartingOAuth}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/20 hover:brightness-110 transition cursor-pointer"
                        >
                          <PlatformIcon platform="Instagram" className="h-4 w-4 text-white" />
                          <span>{isReconnectRequired ? "Reconnect Instagram" : "Connect Instagram"}</span>
                        </button>

                        {/* Permanently remove a disconnected account record */}
                        {integration && (
                          <button
                            onClick={() => handleDelete(integration.id, integration.username)}
                            disabled={actionLoadingId === integration.id}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                            title="Delete Instagram account permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {brandCards.length === 0 && !loading && (
            <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center space-y-4">
              <PlatformIcon platform="Instagram" className="h-12 w-12 mx-auto text-zinc-500" />
              <div>
                <h3 className="text-base font-bold text-white">No Brands or Profiles Found</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                  Connect your Instagram Business or Creator account to start publishing reels automatically.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                + Connect Instagram
              </button>
            </div>
          )}
        </div>

        {/* Security & Automation Notice */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Tokens are AES-256 encrypted and auto-refreshed daily before 60-day expiry.</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            <span>Autonomous Reels Publisher runs every 1 minute</span>
          </div>
        </div>
      </div>

      {/* Upcoming Connectors Section */}
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

      {/* Streamlined Modal: Brand Dropdown + Connect Instagram Button ONLY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-900">
                    <PlatformIcon platform="Instagram" className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Connect Instagram</h3>
                  <p className="text-xs text-zinc-400">1-Click Meta Authorization</p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-white/10 p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
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

            {/* Form: Brand Selection + 1-Click Connect Button */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  <span>Select Brand / Client *</span>
                </label>
                <select
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/90 p-3 text-sm text-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
                >
                  {availableBrands.map((b) => (
                    <option key={b.id} value={String(b.id)}>
                      {b.name}
                    </option>
                  ))}
                  {availableBrands.length === 0 && (
                    <option value="">No brands found (creates global profile)</option>
                  )}
                </select>
                <p className="text-[11px] text-zinc-400">
                  Select which Brand will be linked to this Instagram channel.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-zinc-400 space-y-2">
                <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Automatic Authorization</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Clicking below will open the official Instagram Login popup. Simply sign in and click <strong>Allow</strong>. All tokens and profile details are exchanged and stored automatically.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => startOAuthFlow(selectedBrandId)}
                  disabled={isStartingOAuth}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/25 hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
                >
                  {isStartingOAuth ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <PlatformIcon platform="Instagram" className="h-4 w-4 text-white" />
                  )}
                  <span>{isStartingOAuth ? "Opening Meta..." : "Connect Instagram"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
