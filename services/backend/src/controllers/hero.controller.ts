import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

/* ===========================
   HERO CRUD CONTROLLER
=========================== */

// GET Hero
export const getHero = async (_req: Request, res: Response) => {
    const { data, error } = await supabase.from("hero").select("*").order("id");

    if (error) {
        return res.status(500).json({ success: false, error: error.message });
    }

    // Normalize substitle -> subtitle so frontend receives both smoothly
    const normalizedData = (data || []).map((item: any) => ({
        ...item,
        subtitle: item.subtitle ?? item.substitle ?? "",
    }));

    res.json({ success: true, data: normalizedData });
};

// CREATE Hero
export const createHero = async (req: Request, res: Response) => {
    const { title, subtitle, substitle, image_url, video_url, button_text } = req.body;
    const resolvedSubtitle = subtitle ?? substitle ?? "";

    const { data, error } = await supabase
        .from("hero")
        .insert([{ title, substitle: resolvedSubtitle, image_url, video_url, button_text }])
        .select();

    if (error) {
        return res.status(500).json({ success: false, error: error.message });
    }

    const normalizedData = (data || []).map((item: any) => ({
        ...item,
        subtitle: item.subtitle ?? item.substitle ?? "",
    }));

    res.status(201).json({
        success: true,
        message: "Hero created successfully",
        data: normalizedData,
    });
};

// UPDATE Hero
export const updateHero = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, subtitle, substitle, image_url, video_url, button_text } = req.body;
    const resolvedSubtitle = subtitle ?? substitle ?? "";

    const { data, error } = await supabase
        .from("hero")
        .update({ title, substitle: resolvedSubtitle, image_url, video_url, button_text })
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json({ success: false, error: error.message });
    }

    const normalizedData = (data || []).map((item: any) => ({
        ...item,
        subtitle: item.subtitle ?? item.substitle ?? "",
    }));

    res.json({
        success: true,
        message: "Hero updated successfully",
        data: normalizedData,
    });
};

// DELETE Hero
export const deleteHero = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { error } = await supabase.from("hero").delete().eq("id", id);

    if (error) {
        return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
        success: true,
        message: "Hero deleted successfully",
    });
};
