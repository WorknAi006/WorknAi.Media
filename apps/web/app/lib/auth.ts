import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export interface JwtAuthUser {
  id: string;
  email: string;
  role: "admin" | "employee" | "client";
}

/**
 * Verifies JWT token on Edge runtime or Node.js runtime using `jose`
 */
export async function verifyAuthToken(token: string): Promise<JwtAuthUser | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("Critical: JWT_SECRET environment variable is missing");
    return null;
  }

  try {
    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret);

    const role = (payload.role as string) || "client";
    const validRole: "admin" | "employee" | "client" =
      role === "admin" ? "admin" : role === "employee" ? "employee" : "client";

    return {
      id: String(payload.id ?? ""),
      email: String(payload.email ?? ""),
      role: validRole,
    };
  } catch {
    return null;
  }
}

/**
 * Extracts JWT token from Authorization header or 'worknai_token' cookie
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1] ?? null;
  }

  return request.cookies.get("worknai_token")?.value ?? null;
}
