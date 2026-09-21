import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { supabase } from "../lib/supabase";

/* ===========================
   USERS CRUD CONTROLLER
=========================== */

// GET Users (Never returns password hashes)
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, role, created_at")
            .order("created_at");

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.json({ success: true, data });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// CREATE User
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, role, password } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, error: "Name and email are required" });
        }

        const assignedRole = role && ["admin", "employee", "client"].includes(role) ? role : "employee";
        const rawPassword = password || "worknai123";

        // Hash password with bcrypt cost factor 12
        const hashedPassword = await bcrypt.hash(rawPassword, 12);

        const { data, error } = await supabase
            .from("users")
            .insert([{
                name,
                email: email.trim().toLowerCase(),
                role: assignedRole,
                password: hashedPassword,
            }])
            .select("id, name, email, role, created_at");

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: data?.[0],
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// UPDATE User
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        const updateData: Record<string, any> = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email.trim().toLowerCase();
        if (role !== undefined) updateData.role = role;
        if (password && password.trim().length > 0) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const { data, error } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", id)
            .select("id, name, email, role, created_at");

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.json({
            success: true,
            message: "User updated successfully",
            data: data?.[0],
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// DELETE User
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabase.from("users").delete().eq("id", id);

        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }

        res.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};