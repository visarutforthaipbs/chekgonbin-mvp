import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request) {
  try {
    const formData = await request.json();

    if (!formData.agencyName || !formData.description || !formData.evidence) {
      return new Response(
        JSON.stringify({ error: "กรุณากรอกข้อมูลจำเป็น" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error } = await createAdminClient()
      .from("scam_reports")
      .insert({
        agency_name:    formData.agencyName,
        contact_person: formData.contactPerson || null,
        contact_info:   formData.contactInfo || null,
        evidence:       formData.evidence,
        description:    formData.description,
        reporter_name:  formData.reporterName || null,
        reporter_phone: formData.reporterPhone || null,
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, message: "ขอบคุณสำหรับการรายงาน" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing report:", error);
    return new Response(
      JSON.stringify({ error: "เกิดข้อผิดพลาดในการประมวลผล" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
