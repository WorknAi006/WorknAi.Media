import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

/* ===========================
   SERVICES CRUD CONTROLLER
=========================== */

// Helper to auto-generate slug from title
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// GET Services (Filterable by category, status, featured)
export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, status, featured } = req.query;

    let query = supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true })
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

    res.json({
      success: true,
      data: data || [],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET Single Service by ID or Slug
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const query = supabase.from("services").select("*");

    const { data, error } = isUUID
      ? await query.eq("id", id).maybeSingle()
      : await query.eq("slug", id).maybeSingle();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    if (!data) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE Service
export const createService = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      short_description = "",
      description = "",
      category = "AI Production",
      icon = "Sparkles",
      cover_image = null,
      featured = false,
      status = "draft",
      display_order = 0,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Service title is required",
      });
    }

    const resolvedSlug = slug?.trim() ? slugify(slug) : slugify(title);

    const payload = {
      title: title.trim(),
      slug: resolvedSlug,
      short_description: short_description || "",
      description: description || "",
      category: category || "AI Production",
      icon: icon || "Sparkles",
      cover_image: cover_image || null,
      featured: Boolean(featured),
      status: status || "draft",
      display_order: Number(display_order) || 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("services")
      .insert([payload])
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: data?.[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE Service
export const updateService = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const {
      title,
      slug,
      short_description,
      description,
      category,
      icon,
      cover_image,
      featured,
      status,
      display_order,
    } = req.body;

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updatePayload.title = title.trim();
    if (slug !== undefined) updatePayload.slug = slugify(slug);
    if (short_description !== undefined) updatePayload.short_description = short_description;
    if (description !== undefined) updatePayload.description = description;
    if (category !== undefined) updatePayload.category = category;
    if (icon !== undefined) updatePayload.icon = icon;
    if (cover_image !== undefined) updatePayload.cover_image = cover_image || null;
    if (featured !== undefined) updatePayload.featured = Boolean(featured);
    if (status !== undefined) updatePayload.status = status;
    if (display_order !== undefined) updatePayload.display_order = Number(display_order);

    const { data, error } = await supabase
      .from("services")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, error: "Service not found or update failed" });
    }

    res.json({
      success: true,
      message: "Service updated successfully",
      data: data?.[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE Service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
