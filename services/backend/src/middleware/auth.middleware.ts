import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing.");
}

export interface JwtUserPayload {
  id: string;
  email: string;
  role: "admin" | "employee" | "client";
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

/**
 * Generate a signed JWT token with 7-day expiry
 */
export const generateToken = (user: {
  id: string | number;
  email: string;
  role: "admin" | "employee" | "client" | string;
}): string => {
  // DB values may differ in case/whitespace ("Admin", " admin ")
  const rawRole = String(user.role ?? "").trim().toLowerCase();
  const role: "admin" | "employee" | "client" =
    rawRole === "admin" ? "admin" : rawRole === "employee" ? "employee" : "client";

  const payload: JwtUserPayload = {
    id: String(user.id),
    email: user.email,
    role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Middleware to verify JWT token and extract user id & role
 * Returns HTTP 401 for missing, expired, or invalid tokens
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required: Missing or invalid authorization token",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch (err: unknown) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed: Invalid or expired token",
    });
  }
};

/**
 * Role-Based Access Control Middleware
 * Admin: Full access
 * Employee: Permitted actions
 * Returns HTTP 403 Forbidden for insufficient permissions
 */
export const requireRole = (allowedRoles: Array<"admin" | "employee" | "client">) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User context missing",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(", ")}]`,
      });
    }

    next();
  };
};

/**
 * Reusable helper: Only Admin can access
 */
export const requireAdmin = requireRole(["admin"]);

/**
 * Reusable helper: Admin or Employee can access
 */
export const requireEmployeeOrAdmin = requireRole(["admin", "employee"]);

