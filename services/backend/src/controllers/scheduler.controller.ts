import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { checkAndPublishScheduledPosts } from "../worker/cron.worker";

/* ===========================
   SCHEDULER CONTROLLER
=========================== */

// GET Scheduler data (Calendar events, today's posts, upcoming, and stats)
export const getSchedulerOverview = async (req: Request, res: Response) => {
  try {
    const { type, status } = req.query;

    let query = supabase
      .from("posts")
      .select("*")
      .order("scheduled_at", { ascending: true, nullsFirst: false });

    if (type && typeof type === "string") {
      query = query.eq("type", type);
    }

    if (status && typeof status === "string") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    const posts = data || [];

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Segment data for easy frontend consumption
    const todayPosts = posts.filter((p) => {
      if (!p.scheduled_at) return false;
      const d = new Date(p.scheduled_at);
      return d >= startOfToday && d <= endOfToday;
    });

    const upcomingPosts = posts.filter((p) => {
      if (p.status !== "scheduled" || !p.scheduled_at) return false;
      return new Date(p.scheduled_at) > new Date();
    });

    const publishedPosts = posts.filter((p) => p.status === "published");
    const draftPosts = posts.filter((p) => p.status === "draft");

    res.json({
      success: true,
      stats: {
        total: posts.length,
        scheduled: posts.filter((p) => p.status === "scheduled").length,
        published: publishedPosts.length,
        today: todayPosts.length,
        draft: draftPosts.length,
      },
      posts,
      todayPosts,
      upcomingPosts,
      publishedPosts,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Manually trigger auto-publish check
export const triggerPublishCheck = async (_req: Request, res: Response) => {
  try {
    const published = await checkAndPublishScheduledPosts();
    res.json({
      success: true,
      message: `Triggered auto-publish check. Published ${published.length} post(s).`,
      newlyPublished: published,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Reschedule or update scheduled time
export const reschedulePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { scheduled_at, status } = req.body;

    if (!scheduled_at && status !== "draft") {
      return res.status(400).json({ success: false, error: "scheduled_at is required" });
    }

    const updatePayload: Record<string, any> = {};
    if (scheduled_at !== undefined) updatePayload.scheduled_at = scheduled_at;
    if (status !== undefined) updatePayload.status = status;
    else updatePayload.status = "scheduled";

    const { data, error } = await supabase
      .from("posts")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      message: "Post rescheduled successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Check Instagram Integration Status
export const getInstagramStatus = async (_req: Request, res: Response) => {
  try {
    const { checkInstagramConnection } = await import("../lib/instagram.service");
    const status = await checkInstagramConnection();
    res.json({ success: true, ...status });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// List all Instagram accounts
export const getInstagramAccounts = async (_req: Request, res: Response) => {
  try {
    const { data: accounts, error } = await supabase
      .from("social_integrations")
      .select("id, platform, account_id, account_name, connected, is_default, created_at, updated_at")
      .eq("platform", "instagram")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, accounts: accounts || [] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add or connect new Instagram account
export const addInstagramAccount = async (req: Request, res: Response) => {
  try {
    const { account_name, account_id, access_token, set_as_default } = req.body;
    const appId = process.env.META_APP_ID || process.env.INSTAGRAM_APP_ID || "1054238947409813";

    if (!account_name || !account_id || !access_token) {
      return res.status(400).json({
        success: false,
        error: "account_name, account_id, and access_token are required.",
      });
    }

    // 1. Verify token with Meta API
    const { verifyInstagramCredentials } = await import("../lib/instagram.service");
    const verification = await verifyInstagramCredentials(access_token);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        error: `Meta validation failed: ${verification.error}`,
      });
    }

    const { encryptToken } = await import("../lib/encryption");
    const encryptedToken = encryptToken(access_token.trim());

    // 2. If set_as_default is true, unset other defaults
    if (set_as_default) {
      await supabase
        .from("social_integrations")
        .update({ is_default: false, is_primary: false })
        .eq("platform", "instagram");
    }

    // 3. Check if account already exists
    const { data: existing } = await supabase
      .from("social_integrations")
      .select("id")
      .eq("platform", "instagram")
      .or(`account_id.eq.${account_id.trim()},instagram_id.eq.${account_id.trim()}`)
      .maybeSingle();

    let savedAccount: any = null;
    const cleanHandle = account_name.trim().replace(/^@/, "");

    if (existing) {
      const { data, error } = await supabase
        .from("social_integrations")
        .update({
          account_name: cleanHandle,
          username: cleanHandle,
          instagram_id: account_id.trim(),
          access_token: encryptedToken,
          app_id: appId,
          connected: true,
          status: "connected",
          is_default: set_as_default !== undefined ? Boolean(set_as_default) : false,
          is_primary: set_as_default !== undefined ? Boolean(set_as_default) : false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return res.status(500).json({ success: false, error: error.message });
      savedAccount = data;
    } else {
      const { data, error } = await supabase
        .from("social_integrations")
        .insert({
          platform: "instagram",
          account_id: account_id.trim(),
          instagram_id: account_id.trim(),
          account_name: cleanHandle,
          username: cleanHandle,
          display_name: cleanHandle,
          access_token: encryptedToken,
          app_id: appId,
          connected: true,
          status: "connected",
          is_default: set_as_default !== undefined ? Boolean(set_as_default) : false,
          is_primary: set_as_default !== undefined ? Boolean(set_as_default) : false,
          connected_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return res.status(500).json({ success: false, error: error.message });
      savedAccount = data;
    }

    res.json({
      success: true,
      message: `Instagram profile @${account_name.replace(/^@/, "")} connected successfully! 🚀`,
      account: savedAccount,
      verifiedAccount: verification.account,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Set account as default
export const setDefaultInstagramAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Unset other defaults
    await supabase
      .from("social_integrations")
      .update({ is_default: false, is_primary: false })
      .eq("platform", "instagram");

    // Set this one as default
    const { data, error } = await supabase
      .from("social_integrations")
      .update({ is_default: true, is_primary: true, connected: true, status: "connected" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      message: `Account set as primary default`,
      account: data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete / Disconnect account
export const deleteInstagramAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("social_integrations")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      message: "Instagram profile disconnected successfully",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Test publish a post or image to Instagram
export const testPublishToInstagram = async (req: Request, res: Response) => {
  try {
    const { publishToInstagram } = await import("../lib/instagram.service");
    const { title = "WorknAI Test Post", content = "Automated post from WorknAI Media OS", media_url = "https://picsum.photos/800/800", type = "image" } = req.body || {};

    const result = await publishToInstagram({
      id: "test-" + Date.now(),
      title,
      content,
      media_url,
      type,
    });

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.json({
      success: true,
      message: "Test post published to Instagram successfully! 🚀",
      metaPostId: result.metaPostId,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};


