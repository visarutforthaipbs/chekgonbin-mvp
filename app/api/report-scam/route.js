export async function POST(request) {
  try {
    const formData = await request.json();

    // Validate required fields
    if (!formData.agencyName || !formData.description || !formData.evidence) {
      return new Response(
        JSON.stringify({
          error: "กรุณากรอกข้อมูลจำเป็น",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Here you would normally:
    // 1. Store in database
    // 2. Send email notification
    // 3. Log the report

    console.log("New scam report:", {
      agencyName: formData.agencyName,
      contactPerson: formData.contactPerson,
      contactInfo: formData.contactInfo,
      evidence: formData.evidence,
      description: formData.description,
      reporterName: formData.reporterName,
      reporterPhone: formData.reporterPhone,
      timestamp: new Date().toISOString(),
    });

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "ขอบคุณสำหรับการรายงาน",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing report:", error);
    return new Response(
      JSON.stringify({
        error: "เกิดข้อผิดพลาดในการประมวลผล",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
