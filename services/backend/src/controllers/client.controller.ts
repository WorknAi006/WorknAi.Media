import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

// GET all clients
export const getClients = async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from("clients")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        res.json({
            success: true,
            data: data || [],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// GET client by ID
export const getClientById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from("clients")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        res.json({
            success: true,
            data,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// CREATE new client / brand
export const createClient = async (req: Request, res: Response) => {
    try {
        const { name, website, logo } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Brand name is required",
            });
        }

        const { data, error } = await supabase
            .from("clients")
            .insert([{ name, website: website || "", logo: logo || "" }])
            .select();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: data?.[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// UPDATE client / brand URL & details
export const updateClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, website, logo } = req.body;

        const updatePayload: any = {};
        if (name !== undefined) updatePayload.name = name;
        if (website !== undefined) updatePayload.website = website;
        if (logo !== undefined) updatePayload.logo = logo;

        const { data, error } = await supabase
            .from("clients")
            .update(updatePayload)
            .eq("id", id)
            .select();

        if (error) throw error;

        res.json({
            success: true,
            message: "Brand updated successfully",
            data: data?.[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// DELETE client / brand
export const deleteClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("clients").delete().eq("id", id);

        if (error) throw error;

        res.json({
            success: true,
            message: "Brand deleted successfully",
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
