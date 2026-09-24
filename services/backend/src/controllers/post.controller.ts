import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

/* ===========================
   POSTS / REELS CRUD CONTROLLER
=========================== */

// GET Posts (Filterable by type e.g. 'reel' | 'blog' & status & brand)
export const getPosts = async (req: Request, res: Response) => {
    try {
        const { type, status, brand } = req.query;

        let query = supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (type && typeof type === "string") {
            query = query.eq("type", type);
        }

        if (status && typeof status === "string") {
            query = query.eq("status", status);
        }

        if (brand && typeof brand === "string" && brand !== "All") {
            query = query.eq("brand", brand);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        const normalizedData = (data || []).map((item: any) => ({
            ...item,
            cover_url: item.thumbnail || item.media_url || null,
            platforms: Array.isArray(item.platforms) ? item.platforms : [],
        }));

        res.json({ success: true, data: normalizedData });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const includesInstagram = (platforms: unknown): boolean =>
    Array.isArray(platforms) && platforms.some((p) => String(p).toLowerCase() === "instagram");

// CREATE Post / Reel
export const createPost = async (req: Request, res: Response) => {
    try {
        const {
            title,
            slug,
            type = "reel",
            content = "",
            media_url = null,
            thumbnail = null,
            cover_url = null,
            status = "draft",
            scheduled_at = null,
            brand = null,
            platforms = [],
        } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, error: "Title is required" });
        }

        const resolvedSlug =
            slug && slug.trim().length > 0
                ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
                : `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

        const resolvedThumbnail = thumbnail || cover_url || media_url || null;
        const resolvedMediaUrl = media_url || cover_url || thumbnail || null;

        const resolvedPlatforms = Array.isArray(platforms) ? platforms : platforms ? [platforms] : [];

        // "Go live now" on Instagram: queue it for the scheduler worker, which publishes within a minute
        // and marks it published only after Instagram accepts it
        const publishNowToInstagram = status === "published" && includesInstagram(resolvedPlatforms);

        const payload = {
            title,
            slug: resolvedSlug,
            type,
            content,
            media_url: resolvedMediaUrl,
            thumbnail: resolvedThumbnail,
            status: publishNowToInstagram ? "scheduled" : status,
            scheduled_at: publishNowToInstagram
                ? new Date().toISOString()
                : status === "scheduled" ? scheduled_at : null,
            brand: brand || null,
            platforms: resolvedPlatforms,
        };

        const { data, error } = await supabase
            .from("posts")
            .insert([payload])
            .select();

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// UPDATE Post / Reel
export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            title,
            slug,
            type,
            content,
            media_url,
            thumbnail,
            status,
            scheduled_at,
            brand,
            platforms,
        } = req.body;

        const updateData: Record<string, any> = {};
        if (title !== undefined) updateData.title = title;
        if (slug !== undefined) updateData.slug = slug;
        if (type !== undefined) updateData.type = type;
        if (content !== undefined) updateData.content = content;
        if (brand !== undefined) updateData.brand = brand || null;
        if (platforms !== undefined) {
            updateData.platforms = Array.isArray(platforms) ? platforms : platforms ? [platforms] : [];
        }
        const cover_url = (req.body as any).cover_url;
        if (media_url !== undefined) updateData.media_url = media_url;
        if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
        if (cover_url !== undefined) {
            updateData.thumbnail = cover_url;
            updateData.media_url = cover_url;
        }
        if (status !== undefined) {
            updateData.status = status;
            updateData.scheduled_at = status === "scheduled" ? scheduled_at : null;
        } else if (scheduled_at !== undefined) {
            updateData.scheduled_at = scheduled_at;
        }

        // Switching to "published" on Instagram: queue it once, unless it is already live there
        if (status === "published") {
            const { data: current } = await supabase
                .from("posts")
                .select("platforms, meta_post_id")
                .eq("id", id)
                .single();

            if (current && !current.meta_post_id && includesInstagram(updateData.platforms ?? current.platforms)) {
                updateData.status = "scheduled";
                updateData.scheduled_at = new Date().toISOString();
            }
        }

        const { data, error } = await supabase
            .from("posts")
            .update(updateData)
            .eq("id", id)
            .select();

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.json({
            success: true,
            message: "Post updated successfully",
            data,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// DELETE Post / Reel
export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabase.from("posts").delete().eq("id", id);

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};
