"use client";

import React, { useEffect, useState } from "react";
import { Globe, Plus, ExternalLink, Edit2, Trash2, Check, X, Sparkles } from "lucide-react";

export type ClientBrand = {
  id: number;
  name: string;
  website: string;
  logo?: string | null;
  created_at?: string;
};

export default function ClientsCMS() {
  const [brands, setBrands] = useState<ClientBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBrand, setEditingBrand] = useState<ClientBrand | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (hasBody = false): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (hasBody) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const loadBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/clients`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setBrands(json.data || []);
      }
    } catch (e) {
      console.error("Failed to load brands:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleStartEdit = (brand: ClientBrand) => {
    setEditingBrand(brand);
    setIsAdding(false);
    setName(brand.name);
    setWebsite(brand.website || "");
    setLogo(brand.logo || "");
    setMessage(null);
  };

  const handleStartAdd = () => {
    setEditingBrand(null);
    setIsAdding(true);
    setName("");
    setWebsite("https://");
    setLogo("");
    setMessage(null);
  };

  const handleCancel = () => {
    setEditingBrand(null);
    setIsAdding(false);
    setName("");
    setWebsite("");
    setLogo("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        // UPDATE
        const res = await fetch(`${apiBase}/clients/${editingBrand.id}`, {
          method: "PUT",
          headers: getHeaders(true),
          body: JSON.stringify({ name, website, logo }),
        });
        const json = await res.json();
        if (json.success) {
          setMessage(`✅ Updated ${name} successfully!`);
          handleCancel();
          loadBrands();
        }
      } else {
        // CREATE
        const res = await fetch(`${apiBase}/clients`, {
          method: "POST",
          headers: getHeaders(true),
          body: JSON.stringify({ name, website, logo }),
        });
        const json = await res.json();
        if (json.success) {
          setMessage(`✅ Added ${name} successfully!`);
          handleCancel();
          loadBrands();
        }
      }
    } catch (err: any) {
      setMessage(`❌ Failed to save: ${err.message}`);
    }
  };

  const handleDelete = async (id: number, brandName: string) => {
    if (!confirm(`Are you sure you want to delete ${brandName}?`)) return;
    try {
      const res = await fetch(`${apiBase}/clients/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        loadBrands();
      }
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Globe className="h-3.5 w-3.5" />
            <span>Ecosystem Brands & Client URLs</span>
          </div>
          <h1 className="text-3xl font-black text-white">Trending Brands Manager</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage live website redirect links and logos for all ecosystem brands. Changes update the homepage marquee instantly.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:brightness-110 transition w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      {message && (
        <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-3.5 text-xs font-semibold text-blue-300">
          {message}
        </div>
      )}

      {/* Add / Edit Form Modal or Inline Card */}
      {(editingBrand || isAdding) && (
        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-blue-500/30 bg-blue-500/5 p-6 backdrop-blur-xl shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>{editingBrand ? `Edit Brand: ${editingBrand.name}` : "Add New Brand"}</span>
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              className="text-zinc-400 hover:text-white text-xs"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Brand Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CarHub, LiveSale.Fitness"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Website URL (Redirect Link) *
              </label>
              <input
                type="url"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://carhub.in"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition shadow-md shadow-blue-500/25"
            >
              <Check className="h-4 w-4" />
              <span>{editingBrand ? "Save Changes" : "Create Brand"}</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Brands Table */}
      <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Configured Brands ({brands.length})
          </p>
          <span className="text-[11px] text-zinc-400">
            Clicking a brand on the landing page opens its target URL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/10 text-zinc-300 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Brand Name</th>
                <th className="p-4">Redirect URL</th>
                <th className="p-4 text-center">Visit Link</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4 font-bold text-white flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600/30 to-cyan-500/30 border border-blue-400/30 flex items-center justify-center text-xs font-black text-blue-300">
                      {b.name.charAt(0)}
                    </div>
                    <span>{b.name}</span>
                  </td>

                  <td className="p-4 text-xs font-mono text-cyan-300/90 max-w-xs truncate">
                    {b.website || <span className="text-zinc-500">No URL configured</span>}
                  </td>

                  <td className="p-4 text-center">
                    {b.website ? (
                      <a
                        href={b.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition"
                      >
                        <span>Open</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-zinc-600 text-xs">-</span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(b)}
                        className="rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit URL</span>
                      </button>

                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        className="rounded-lg bg-red-500/15 border border-red-500/30 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {brands.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500 text-sm">
                    No brands found in database. Click "Add New Brand" to configure one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
