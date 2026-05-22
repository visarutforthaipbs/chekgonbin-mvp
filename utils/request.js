/**
 * Hardened IP extraction from request headers.
 *
 * Security: x-forwarded-for can be spoofed by clients — we take the LAST
 * IP in the chain (the one added by the closest trusted proxy, e.g. Vercel)
 * rather than the first (which the client controls).
 *
 * Falls back to x-real-ip, then "unknown".
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Last entry is set by the nearest trusted proxy (Vercel edge)
    const ips = forwarded.split(",").map((ip) => ip.trim()).filter(Boolean);
    if (ips.length > 0) return ips[ips.length - 1];
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

/**
 * Check if an IP has exceeded the rate limit.
 * Returns true if the request should be blocked.
 *
 * @param {object} supabase  - Admin Supabase client
 * @param {string} ip        - Client IP
 * @param {number} maxPerHour - Default 30
 */
export async function isRateLimited(supabase, ip, maxPerHour = 30) {
  if (ip === "unknown") return false; // Can't rate-limit unknown IPs
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("risk_checks")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", oneHourAgo);
  return (count ?? 0) >= maxPerHour;
}
