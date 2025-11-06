// app/api/check-risk/route.js
import { whitelist, blacklist } from "@/data/db";
import { NextResponse } from "next/server";

// Cache for normalized data
const cache = new Map();

// Helper function to normalize text for comparison
function normalizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text.toLowerCase().trim();
}

// Helper function to check for suspicious patterns
function detectSuspiciousPatterns(text) {
  if (!text) return [];
  const patterns = [];
  const normalized = normalizeText(text);

  // Check for common scam keywords
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

    // Validate input - require at least one field
    if (!agencyName && !contactInfo && !hasUpfrontFee && !isSocialContact) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลอย่างน้อย 1 ช่อง" },
        { status: 400 }
      );
    }

    let score = 0;
    const reasons = [];

    // Normalize inputs for better matching
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

    // ตรวจสอบ Blacklist (Logic: ถ้าชื่อ หรือ ข้อมูลติดต่อ ตรงกับใน Blacklist)
    const inBlacklist = blacklist.some((item) => {
      const itemName = normalizeText(item.name);

      // Check agency name match
      if (normalizedAgency && itemName) {
        if (
          itemName.includes(normalizedAgency) ||
          normalizedAgency.includes(itemName)
        ) {
          return true;
        }
      }

      // Check contact info match
      if (normalizedContact && item.contact) {
        return item.contact.some((c) => {
          const normalized = normalizeText(c);
          return (
            normalized &&
            (normalizedContact.includes(normalized) ||
              normalized.includes(normalizedContact))
          );
        });
      }

      return false;
    });

    if (inBlacklist) {
      score += 50;
      reasons.push("ตรวจพบข้อมูลในฐานข้อมูลเฝ้าระวัง (Blacklist)");
    }

    // ตรวจสอบ Whitelist (Logic: ถ้าชื่อบริษัทอยู่ใน Whitelist)
    const inWhitelist = whitelist.some((item) => {
      const itemName = normalizeText(item.name);
      return (
        normalizedAgency &&
        itemName &&
        (itemName.includes(normalizedAgency) ||
          normalizedAgency.includes(itemName))
      );
    });

    if (inWhitelist) {
      score -= 20;
      reasons.push("ตรวจพบชื่อบริษัทในรายชื่อผู้ได้รับอนุญาต (Whitelist)");
    } else if (agencyName) {
      // ถ้ากรอกชื่อบริษัท แต่ไม่เจอใน Whitelist
      score += 15;
      reasons.push(
        "ไม่พบชื่อบริษัทในรายชื่อผู้ได้รับอนุญาต (Whitelist) ที่เรามี"
      );
    }

    // ตรวจสอบ Checkbox (ตาม Logic)
    if (hasUpfrontFee) {
      score += 40;
      reasons.push("มีการเรียกเก็บเงินล่วงหน้า (ค่าดำเนินการ/ค่าหัว)");
    }

    if (isSocialContact) {
      score += 10;
      reasons.push("การติดต่อเกิดขึ้นผ่านช่องทางโซเชียลมีเดียส่วนตัว");
    }

    // สร้างผลลัพธ์
    let riskLevel = "low"; // เขียว
    if (score > 40) {
      riskLevel = "high"; // แดง
    } else if (score > 10) {
      riskLevel = "medium"; // เหลือง
    }

    // Log for debugging (can be removed in production)
    console.log("Risk Check:", {
      agencyName,
      contactInfo,
      score,
      riskLevel,
      inBlacklist,
      inWhitelist,
    });

    return NextResponse.json({
      score: score,
      riskLevel: riskLevel,
      reasons:
        reasons.length > 0 ? reasons : ["ไม่พบความเสี่ยงที่เห็นได้ชัดเจน"],
    });
  } catch (error) {
    console.error("Error in check-risk API:", error);
    return NextResponse.json(
      {
        error: "เกิดข้อผิดพลาดในการประมวลผล",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
