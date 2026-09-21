import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

/* ===========================
   PORTFOLIO CRUD CONTROLLER
=========================== */

// GET Portfolio items (Filterable by category, status, featured)
export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const { category, status, featured } = req.query;

    let query = supabase
      .from("portfolio")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && typeof category === "string" && category.toLowerCase() !== "all") {
      query = query.ilike("category", category);
    }

    if (status && typeof status === "string" && status.toLowerCase() !== "all") {
      query = query.eq("status", status);
    }

    if (featured !== undefined) {
      query = query.eq("featured", featured === "true");
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    // Normalize thumbnail/thumbnail_url
    const normalizedData = (data || []).map((item: any) => ({
      ...item,
      thumbnail_url: item.thumbnail_url || item.thumbnail || null,
    }));

    res.json({
      success: true,
      data: normalizedData,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE Portfolio project
export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const {
      client_name,
      project_title,
      category = "AI Videos",
      thumbnail_url = null,
      thumbnail = null,
      video_url = null,
      description = "",
      challenge = "",
      solution = "",
      results = "",
      featured = false,
      status = "published",
    } = req.body;

    if (!client_name || !project_title) {
      return res.status(400).json({
        success: false,
        error: "Client name and project title are required",
      });
    }

    const resolvedThumbnail = thumbnail_url || thumbnail || null;

    const payload = {
      client_name,
      project_title,
      category,
      thumbnail_url: resolvedThumbnail,
      thumbnail: resolvedThumbnail,
      video_url,
      description,
      challenge,
      solution,
      results,
      featured: Boolean(featured),
      status: status || "published",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("portfolio")
      .insert([payload])
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(201).json({
      success: true,
      message: "Portfolio project created successfully",
      data: data?.[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE Portfolio project
export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      client_name,
      project_title,
      category,
      thumbnail_url,
      thumbnail,
      video_url,
      description,
      challenge,
      solution,
      results,
      featured,
      status,
    } = req.body;

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (client_name !== undefined) updatePayload.client_name = client_name;
    if (project_title !== undefined) updatePayload.project_title = project_title;
    if (category !== undefined) updatePayload.category = category;
    if (thumbnail_url !== undefined || thumbnail !== undefined) {
      const resolvedThumb = thumbnail_url || thumbnail;
      updatePayload.thumbnail_url = resolvedThumb;
      updatePayload.thumbnail = resolvedThumb;
    }
    if (video_url !== undefined) updatePayload.video_url = video_url;
    if (description !== undefined) updatePayload.description = description;
    if (challenge !== undefined) updatePayload.challenge = challenge;
    if (solution !== undefined) updatePayload.solution = solution;
    if (results !== undefined) updatePayload.results = results;
    if (featured !== undefined) updatePayload.featured = Boolean(featured);
    if (status !== undefined) updatePayload.status = status;

    const { data, error } = await supabase
      .from("portfolio")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      message: "Portfolio project updated successfully",
      data: data?.[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE Portfolio project
export const deletePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("portfolio").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      message: "Portfolio project deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
