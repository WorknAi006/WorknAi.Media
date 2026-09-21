import { supabase } from "./supabase";

export interface InstagramPublishResult {
  success: boolean;
  metaPostId?: string;
  error?: string;
}

export interface InstagramMediaPost {
  id: string | number;
  title: string;
  content?: string;
  media_url?: string | null;
  thumbnail?: string | null;
  type?: string;
}

/**
 * Fetch active Instagram credentials from Supabase social_integrations
 * or fallback to environment variables.
 */
export const getActiveInstagramCredentials = async (targetAccountIdOrName?: string) => {
  try {
    let query = supabase
      .from("social_integrations")
      .select("*")
      .eq("platform", "instagram")
      .eq("connected", true);

    if (targetAccountIdOrName) {
      query = query.or(`account_id.eq.${targetAccountIdOrName},account_name.eq.${targetAccountIdOrName}`);
    } else {
      // Prioritize default account
      query = query.order("is_default", { ascending: false }).order("created_at", { ascending: true });
    }

    const { data } = await query.limit(1).maybeSingle();

    if (data && data.access_token && data.account_id) {
      return {
        id: data.id,
        accountId: data.account_id,
        accessToken: data.access_token,
        accountName: data.account_name || "Instagram Business",
        isDefault: data.is_default || false,
      };
    }
  } catch (err) {
    console.warn("Could not query social_integrations from DB:", err);
  }

  // Fallback to process.env
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountName = process.env.INSTAGRAM_ACCOUNT_NAME || "worknaiintern1";

  if (!accountId || !accessToken) {
    return null;
  }

  return { accountId, accessToken, accountName, isDefault: true };
};

/**
 * Verify arbitrary Instagram token against Meta Graph API
 */
export const verifyInstagramCredentials = async (accessToken: string) => {
  try {
    const url = `https://graph.instagram.com/v21.0/me?fields=id,username,account_type,media_count&access_token=${accessToken.trim()}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.error) {
      return {
        valid: false,
        error: json.error.message || "Invalid Instagram Access Token",
      };
    }

    return {
      valid: true,
      account: {
        id: json.id,
        username: json.username,
        accountType: json.account_type || "BUSINESS",
        mediaCount: json.media_count || 0,
      },
    };
  } catch (err: any) {
    return {
      valid: false,
      error: err.message || "Failed to communicate with Instagram API",
    };
  }
};

/**
 * Check connectivity and profile details of the connected Instagram account
 */
export const checkInstagramConnection = async (targetAccountIdOrName?: string) => {
  const creds = await getActiveInstagramCredentials(targetAccountIdOrName);
  if (!creds) {
    return {
      connected: false,
      error: "Instagram credentials not configured in DB or .env",
    };
  }

  try {
    const result = await verifyInstagramCredentials(creds.accessToken);
    if (!result.valid) {
      return {
        connected: false,
        error: result.error,
      };
    }

    return {
      connected: true,
      account: result.account,
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err.message,
    };
  }
};

/**
 * Publish a Photo or Reel to Instagram
 */
export const publishToInstagram = async (
  post: InstagramMediaPost
): Promise<InstagramPublishResult> => {
  const creds = await getActiveInstagramCredentials();
  if (!creds) {
    return {
      success: false,
      error: "Instagram credentials not configured.",
    };
  }

  const { accountId, accessToken } = creds;

  // Build caption: title + content
  const captionParts = [post.title];
  if (post.content && post.content.trim().length > 0) {
    captionParts.push(post.content.trim());
  }
  const caption = captionParts.join("\n\n");

  // Determine media URL
  const targetUrl = post.media_url || post.thumbnail;
  if (!targetUrl) {
    return {
      success: false,
      error: "No media_url or thumbnail found on post. Instagram requires an image or video URL.",
    };
  }

  // Validate that user is not passing an Instagram webpage URL
  if (targetUrl.includes("instagram.com/reel") || targetUrl.includes("instagram.com/p/")) {
    return {
      success: false,
      error: "Invalid URL: Cannot use an Instagram webpage link (instagram.com/reel/...). Please upload a direct MP4 video or JPG image file.",
    };
  }

  const isImage =
    targetUrl.toLowerCase().endsWith(".jpg") ||
    targetUrl.toLowerCase().endsWith(".jpeg") ||
    targetUrl.toLowerCase().endsWith(".png") ||
    targetUrl.toLowerCase().endsWith(".webp") ||
    targetUrl.includes("format=jpg") ||
    targetUrl.includes("format=png");

  // Determine if video/reel or image
  const isVideo =
    !isImage &&
    (post.type === "reel" ||
      targetUrl.toLowerCase().endsWith(".mp4") ||
      targetUrl.toLowerCase().endsWith(".mov") ||
      targetUrl.includes("/video"));

  try {
    console.log(`📸 [Instagram Service] Creating container for "${post.title}" (${isVideo ? "Reel/Video" : "Image"})...`);

    // STEP 1: Create Media Container
    let createUrl = `https://graph.instagram.com/v21.0/${accountId}/media`;
    const params = new URLSearchParams();
    params.append("access_token", accessToken);
    params.append("caption", caption);

    if (isVideo) {
      params.append("media_type", "REELS");
      params.append("video_url", targetUrl);
    } else {
      params.append("image_url", targetUrl);
    }

    const containerRes = await fetch(`${createUrl}?${params.toString()}`, {
      method: "POST",
    });

    const containerData = await containerRes.json();

    if (containerData.error || !containerData.id) {
      const errMsg = containerData.error?.message || "Failed to create Instagram media container";
      console.error("❌ [Instagram Service] Container error:", errMsg);
      return { success: false, error: errMsg };
    }

    const creationId = containerData.id;
    console.log(`📦 [Instagram Service] Container created successfully. ID: ${creationId}`);

    // If it is a video/reel, Meta processes the video asynchronously. We must poll until status is FINISHED.
    if (isVideo) {
      let isReady = false;
      const maxAttempts = 12; // up to 60 seconds
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const statusRes = await fetch(
          `https://graph.instagram.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`
        );
        const statusData = await statusRes.json();

        if (statusData.status_code === "FINISHED") {
          isReady = true;
          console.log(`✅ [Instagram Service] Reel video processing finished.`);
          break;
        } else if (statusData.status_code === "ERROR") {
          return {
            success: false,
            error: "Instagram video processing failed on Meta servers.",
          };
        }
        console.log(`⏳ [Instagram Service] Waiting for video processing (Attempt ${attempt}/${maxAttempts})...`);
      }

      if (!isReady) {
        return {
          success: false,
          error: "Instagram video processing timed out after 60s.",
        };
      }
    } else {
      // For image containers, Meta needs 3-4 seconds to fetch and register the media
      console.log(`⏳ [Instagram Service] Waiting 3.5s for image container to register...`);
      await new Promise((resolve) => setTimeout(resolve, 3500));
    }

    // STEP 2: Publish the Container (with retry if Meta container is still registering)
    console.log(`🚀 [Instagram Service] Publishing media container ${creationId}...`);
    const publishUrl = `https://graph.instagram.com/v21.0/${accountId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`;
    
    let publishData: any = null;
    const maxPublishAttempts = 3;
    for (let attempt = 1; attempt <= maxPublishAttempts; attempt++) {
      const publishRes = await fetch(publishUrl, { method: "POST" });
      publishData = await publishRes.json();

      if (publishData.id) {
        break;
      }

      const isNotReady = publishData.error?.message?.includes("Media ID is not available");
      if (isNotReady && attempt < maxPublishAttempts) {
        console.log(`⏳ [Instagram Service] Media container registering, waiting 3s (attempt ${attempt}/${maxPublishAttempts})...`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } else {
        break;
      }
    }

    if (publishData.error || !publishData.id) {
      const errMsg = publishData.error?.message || "Failed to publish media container on Instagram";
      console.error("❌ [Instagram Service] Publish error:", errMsg);
      return { success: false, error: errMsg };
    }

    console.log(`🎉 [Instagram Service] Post published live on Instagram! Post ID: ${publishData.id}`);
    return {
      success: true,
      metaPostId: publishData.id,
    };
  } catch (err: any) {
    console.error("❌ [Instagram Service] Exception during Instagram publishing:", err.message);
    return {
      success: false,
      error: err.message,
    };
  }
};
