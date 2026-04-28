import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

function normalizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text.toLowerCase().trim();
}

// Strip common Thai company prefixes/suffixes for better fuzzy matching
function normalizeCompanyName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/บริษัทจัดหางาน/g, "")
    .replace(/บริษัท/g, "")
    .replace(/บจก\./g, "")
    .replace(/จำกัด/g, "")
    .replace(/จก\./g, "")
    .replace(/\(มหาชน\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectSuspiciousPatterns(text) {
  if (!text) return [];
  const normalized = normalizeText(text);
  return ["รับเงินด่วน", "รวยเร็ว", "งานง่าย", "ได้เงินเร็ว", "ไม่ต้องลงทุน", "รับเงินทันที"]
    .filter((kw) => normalized.includes(normalizeText(kw)))
    .map((kw) => `พบคำที่น่าสงสัย: "${kw}"`);
}

export async function POST(request) {
  try {
    const { agencyName, contactInfo, hasUpfrontFee, isSocialContact } =
      await request.json();

    if (!agencyName && !contactInfo && !hasUpfrontFee && !isSocialContact) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลอย่างน้อย 1 ช่อง" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // Rate limiting: max 30 checks per IP per hour
    if (ip !== "unknown") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("risk_checks")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ip)
        .gte("created_at", oneHourAgo);

      if (count >= 30) {
        return NextResponse.json(
          { error: "คุณตรวจสอบบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่" },
          { status: 429 }
        );
      }
    }

    let score = 0;
    const reasons = [];
    const normalizedAgency  = normalizeText(agencyName);
    const normalizedContact = normalizeText(contactInfo);
    const normalizedCoreName = normalizeCompanyName(agencyName);

    // Suspicious keyword check
    if (agencyName) {
      const patterns = detectSuspiciousPatterns(agencyName);
      if (patterns.length > 0) { score += 15; reasons.push(...patterns); }
    }

    // Blacklist check (Supabase)
    let inBlacklist = false;
    try {
      const { data: blMatches } = await supabase
        .from("blacklist")
        .select("name, contacts")
        .eq("status", "active");

      inBlacklist = (blMatches ?? []).some((item) => {
        const itemCore = normalizeCompanyName(item.name);
        if (normalizedCoreName && itemCore) {
          if (itemCore.includes(normalizedCoreName) || normalizedCoreName.includes(itemCore)) return true;
        }
        if (normalizedContact && item.contacts?.length) {
          return item.contacts.some((c) => {
            const nc = normalizeText(c);
            return nc && (normalizedContact.includes(nc) || nc.includes(normalizedContact));
          });
        }
        return false;
      });
    } catch (err) {
      console.error("Blacklist lookup failed:", err.message);
    }

    if (inBlacklist) {
      score += 50;
      reasons.push("ตรวจพบข้อมูลในฐานข้อมูลเฝ้าระวัง (Blacklist)");
    }

    // Whitelist check (Supabase agencies table)
    let inWhitelist = false;
    if (agencyName) {
      try {
        const { data: wlMatches } = await supabase
          .from("agencies")
          .select("name_th, name_en, license_no")
          .or(
            `name_th.ilike.%${normalizedCoreName}%,name_en.ilike.%${normalizedCoreName}%,` +
            `name_th.ilike.%${agencyName}%,name_en.ilike.%${agencyName}%`
          )
          .limit(1);

        inWhitelist = wlMatches && wlMatches.length > 0;
      } catch (err) {
        console.error("Whitelist lookup failed:", err.message);
      }
    }

    if (inWhitelist) {
      score -= 20;
      reasons.push("ตรวจพบชื่อบริษัทในรายชื่อผู้ได้รับอนุญาต (Whitelist)");
    } else if (agencyName) {
      score += 15;
      reasons.push("ไม่พบชื่อบริษัทในรายชื่อผู้ได้รับอนุญาต (Whitelist) ที่เรามี");
    }

    if (hasUpfrontFee)   { score += 40; reasons.push("มีการเรียกเก็บเงินล่วงหน้า (ค่าดำเนินการ/ค่าหัว)"); }
    if (isSocialContact) { score += 10; reasons.push("การติดต่อเกิดขึ้นผ่านช่องทางโซเชียลมีเดียส่วนตัว"); }

    const riskLevel = score > 40 ? "high" : score > 10 ? "medium" : "low";
    const finalReasons = reasons.length > 0 ? reasons : ["ไม่พบความเสี่ยงที่เห็นได้ชัดเจน"];

    // Store submission (fire-and-forget)
    supabase.from("risk_checks").insert({
      agency_name:       agencyName || null,
      contact_info:      contactInfo || null,
      has_upfront_fee:   hasUpfrontFee,
      is_social_contact: isSocialContact,
      score,
      risk_level:        riskLevel,
      reasons:           finalReasons,
      in_whitelist:      inWhitelist,
      in_blacklist:      inBlacklist,
      ip_address:        ip,
    }).then(({ error }) => {
      if (error) console.error("Failed to store risk check:", error.message);
    });

    return NextResponse.json({ score, riskLevel, reasons: finalReasons });
  } catch (error) {
    console.error("Error in check-risk API:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการประมวลผล" },
      { status: 500 }
    );
  }
}
