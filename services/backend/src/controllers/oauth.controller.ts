import { Request, Response } from "express";
import crypto from "crypto";
import { supabase } from "../lib/supabase";
import { encryptToken, decryptToken } from "../lib/encryption";

// Required Instagram Login scopes per specification
const INSTAGRAM_SCOPES = [
  "instagram_business_basic",
  "instagram_business_content_publish",
  "instagram_business_manage_comments",
  "instagram_business_manage_messages",
];

const getSecretKey = (): string => {
  return process.env.JWT_SECRET || "worknai_oauth_state_hmac_secret_2026";
};

/**
 * Generate CSRF-safe signed state token containing brandId and timestamp
 */
const generateOAuthState = (brandId?: string | number): string => {
  const payload = {
    brandId: brandId ? String(brandId) : null,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(8).toString("hex"),
  };
  const jsonStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(base64Payload)
    .digest("hex");
  return `${base64Payload}.${signature}`;
};

/**
 * Validate OAuth state token and extract payload
 */
const verifyOAuthState = (stateStr: string): { valid: boolean; brandId?: string | null } => {
  try {
    if (!stateStr || !stateStr.includes(".")) {
      return { valid: false };
    }
    const [base64Payload, signature] = stateStr.split(".");
    const expectedSig = crypto
      .createHmac("sha256", getSecretKey())
      .update(base64Payload)
      .digest("hex");

    if (signature !== expectedSig) {
      return { valid: false };
    }

    const jsonStr = Buffer.from(base64Payload, "base64url").toString("utf8");
    const payload = JSON.parse(jsonStr);

    // State expires after 30 minutes
    if (Date.now() - payload.timestamp > 30 * 60 * 1000) {
      return { valid: false };
    }

    return { valid: true, brandId: payload.brandId };
  } catch {
    return { valid: false };
  }
};

/**
 * GET /api/oauth/instagram/start
 * Initiates the Instagram OAuth authorization flow.
 */
export const startInstagramOAuth = async (req: Request, res: Response) => {
  try {
    const { brand_id, redirect } = req.query;

    const appId =
      process.env.META_APP_ID ||
      process.env.INSTAGRAM_APP_ID;
    const redirectUri =
      process.env.META_REDIRECT_URI ||
      `${req.protocol}://${req.get("host")}/api/oauth/instagram/callback`;

    if (!appId) {
      return res.status(500).json({
        success: false,
        error: "META_APP_ID (Instagram app ID) is not configured in backend .env",
      });
    }

    const state = generateOAuthState(brand_id as string);

    const params = new URLSearchParams({
      enable_fb_login: "0",
      force_authentication: "1",
      client_id: appId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: INSTAGRAM_SCOPES.join(","),
      state,
    });

    const authUrl = `https://www.instagram.com/oauth/authorize?${params.toString()}`;

    if (redirect === "true" || redirect === "1") {
      return res.redirect(authUrl);
    }

    return res.json({
      success: true,
      authUrl,
      state,
      appId,
      redirectUri,
    });
  } catch (err: any) {
    console.error("❌ [OAuth Start] Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/oauth/instagram/callback
 * Handles Meta authorization callback, short-to-long token exchange, and Supabase upsert.
 */
export const handleInstagramCallback = async (req: Request, res: Response) => {
  const { code, state, error, error_reason, error_description } = req.query;

  // Handle denial or errors from Meta
  if (error || error_reason) {
    const errorMsg = (error_description as string) || (error_reason as string) || "Access denied by user";
    console.warn("⚠️ [OAuth Callback] Authorization error:", errorMsg);
    return renderPopupHtml(res, false, errorMsg);
  }

  if (!code || typeof code !== "string") {
    return renderPopupHtml(res, false, "Authorization code was not provided by Meta.");
  }

  // Meta often appends #_ at the end of the authorization code
  const sanitizedCode = code.replace(/#_$/, "").trim();

  // Validate state
  const stateCheck = verifyOAuthState((state as string) || "");
  if (!stateCheck.valid) {
    return renderPopupHtml(res, false, "Invalid or expired OAuth state parameter. Please retry.");
  }

  const brandId = stateCheck.brandId ? Number(stateCheck.brandId) : null;

  const appId =
    process.env.META_APP_ID ||
    process.env.INSTAGRAM_APP_ID;
  const appSecret =
    process.env.META_APP_SECRET ||
    process.env.INSTAGRAM_APP_SECRET;

  const redirectUri =
    process.env.META_REDIRECT_URI ||
    `${req.protocol}://${req.get("host")}/api/oauth/instagram/callback`;

  if (!appId || !appSecret) {
    console.error("❌ [OAuth Callback] META_APP_SECRET is not configured in backend environment.");
    return renderPopupHtml(
      res,
      false,
      "Backend configuration error: META_APP_ID / META_APP_SECRET is missing. Please configure it in .env"
    );
  }

  try {
    console.log("🔄 [OAuth Callback] Exchanging authorization code for short-lived token...");

    // 1. Exchange authorization code for short-lived access token
    const tokenForm = new URLSearchParams();
    tokenForm.append("client_id", appId);
    tokenForm.append("client_secret", appSecret);
    tokenForm.append("grant_type", "authorization_code");
    tokenForm.append("redirect_uri", redirectUri);
    tokenForm.append("code", sanitizedCode);

    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      body: tokenForm,
    });

    const tokenJson = await tokenRes.json();

    if (tokenJson.error || !tokenJson.access_token) {
      const errMsg = tokenJson.error_message || tokenJson.error?.message || "Failed to exchange authorization code";
      console.error("❌ [OAuth Callback] Short-lived token exchange failed:", errMsg);
      return renderPopupHtml(res, false, errMsg);
    }

    const shortLivedToken = tokenJson.access_token;
    console.log("✅ [OAuth Callback] Short-lived token acquired. Exchanging for 60-day long-lived token...");

    // 2. Exchange short-lived token for 60-day long-lived token
    const exchangeUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(appSecret)}&access_token=${encodeURIComponent(shortLivedToken)}`;
    const exchangeRes = await fetch(exchangeUrl);
    const exchangeJson = await exchangeRes.json();

    if (exchangeJson.error || !exchangeJson.access_token) {
      const errMsg = exchangeJson.error?.message || "Failed to acquire long-lived access token from Meta";
      console.error("❌ [OAuth Callback] Long-lived token exchange failed:", errMsg);
      return renderPopupHtml(res, false, errMsg);
    }

    const longLivedToken = exchangeJson.access_token;
    const expiresInSeconds = exchangeJson.expires_in || 5184000; // 60 days default
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    console.log(`✅ [OAuth Callback] Long-lived token acquired (Expires in ${Math.round(expiresInSeconds / 86400)} days). Fetching profile...`);

    // 3. Fetch Instagram profile
    const profileUrl = `https://graph.instagram.com/v21.0/me?fields=id,username,name,profile_picture_url&access_token=${encodeURIComponent(longLivedToken)}`;
    const profileRes = await fetch(profileUrl);
    const profileJson = await profileRes.json();

    if (profileJson.error || !profileJson.id) {
      const errMsg = profileJson.error?.message || "Failed to fetch Instagram profile";
      console.error("❌ [OAuth Callback] Profile fetch failed:", errMsg);
      return renderPopupHtml(res, false, errMsg);
    }

    const instagramId = String(profileJson.id);
    const username = (profileJson.username || "").toLowerCase().trim();
    const displayName = profileJson.name || profileJson.username || "Instagram Business";
    const profilePicture = profileJson.profile_picture_url || null;

    // 4. Encrypt long-lived token before DB storage
    const encryptedToken = encryptToken(longLivedToken);

    // 5. Upsert into Supabase social_integrations
    // Prefer the record of this Instagram account, otherwise reuse the brand's current record.
    // Looking them up separately avoids an OR + limit(1) picking the wrong row and leaving duplicates.
    const { data: accountRecords } = await supabase
      .from("social_integrations")
      .select("id, is_primary, is_default")
      .eq("platform", "instagram")
      .or(`instagram_id.eq.${instagramId},account_id.eq.${instagramId}`)
      .limit(1);
    const accountRecord = accountRecords && accountRecords.length > 0 ? accountRecords[0] : null;

    let brandRecord: { id: string; is_primary?: boolean; is_default?: boolean } | null = null;
    if (brandId) {
      const { data: brandRecords } = await supabase
        .from("social_integrations")
        .select("id, is_primary, is_default")
        .eq("platform", "instagram")
        .eq("brand_id", brandId)
        .limit(1);
      brandRecord = brandRecords && brandRecords.length > 0 ? brandRecords[0] : null;
    }

    const existing = accountRecord || brandRecord;

    // Check count of other records to determine default
    const { count } = await supabase
      .from("social_integrations")
      .select("id", { count: "exact", head: true })
      .eq("platform", "instagram")
      .eq("connected", true);

    const isPrimary = existing ? (existing.is_primary ?? existing.is_default ?? true) : (count === 0 || count === null);

    const recordPayload = {
      platform: "instagram",
      brand_id: brandId || null,
      instagram_id: instagramId,
      account_id: instagramId, // backward compatibility
      username,
      account_name: username, // backward compatibility
      display_name: displayName,
      profile_picture: profilePicture,
      access_token: encryptedToken,
      expires_at: expiresAt,
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      connected: true,
      status: "connected",
      app_id: appId,
      is_primary: isPrimary,
      is_default: isPrimary, // backward compatibility
    };

    let savedAccount: any = null;

    if (existing) {
      const { data, error: updateError } = await supabase
        .from("social_integrations")
        .update(recordPayload)
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) {
        console.error("❌ [OAuth Callback] DB Update error:", updateError.message);
        return renderPopupHtml(res, false, updateError.message);
      }
      savedAccount = data;

      // Account moved onto a brand that already had another account: drop the replaced record
      if (brandRecord && brandRecord.id !== existing.id) {
        await supabase.from("social_integrations").delete().eq("id", brandRecord.id);
      }
    } else {
      const { data, error: insertError } = await supabase
        .from("social_integrations")
        .insert(recordPayload)
        .select()
        .single();

      if (insertError) {
        console.error("❌ [OAuth Callback] DB Insert error:", insertError.message);
        return renderPopupHtml(res, false, insertError.message);
      }
      savedAccount = data;
    }

    console.log(`🎉 [OAuth Callback] Successfully connected @${username} (Brand ID: ${brandId || "unassigned"})`);

    return renderPopupHtml(res, true, null, {
      id: savedAccount.id,
      brand_id: brandId,
      instagram_id: instagramId,
      username,
      display_name: displayName,
      profile_picture: profilePicture,
      expires_at: expiresAt,
      is_primary: isPrimary,
      status: "connected",
    });
  } catch (err: any) {
    console.error("❌ [OAuth Callback] Unexpected exception:", err.message);
    return renderPopupHtml(res, false, err.message);
  }
};

/**
 * POST /api/oauth/instagram/refresh
 * Refresh access token for a given integration or all expiring integrations.
 */
export const refreshInstagramTokens = async (req: Request, res: Response) => {
  try {
    const { integration_id } = req.body || {};

    let query = supabase
      .from("social_integrations")
      .select("*")
      .eq("platform", "instagram")
      .eq("connected", true);

    if (integration_id) {
      query = query.eq("id", integration_id);
    }

    const { data: accounts, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    const refreshedList = [];
    const failedList = [];

    for (const acc of accounts || []) {
      const rawToken = decryptToken(acc.access_token);
      const refreshResult = await refreshSingleToken(rawToken);

      if (refreshResult.success && refreshResult.accessToken) {
        const encryptedNewToken = encryptToken(refreshResult.accessToken);
        const newExpiresAt = new Date(
          Date.now() + (refreshResult.expiresIn || 5184000) * 1000
        ).toISOString();

        await supabase
          .from("social_integrations")
          .update({
            access_token: encryptedNewToken,
            expires_at: newExpiresAt,
            status: "connected",
            connected: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", acc.id);

        refreshedList.push({
          id: acc.id,
          username: acc.username || acc.account_name,
          expires_at: newExpiresAt,
        });
      } else {
        await supabase
          .from("social_integrations")
          .update({
            status: "reconnect_required",
            connected: false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", acc.id);

        failedList.push({
          id: acc.id,
          username: acc.username || acc.account_name,
          error: refreshResult.error,
        });
      }
    }

    return res.json({
      success: true,
      refreshedCount: refreshedList.length,
      failedCount: failedList.length,
      refreshed: refreshedList,
      failed: failedList,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Call Meta Graph API to refresh a long-lived Instagram token
 */
export const refreshSingleToken = async (
  rawToken: string
): Promise<{ success: boolean; accessToken?: string; expiresIn?: number; error?: string }> => {
  try {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(rawToken.trim())}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.error || !json.access_token) {
      return {
        success: false,
        error: json.error?.message || "Failed to refresh token with Meta",
      };
    }

    return {
      success: true,
      accessToken: json.access_token,
      expiresIn: json.expires_in || 5184000,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
};

/**
 * Helper to render responsive HTML in the OAuth popup that communicates with parent window
 */
const renderPopupHtml = (
  res: Response,
  success: boolean,
  errorMessage: string | null = null,
  accountData: any = null
) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${success ? "Instagram Connected" : "Connection Failed"}</title>
  <style>
    body {
      background-color: #09090b;
      color: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 24px;
      box-sizing: border-box;
    }
    .card {
      background: #18181b;
      border: 1px solid ${success ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"};
      border-radius: 20px;
      padding: 32px 24px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }
    .icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 28px;
      background: ${success ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)"};
      color: ${success ? "#10b981" : "#ef4444"};
    }
    h2 {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 700;
      color: ${success ? "#10b981" : "#ef4444"};
    }
    p {
      margin: 0 0 20px;
      font-size: 13px;
      color: #a1a1aa;
      line-height: 1.5;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 12px;
      background: #27272a;
      color: #e4e4e7;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .btn {
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 10px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? "✓" : "✕"}</div>
    <h2>${success ? "Connected Successfully!" : "Connection Failed"}</h2>
    ${
      success && accountData
        ? `<div class="badge">@${accountData.username}</div>
           <p>Instagram account connected to WorknAI Media. This window will close automatically.</p>`
        : `<p>${errorMessage || "Unable to authorize with Instagram. Please try again."}</p>`
    }
    <button class="btn" onclick="handleClose()">Close Window</button>
  </div>

  <script>
    const payload = {
      type: "${success ? "INSTAGRAM_OAUTH_SUCCESS" : "INSTAGRAM_OAUTH_FAILURE"}",
      success: ${success},
      account: ${JSON.stringify(accountData)},
      error: ${JSON.stringify(errorMessage)}
    };

    function notifyAndClose() {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, "*");
          ${success ? "setTimeout(() => window.close(), 1200);" : ""}
        }
      } catch (err) {
        console.warn("Could not post message to opener:", err);
      }
    }

    function handleClose() {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(payload, "*");
      }
      window.close();
    }

    // Attempt immediate notification
    notifyAndClose();
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
};
