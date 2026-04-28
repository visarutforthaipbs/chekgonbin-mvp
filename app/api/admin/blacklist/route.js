import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

function checkAuth(request) {
  return request.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reportId, name, contactInfo, type, scamMethod } = await request.json();
  const supabase = createAdminClient();

  const contacts = contactInfo
    ? contactInfo.split(/[,\n]/).map((c) => c.trim()).filter(Boolean)
    : [];

  const { error: blError } = await supabase.from("blacklist").insert({
    name,
    contacts,
    type:        type ?? "unknown",
    scam_method: scamMethod ?? null,
    source:      "community_report",
    status:      "active",
  });

  if (blError) return NextResponse.json({ error: blError.message }, { status: 500 });

  // Mark the source report as added_to_blacklist
  if (reportId) {
    await supabase.from("scam_reports").update({ status: "added_to_blacklist" }).eq("id", reportId);
  }

  return NextResponse.json({ success: true });
}
