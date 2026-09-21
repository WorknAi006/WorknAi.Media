import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, extractTokenFromRequest } from "@/app/lib/auth";

const getSupabaseConfig = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  }
  return { supabaseUrl, supabaseKey };
};

/**
 * Security helper: Ensures caller has a valid JWT with the 'admin' role
 */
async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const token = extractTokenFromRequest(request);
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  const user = await verifyAuthToken(token);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, name, email, phone, whatsapp, company, service, brief, message } = body;

    const leadName = fullName || name || "Anonymous Partner";
    const leadEmail = email || "";
    const leadPhone = phone || whatsapp || "";
    const leadMessage = [
      company ? `Company: ${company}` : "",
      service ? `Interested Service: ${service}` : "",
      brief || message || "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const { supabaseUrl, supabaseKey } = getSupabaseConfig();

    // Direct REST insertion into Supabase public.leads table
    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        message: leadMessage,
        status: "new",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Supabase lead insertion warning:", errText);
    }

    return NextResponse.json({
      success: true,
      message: "Lead received and saved to Supabase successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit lead";
    console.error("Leads API error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { supabaseUrl, supabaseKey } = getSupabaseConfig();

    const response = await fetch(`${supabaseUrl}/rest/v1/leads?select=*&order=created_at.desc`, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ success: false, error: errText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing lead id" }, { status: 400 });
    }

    const { supabaseUrl, supabaseKey } = getSupabaseConfig();

    const response = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing lead id" }, { status: 400 });
    }

    const { supabaseUrl, supabaseKey } = getSupabaseConfig();

    await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    return NextResponse.json({ success: true, message: "Lead deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

