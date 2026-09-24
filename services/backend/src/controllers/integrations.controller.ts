import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { decryptToken } from "../lib/encryption";

/**
 * GET /api/integrations
 * Retrieves all brands/clients merged with their respective Instagram integration details.
 * Security: access_token is NEVER included in the returned payload.
 */
export const getIntegrationsOverview = async (_req: Request, res: Response) => {
  try {
    // 1. Fetch all brands / clients
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("*")
      .order("id", { ascending: true });

    if (clientsError) {
      return res.status(500).json({ success: false, error: clientsError.message });
    }

    // 2. Fetch all social integrations (platform = instagram)
    const { data: integrations, error: integrationsError } = await supabase
      .from("social_integrations")
      .select(
        "id, platform, brand_id, instagram_id, account_id, username, account_name, display_name, profile_picture, expires_at, connected_at, is_primary, is_default, status, connected, created_at, updated_at"
      )
      .eq("platform", "instagram")
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (integrationsError) {
      return res.status(500).json({ success: false, error: integrationsError.message });
    }

    const integrationsList = integrations || [];

    // 3. Map each client/brand with its connected integration
    const brandsWithIntegrations = (clients || []).map((client) => {
      // Find integration by brand_id or by matching name/account_name
      const integration = integrationsList.find(
        (i) =>
          (i.brand_id && Number(i.brand_id) === Number(client.id)) ||
          (!i.brand_id &&
            i.username &&
            client.name &&
            i.username.toLowerCase() === client.name.toLowerCase().replace(/\s+/g, ""))
      );

      const isConnected = Boolean(
        integration &&
          (integration.status === "connected" ||
            (integration.status !== "disconnected" && integration.connected))
      );

      return {
        brand: {
          id: client.id,
          name: client.name,
          website: client.website,
          logo: client.logo,
        },
        integration: integration
          ? {
              id: integration.id,
              platform: integration.platform || "instagram",
              instagram_id: integration.instagram_id || integration.account_id,
              username: integration.username || integration.account_name,
              display_name: integration.display_name || integration.username || client.name,
              profile_picture: integration.profile_picture || null,
              expires_at: integration.expires_at || null,
              connected_at: integration.connected_at || integration.created_at,
              is_primary: Boolean(integration.is_primary ?? integration.is_default),
              status: integration.status || (integration.connected ? "connected" : "disconnected"),
              connected: isConnected,
            }
          : null,
      };
    });

    // Also collect any standalone integrations that don't map to a specific brand
    const unmappedIntegrations = integrationsList
      .filter((i) => !brandsWithIntegrations.some((b) => b.integration?.id === i.id))
      .map((i) => ({
        brand: null,
        integration: {
          id: i.id,
          platform: i.platform || "instagram",
          instagram_id: i.instagram_id || i.account_id,
          username: i.username || i.account_name,
          display_name: i.display_name || i.username || "Instagram Account",
          profile_picture: i.profile_picture || null,
          expires_at: i.expires_at || null,
          connected_at: i.connected_at || i.created_at,
          is_primary: Boolean(i.is_primary ?? i.is_default),
          status: i.status || (i.connected ? "connected" : "disconnected"),
          connected: Boolean(i.status === "connected" || (i.status !== "disconnected" && i.connected)),
        },
      }));

    return res.json({
      success: true,
      data: [...brandsWithIntegrations, ...unmappedIntegrations],
      rawIntegrations: integrationsList.map((i) => ({
        id: i.id,
        brand_id: i.brand_id,
        instagram_id: i.instagram_id || i.account_id,
        username: i.username || i.account_name,
        display_name: i.display_name || i.username,
        profile_picture: i.profile_picture,
        expires_at: i.expires_at,
        is_primary: Boolean(i.is_primary ?? i.is_default),
        status: i.status || (i.connected ? "connected" : "disconnected"),
        connected: Boolean(i.status === "connected" || (i.status !== "disconnected" && i.connected)),
      })),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * PUT /api/integrations/:id/primary
 * Sets the specified integration as the primary default account.
 */
export const setPrimaryIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Unset primary for all other Instagram accounts
    await supabase
      .from("social_integrations")
      .update({ is_primary: false, is_default: false })
      .eq("platform", "instagram");

    // Set primary for this integration
    const { data, error } = await supabase
      .from("social_integrations")
      .update({
        is_primary: true,
        is_default: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, brand_id, instagram_id, username, display_name, is_primary, status")
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({
      success: true,
      message: "Set as primary default account successfully",
      integration: data,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * POST /api/integrations/:id/disconnect
 * Disconnects an Instagram integration.
 */
export const disconnectIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("social_integrations")
      .update({
        connected: false,
        status: "disconnected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, username, status")
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({
      success: true,
      message: "Instagram integration disconnected successfully",
      integration: data,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * DELETE /api/integrations/:id
 * Permanently removes an integration record.
 */
export const deleteIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("social_integrations")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({
      success: true,
      message: "Integration deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * POST /api/integrations/:id/refresh-profile
 * Re-fetches the latest profile details from Meta Graph API using the stored token.
 */
export const refreshIntegrationProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: record, error } = await supabase
      .from("social_integrations")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !record) {
      return res.status(404).json({ success: false, error: "Integration not found" });
    }

    const rawToken = decryptToken(record.access_token);

    // Call Meta to get current profile info
    const profileUrl = `https://graph.instagram.com/v21.0/me?fields=id,username,name,profile_picture_url&access_token=${encodeURIComponent(rawToken.trim())}`;
    const profileRes = await fetch(profileUrl);
    const profileJson = await profileRes.json();

    if (profileJson.error) {
      return res.status(400).json({
        success: false,
        error: profileJson.error.message || "Failed to fetch profile from Instagram API",
      });
    }

    const { data: updated, error: updateError } = await supabase
      .from("social_integrations")
      .update({
        username: (profileJson.username || record.username).toLowerCase().trim(),
        account_name: (profileJson.username || record.account_name).toLowerCase().trim(),
        display_name: profileJson.name || profileJson.username || record.display_name,
        profile_picture: profileJson.profile_picture_url || record.profile_picture,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, brand_id, instagram_id, username, display_name, profile_picture, status")
      .single();

    if (updateError) {
      return res.status(500).json({ success: false, error: updateError.message });
    }

    return res.json({
      success: true,
      message: "Instagram profile refreshed successfully",
      profile: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
