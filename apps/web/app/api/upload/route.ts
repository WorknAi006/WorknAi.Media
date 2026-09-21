import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAuthToken, extractTokenFromRequest } from "@/app/lib/auth";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication & Role Validation (Admin & Employee only)
    const token = extractTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await verifyAuthToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (user.role !== "admin" && user.role !== "employee") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Access restricted to Admin and Employee" },
        { status: 403 }
      );
    }

    // 2. Parse Multipart Form Data
    const data = await request.formData();
    const file = data.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No valid file uploaded" },
        { status: 400 }
      );
    }

    // 3. File Size Validation (Max 100MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 100MB limit" },
        { status: 413 }
      );
    }

    // 4. MIME Type Validation
    const safeExt = ALLOWED_MIME_TYPES[file.type];
    if (!safeExt) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Allowed: video/mp4, video/quicktime, image/jpeg, image/png",
        },
        { status: 415 }
      );
    }

    // 5. Sanitize Filename & Save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const rawBaseName = path.basename(file.name, path.extname(file.name));
    const sanitizedBase = rawBaseName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50) || "upload";
    const uniqueFileName = `${sanitizedBase}_${Date.now()}${safeExt}`;

    const targetDir = path.join(process.cwd(), "public", "videos");
    await mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, uniqueFileName);
    await writeFile(filePath, buffer);

    let publicUrl = `/videos/${uniqueFileName}`;

    // Upload to Supabase Storage media bucket for public HTTPS access (required for Meta/Instagram API)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const uploadEndpoint = `${supabaseUrl}/storage/v1/object/media/${uniqueFileName}`;
        const uploadRes = await fetch(uploadEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
            "Content-Type": file.type || "application/octet-stream",
          },
          body: buffer,
        });

        if (uploadRes.ok) {
          publicUrl = `${supabaseUrl}/storage/v1/object/public/media/${uniqueFileName}`;
        } else {
          const errBody = await uploadRes.text();
          console.warn("Supabase Storage upload warning, using local file:", errBody);
        }
      } catch (storageErr) {
        console.warn("Supabase Storage upload exception, using local file:", storageErr);
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

