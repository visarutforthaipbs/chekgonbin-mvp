import { createAdminClient } from "@/utils/supabase/admin";
import { getClientIp } from "@/utils/request";
import { NextResponse } from "next/server";

// Field length limits to prevent oversized payloads
const LIMITS = {
  agencyName:    200,
  contactPerson: 100,
  contactInfo:   200,
  evidence:      2000,
  description:   2000,
  reporterName:  100,
  reporterPhone: 20,
};

function truncate(value, max) {
  if (!value || typeof value !== "string") return null;
  return value.trim().slice(0, max) || null;
}

export async function POST(request) {
  try {
    const formData = await request.json();

    // Required field validation
    if (!formData.agencyName || !formData.description || !formData.evidence) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลจำเป็น" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const ip = getClientIp(request);

    // Rate limiting: max 5 reports per IP per hour
    if (ip !== "unknown") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("scam_reports")
        .select("*", { count: "exact", head: true })
        .eq("reporter_ip", ip)
        .gte("created_at", oneHourAgo);

      if ((count ?? 0) >= 5) {
        return NextResponse.json(
          { error: "คุณส่งรายงานบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่" },
          { status: 429 }
        );
      }
    }

    // Process screenshot base64 upload if applicable
    let evidenceValue = formData.evidence;
    if (evidenceValue && evidenceValue.startsWith("data:image/")) {
      const matches = evidenceValue.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");
        
        // Generate a unique file name
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${ext}`;
        
        // Upload buffer to Supabase Storage bucket 'evidence'
        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(filename, buffer, {
            contentType: `image/${ext}`,
            duplex: "half",
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("evidence")
          .getPublicUrl(filename);

        if (publicUrlData && publicUrlData.publicUrl) {
          evidenceValue = publicUrlData.publicUrl;
        } else {
          throw new Error("Failed to retrieve public URL for uploaded evidence");
        }
      }
    }

    // Sanitize all fields — truncate to max lengths
    const { error } = await supabase
      .from("scam_reports")
      .insert({
        agency_name:    truncate(formData.agencyName,    LIMITS.agencyName),
        contact_person: truncate(formData.contactPerson, LIMITS.contactPerson),
        contact_info:   truncate(formData.contactInfo,   LIMITS.contactInfo),
        evidence:       truncate(evidenceValue,          LIMITS.evidence),
        description:    truncate(formData.description,   LIMITS.description),
        reporter_name:  truncate(formData.reporterName,  LIMITS.reporterName),
        reporter_phone: truncate(formData.reporterPhone, LIMITS.reporterPhone),
        reporter_ip:    ip,
      });

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: "ขอบคุณสำหรับการรายงาน" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing report:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการประมวลผล" },
      { status: 500 }
    );
  }
}
