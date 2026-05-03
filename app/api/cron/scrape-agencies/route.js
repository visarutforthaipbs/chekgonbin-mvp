import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";

export const runtime = "nodejs";
export const maxDuration = 300;
export const preferredRegion = "sin1"; // Singapore — avoids GitHub Actions US IP block

const BASE_URL = "https://toea.doe.go.th/LBANK-WEB/main.php";
const DELAY_MS = 800;
const HEADERS_BASE = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate",
  Connection: "keep-alive",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function decodeTIS620(response) {
  const buffer = await response.arrayBuffer();
  return iconv.decode(Buffer.from(buffer), "tis-620");
}

async function initSession() {
  const url = `${BASE_URL}?menu=viewer_agent&gmenu=2`;
  const res = await fetch(url, { headers: HEADERS_BASE });

  // Collect all Set-Cookie headers (Node 18+ supports getSetCookie())
  const setCookies =
    res.headers.getSetCookie?.() ??
    [res.headers.get("set-cookie")].filter(Boolean);
  const cookieStr = setCookies
    .map((c) => c.split(";")[0])
    .join("; ");

  const html = await decodeTIS620(res);
  const $ = cheerio.load(html);

  const hidden = {};
  $("input[type=hidden]").each((_, el) => {
    const name = $(el).attr("name") || $(el).attr("id");
    const value = $(el).val();
    if (name && value) hidden[name] = value;
  });

  console.log(
    `Session init OK — cookies: ${cookieStr.slice(0, 60)}, hidden fields: ${Object.keys(hidden).length}`
  );
  return { cookieStr, hidden };
}

async function fetchListPage(session, page) {
  const { cookieStr, hidden } = session;
  const body = new URLSearchParams({
    ...hidden,
    agentnameth: "",
    province_id: "",
    sortby2: "agentnameth",
    sorttype2: "asc",
    page: String(page),
  });

  const url = `${BASE_URL}?menu=viewer_agent&step=1&task=search`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...HEADERS_BASE,
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieStr,
      Referer: BASE_URL,
    },
    body: body.toString(),
  });

  const html = await decodeTIS620(res);
  const $ = cheerio.load(html);
  const tables = $("table");
  if (tables.length < 4) return [];

  const records = [];
  $(tables.get(3))
    .find("tr")
    .slice(1)
    .each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length < 5) return;

      const onclickEl = $(cells.get(4)).find("[onclick]").first();
      let cid = null;
      if (onclickEl.length) {
        const match = onclickEl.attr("onclick")?.match(/cid.*?'(\d+)'/);
        if (match) cid = match[1];
      }

      records.push({
        number: $(cells.get(0)).text().trim(),
        name_th: $(cells.get(1)).text().trim(),
        province: $(cells.get(2)).text().trim(),
        license_no: $(cells.get(3)).text().trim(),
        cid,
      });
    });

  console.log(`Page ${page}: ${records.length} records`);
  return records;
}

async function scrapeAllPages(session) {
  const all = [];
  let page = 1;
  while (true) {
    const records = await fetchListPage(session, page);
    if (!records.length) break;
    all.push(...records);
    if (records.length < 30) break;
    page++;
    await sleep(DELAY_MS);
  }
  console.log(`Scrape complete — ${all.length} agencies across ${page} pages`);
  return all;
}

async function saveToSupabase(records) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const scraped_at = new Date().toISOString();
  const rows = records
    .filter((r) => r.cid)
    .map((r) => ({ ...r, scraped_at }));

  const BATCH = 200;
  for (let i = 0; i < rows.length; i += BATCH) {
    await supabase.from("agencies").upsert(rows.slice(i, i + BATCH));
    console.log(`Upserted ${Math.min(i + BATCH, rows.length)}/${rows.length}`);
  }
  return rows.length;
}

export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const session = await initSession();
    const records = await scrapeAllPages(session);
    const saved = await saveToSupabase(records);
    return Response.json({ success: true, count: saved });
  } catch (err) {
    console.error("Cron scraper failed:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
