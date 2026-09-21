import cron from "node-cron";
import { supabase } from "../lib/supabase";
import { publishToInstagram } from "../lib/instagram.service";

export const checkAndPublishScheduledPosts = async () => {
  try {
    const now = new Date().toISOString();

    // 1. Find all posts whose scheduled time has arrived or passed
    const { data: scheduledPosts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "scheduled")
      .lte("scheduled_at", now);

    if (error) {
      console.error("❌ [Scheduler Worker] Error querying scheduled posts:", error.message);
      return [];
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return [];
    }

    console.log(`⏰ [Scheduler Worker] Found ${scheduledPosts.length} post(s) ready to publish:`);

    const publishedResults = [];

    for (const post of scheduledPosts) {
      const platforms = Array.isArray(post.platforms) ? post.platforms : [];
      const hasInstagram = platforms.some(
        (p: string) => p.toLowerCase() === "instagram"
      );

      let metaPostId: string | null = null;
      let publishError: string | null = null;

      // If scheduled for Instagram, trigger Instagram publishing
      if (hasInstagram || platforms.length === 0) {
        console.log(`📡 [Scheduler Worker] Publishing post "${post.title}" to Instagram...`);
        const igResult = await publishToInstagram({
          id: post.id,
          title: post.title,
          content: post.content,
          media_url: post.media_url,
          thumbnail: post.thumbnail,
          type: post.type,
        });

        if (igResult.success && igResult.metaPostId) {
          metaPostId = igResult.metaPostId;
          console.log(`✅ [Scheduler Worker] Instagram publish success! Meta ID: ${metaPostId}`);
        } else {
          publishError = igResult.error || "Failed to publish to Instagram";
          console.error(`⚠️ [Scheduler Worker] Instagram publish failed: ${publishError}`);
        }
      }

      // 2. Update post in Supabase
      // If there's an unrecoverable validation error (like an invalid Instagram web link), move to draft
      const isUnrecoverable = publishError && publishError.includes("Invalid URL");
      const finalStatus = metaPostId ? "published" : isUnrecoverable ? "draft" : "scheduled";

      const updatePayload: Record<string, any> = {
        status: finalStatus,
        publish_error: publishError,
      };

      if (metaPostId) {
        updatePayload.meta_post_id = metaPostId;
      }

      const { data: updatedPost, error: updateErr } = await supabase
        .from("posts")
        .update(updatePayload)
        .eq("id", post.id)
        .select()
        .single();

      if (updateErr) {
        console.error(`❌ [Scheduler Worker] Error updating post ${post.id}:`, updateErr.message);
      } else if (updatedPost) {
        publishedResults.push(updatedPost);
        console.log(`🚀 [Scheduler Worker] Post "${post.title}" marked as ${updatedPost.status}`);
      }
    }

    return publishedResults;
  } catch (err: any) {
    console.error("❌ [Scheduler Worker] Unexpected error:", err.message);
    return [];
  }
};

export const startCronWorker = () => {
  console.log("⏰ [Scheduler Worker] Auto-publish cron job initialized (Every 1 minute).");

  // Run every 1 minute
  cron.schedule("* * * * *", async () => {
    await checkAndPublishScheduledPosts();
  });
};

