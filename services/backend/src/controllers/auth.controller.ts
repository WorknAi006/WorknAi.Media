import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { supabase } from "../lib/supabase";
import { generateToken } from "../middleware/auth.middleware";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        if (typeof password !== "string" || password.trim().length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // Security Hardening: Ignore any incoming role; public self-registration is strictly 'client'
        const assignedRole = "client";

        // Hash password with bcrypt cost factor 12
        const hashedPassword = await bcrypt.hash(password, 12);

        const { data, error } = await supabase
            .from("users")
            .insert([{
                name: typeof name === "string" ? name.trim() : name,
                email: typeof email === "string" ? email.trim().toLowerCase() : email,
                password: hashedPassword,
                role: assignedRole,
            }])
            .select("id, name, email, role, created_at");

        if (error) throw error;

        const createdUser = data?.[0];
        const token = createdUser ? generateToken(createdUser) : undefined;

        res.status(201).json({
            success: true,
            message: "User Registered ✅",
            token,
            data: createdUser,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Internal server error";
        res.status(500).json({
            success: false,
            message,
        });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, role, password")
            .eq("email", email.trim().toLowerCase())
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials: User not found",
            });
        }

        let isPasswordValid = false;
        try {
            isPasswordValid = await bcrypt.compare(password, data.password);
        } catch {
            isPasswordValid = false;
        }

        // Seamless legacy migration: if user account was stored with plaintext, upgrade to bcrypt hash
        if (!isPasswordValid && data.password === password) {
            isPasswordValid = true;
            try {
                const newHash = await bcrypt.hash(password, 12);
                await supabase.from("users").update({ password: newHash }).eq("id", data.id);
            } catch (upgradeErr) {
                console.warn("Could not upgrade plaintext password to bcrypt hash:", upgradeErr);
            }
        }

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials: Incorrect password",
            });
        }

        const user = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role || "employee",
        };

        const token = generateToken(user);

        res.json({
            success: true,
            message: "Login successful",
            token,
            user,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const email = req.query.email as string;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email parameter required" });
        }

        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, role, created_at")
            .eq("email", email)
            .maybeSingle();

        if (error || !data) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: data });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};