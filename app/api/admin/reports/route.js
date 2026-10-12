import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

function checkAuth(request) {
  return request.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function GET(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "pending";

  const { data, error } = await createAdminClient()
    .from("scam_reports")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Evidence lives in a private bucket — attach a 10-minute signed URL per report.
  // Handles both the new "storage:evidence/<file>" form and legacy public URLs.
  const supabase = createAdminClient();
  const withUrls = await Promise.all(
    (data ?? []).map(async (r) => {
      const path = evidencePath(r.evidence);
      if (!path) return { ...r, evidence_url: null };
      const { data: signed } = await supabase.storage.from("evidence").createSignedUrl(path, 600);
      return { ...r, evidence_url: signed?.signedUrl ?? null };
    })
  );
  return NextResponse.json(withUrls);
}

function evidencePath(value) {
  if (!value || typeof value !== "string") return null;
  if (value.startsWith("storage:evidence/")) return value.slice("storage:evidence/".length);
  const marker = "/storage/v1/object/public/evidence/";
  const i = value.indexOf(marker);
  return i >= 0 ? decodeURIComponent(value.slice(i + marker.length)) : null;
}

export async function PATCH(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await request.json();
  const allowed = ["pending", "verified", "rejected", "added_to_blacklist"];
  if (!allowed.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const { error } = await createAdminClient()
    .from("scam_reports")
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
