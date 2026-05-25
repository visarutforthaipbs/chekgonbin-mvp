import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const all = searchParams.get("all") === "1";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = createAdminClient();
  let query = supabase
    .from("agencies")
    .select(`
      juristic_id, name_th, name_en, license_no, province, phone, company_status, license_expiry,
      cap_amt, paid_amt, share_qty, share_vol, jp_stat_code, fiscal_year,
      total_asset, total_income, net_profit, total_equity,
      current_ratio, debt_to_equity, return_on_asset, return_on_equity,
      net_profit_margin, gross_profit_margin, business_size_code, company_age,
      committees, dbd_scraped_at
    `, { count: "exact" })
    .order("name_th");

  if (!all) {
    query = query.range(offset, offset + limit - 1);
  }

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
