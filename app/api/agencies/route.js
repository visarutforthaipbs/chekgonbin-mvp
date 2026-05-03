import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = createAdminClient();
  let query = supabase
    .from("agencies")
    .select("name_th, name_en, license_no, province, phone, company_status, license_expiry", { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("name_th");

  if (q) {
    query = query.or(`name_th.ilike.%${q}%,name_en.ilike.%${q}%,license_no.ilike.%${q}%`);
  }

  const [{ data, count, error }, { data: lastRow }] = await Promise.all([
    query,
    supabase.from("agencies").select("scraped_at").order("scraped_at", { ascending: false }).limit(1).single(),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, limit, last_updated: lastRow?.scraped_at ?? null });
}
