import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

function checkAuth(request) {
  return request.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function GET(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  const [riskCounts, recentChecks, reportCounts] = await Promise.all([
    supabase.from("risk_checks").select("risk_level").then(({ data }) => {
      const counts = { low: 0, medium: 0, high: 0, total: 0 };
      (data ?? []).forEach((r) => { counts[r.risk_level] = (counts[r.risk_level] ?? 0) + 1; counts.total++; });
      return counts;
    }),
    supabase.from("risk_checks").select("agency_name, risk_level, score, created_at")
      .order("created_at", { ascending: false }).limit(10).then(({ data }) => data ?? []),
    supabase.from("scam_reports").select("status").then(({ data }) => {
      const counts = { pending: 0, verified: 0, rejected: 0, added_to_blacklist: 0 };
      (data ?? []).forEach((r) => { counts[r.status] = (counts[r.status] ?? 0) + 1; });
      return counts;
    }),
  ]);

  return NextResponse.json({ riskCounts, recentChecks, reportCounts });
}
