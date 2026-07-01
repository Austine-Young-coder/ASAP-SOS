import { supabase, supabaseConfigured } from "./supabaseClient";
import { queueOfflineAction, getLocal, setLocal } from "./storage";

const REPORT_THRESHOLD = 3;
const SUSPENSION_DAYS = 14;

export async function createBroadcast({ userId, message, videoUrl, range, lat, lng, category }) {
  const payload = {
    user_id: userId,
    message: message || null,
    video_url: videoUrl || null,
    range, // 'nearby' | 'wide'
    lat,
    lng,
    category,
    created_at: new Date().toISOString()
  };

  if (!navigator.onLine || !supabaseConfigured) {
    queueOfflineAction({ type: "broadcast", payload });
    return { queued: true };
  }

  const { data, error } = await supabase.from("broadcasts").insert(payload).select().single();
  if (error) throw error;
  return { queued: false, broadcast: data };
}

export async function fetchNearbyBroadcasts({ lat, lng, radiusKm = 5 }) {
  if (!supabaseConfigured) return [];
  // Assumes a Postgres function `nearby_broadcasts(lat, lng, radius_km)` using PostGIS or
  // a simple bounding-box query — see supabase/schema.sql for setup.
  const { data, error } = await supabase.rpc("nearby_broadcasts", {
    in_lat: lat,
    in_lng: lng,
    in_radius_km: radiusKm
  });
  if (error) {
    console.error("fetchNearbyBroadcasts error", error);
    return [];
  }
  return data || [];
}

export async function reportBroadcast({ broadcastId, reporterId, reason }) {
  if (!supabaseConfigured) {
    queueOfflineAction({ type: "report", payload: { broadcastId, reporterId, reason } });
    return { queued: true };
  }
  const { error } = await supabase.from("reports").insert({
    broadcast_id: broadcastId,
    reporter_id: reporterId,
    reason,
    created_at: new Date().toISOString()
  });
  if (error) throw error;

  // Check accumulated reports for the broadcast's author and suspend if threshold met.
  const { data: counts } = await supabase
    .from("reports")
    .select("id", { count: "exact" })
    .eq("broadcast_id", broadcastId);

  if ((counts?.length || 0) >= REPORT_THRESHOLD) {
    await suspendBroadcastAuthor(broadcastId);
  }
  return { queued: false };
}

async function suspendBroadcastAuthor(broadcastId) {
  const { data: broadcast } = await supabase.from("broadcasts").select("user_id").eq("id", broadcastId).single();
  if (!broadcast) return;
  const suspendedUntil = new Date(Date.now() + SUSPENSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await supabase
    .from("profiles")
    .update({ suspended_until: suspendedUntil, suspension_reason: "Multiple false-alarm reports" })
    .eq("id", broadcast.user_id);
}

export function isSuspended(profile) {
  if (!profile?.suspended_until) return false;
  return new Date(profile.suspended_until) > new Date();
}

export { REPORT_THRESHOLD, SUSPENSION_DAYS };
