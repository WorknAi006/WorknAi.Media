import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

/* ===========================
   LEADS CRUD CONTROLLER
=========================== */

// GET Leads
export const getLeads = async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.json({ success: true, data: data || [] });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// CREATE Lead
export const createLead = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, message, status = "new" } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, error: "Name and email are required" });
        }

        const { data, error } = await supabase
            .from("leads")
            .insert([{ name, email, phone, message, status }])
            .select();

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            data: data?.[0],
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// UPDATE Lead (e.g. status)
export const updateLead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, name, email, phone, message } = req.body;

        const updateData: Record<string, any> = {};
        if (status !== undefined) updateData.status = status;
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (message !== undefined) updateData.message = message;

        const { data, error } = await supabase
            .from("leads")
            .update(updateData)
            .eq("id", id)
            .select();

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.json({
            success: true,
            message: "Lead updated successfully",
            data: data?.[0],
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// DELETE Lead
export const deleteLead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabase.from("leads").delete().eq("id", id);

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.json({
            success: true,
            message: "Lead deleted successfully",
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};
