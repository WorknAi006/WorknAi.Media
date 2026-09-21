"use client";

import { useState, useEffect, useCallback } from "react";
import { ReelPost, PostStatus } from "./types";

export type ReelFilterStatus = "all" | PostStatus;

export function useReels(status: ReelFilterStatus = "all") {
  const [reels, setReels] = useState<ReelPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const loadReels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url =
        status && status !== "all"
          ? `${apiBase}/posts?type=reel&status=${status}`
          : `${apiBase}/posts?type=reel`;

      const res = await fetch(url, {
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReels(json.data);
      } else {
        setReels([]);
      }
    } catch (err: any) {
      console.error("Failed to load reels:", err);
      setError(err?.message || "Failed to load reels");
    } finally {
      setIsLoading(false);
    }
  }, [apiBase, status]);

  const deleteReel = useCallback(
    async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this reel?")) {
        return false;
      }
      try {
        await fetch(`${apiBase}/posts/${id}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
        await loadReels();
        return true;
      } catch (err: any) {
        console.error("Failed to delete reel:", err);
        return false;
      }
    },
    [apiBase, loadReels]
  );

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  return {
    reels,
    setReels,
    isLoading,
    error,
    loadReels,
    deleteReel,
  };
}
