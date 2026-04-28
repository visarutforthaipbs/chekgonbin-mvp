import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { cookies } from "next/headers";
import { blacklist } from "@/data/db";
import { NextResponse } from "next/server";

function normalizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text.toLowerCase().trim();
}

function detectSuspiciousPatterns(text) {
  if (!text) return [];
  const patterns = [];
  const normalized = normalizeText(text);

  const scamKeywords = [
    "รับเงินด่วน",
    "รวยเร็ว",
    "งานง่าย",
    "ได้เงินเร็ว",
    "ไม่ต้องลงทุน",
    "รับเงินทันที",
  ];

  scamKeywords.forEach((keyword) => {
    if (normalized.includes(normalizeText(keyword))) {
      patterns.push(`พบคำที่น่าสงสัย: "${keyword}"`);
    }
  });

  return patterns;
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

    let score = 0;
    const reasons = [];

    const normalizedAgency = normalizeText(agencyName);
    const normalizedContact = normalizeText(contactInfo);

    // Check for suspicious patterns in agency name
    if (agencyName) {
      const suspiciousPatterns = detectSuspiciousPatterns(agencyName);
      if (suspiciousPatterns.length > 0) {
        score += 15;
        reasons.push(...suspiciousPatterns);
      }
    }

    // Blacklist check (CSV)
    const inBlacklist = blacklist.some((item) => {
      const itemName = normalizeText(item.name);
      if (normalizedAgency && itemName) {
        if (itemName.includes(normalizedAgency) || normalizedAgency.includes(itemName)) {
          return true;
        }
      }
      if (normalizedContact && item.contact) {
        return item.contact.some((c) => {
          const normalized = normalizeText(c);
          return (
            normalized &&
            (normalizedContact.includes(normalized) || normalized.includes(normalizedContact))
          );
        });
      }
      return false;
    });

    if (inBlacklist) {
      score += 50;
      reasons.push("ตรวจพบข้อมูลในฐานข้อมูลเฝ้าระวัง (Blacklist)");
    }

    // Whitelist check (Supabase agencies table)
    let inWhitelist = false;
    if (agencyName) {
      try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const { data: matches } = await supabase
          .from("agencies")
          .select("name_th, name_en, license_no")
          .or(`name_th.ilike.%${agencyName}%,name_en.ilike.%${agencyName}%`)
          .limit(1);

        inWhitelist = matches && matches.length > 0;
      } catch (err) {
        console.error("Supabase whitelist lookup failed:", err);
      }
    }

    if (inWhitelist) {
      score -= 20;
      reasons.push("ตรวจพบชื่อบริษัทในรายชื่อผู้ได้รับอนุญาต (Whitelist)");
    } else if (agencyName) {
      score += 15;
      reasons.push("ไม่พบชื่อบริษัทในรายชื่อผู้ได้รับอนุญาต (Whitelist) ที่เรามี");
    }

    if (hasUpfrontFee) {
      score += 40;
      reasons.push("มีการเรียกเก็บเงินล่วงหน้า (ค่าดำเนินการ/ค่าหัว)");
    }

    if (isSocialContact) {
      score += 10;
      reasons.push("การติดต่อเกิดขึ้นผ่านช่องทางโซเชียลมีเดียส่วนตัว");
    }

    let riskLevel = "low";
    if (score > 40) {
      riskLevel = "high";
    } else if (score > 10) {
      riskLevel = "medium";
    }

    const finalReasons = reasons.length > 0 ? reasons : ["ไม่พบความเสี่ยงที่เห็นได้ชัดเจน"];

    // Store submission for analysis (fire-and-forget)
    createAdminClient()
      .from("risk_checks")
      .insert({
        agency_name:       agencyName || null,
        contact_info:      contactInfo || null,
        has_upfront_fee:   hasUpfrontFee,
        is_social_contact: isSocialContact,
        score,
        risk_level:        riskLevel,
        reasons:           finalReasons,
        in_whitelist:      inWhitelist,
        in_blacklist:      inBlacklist,
      })
      .then(({ error }) => {
        if (error) console.error("Failed to store risk check:", error.message);
      });

    return NextResponse.json({ score, riskLevel, reasons: finalReasons });
  } catch (error) {
    console.error("Error in check-risk API:", error);
    return NextResponse.json(
      {
        error: "เกิดข้อผิดพลาดในการประมวลผล",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
