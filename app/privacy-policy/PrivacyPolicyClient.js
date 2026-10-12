"use client";

import { Mail } from "lucide-react";

const sections = [
  {
    id: 1,
    title: "1. ข้อมูลที่เราเก็บรวบรวม",
    content: [
      "ข้อมูลที่ท่านกรอกในแบบประเมินความเสี่ยง เช่น ชื่อบริษัท ช่องทางติดต่อ และสัญญาณความเสี่ยงที่เลือก",
      "ผลการประเมินจากระบบ เช่น ระดับความเสี่ยง คะแนน และเหตุผลประกอบ",
      "ข้อมูลที่ท่านส่งผ่านแบบรายงานมิจฉาชีพ เช่น รายละเอียดเหตุการณ์ หลักฐาน ชื่อหรือเบอร์ผู้แจ้ง (ถ้ามี)",
      "ข้อมูลทางเทคนิคที่จำเป็น เช่น IP Address เพื่อป้องกันการใช้งานผิดปกติ และข้อมูลการใช้งานเชิงสถิติผ่านระบบวิเคราะห์เว็บไซต์",
    ],
  },
  {
    id: 2,
    title: "2. วัตถุประสงค์ในการใช้ข้อมูล",
    content: [
      "เพื่อให้บริการตรวจสอบและประเมินความเสี่ยงก่อนเดินทางไปทำงานต่างประเทศ",
      "เพื่อคัดกรองการใช้งานผิดปกติ เช่น การส่งคำขอจำนวนมากผิดปกติ และการสแปมรายงาน",
      "เพื่อใช้ตรวจสอบ วิเคราะห์ และติดตามข้อมูลเบาะแสที่มีการรายงานเข้ามา",
      "เพื่อปรับปรุงคุณภาพฐานข้อมูลและประสบการณ์ใช้งานเว็บไซต์ในภาพรวม",
    ],
  },
  {
    id: 3,
    title: "3. การเปิดเผยข้อมูลและความปลอดภัย",
    content: [
      "เราไม่ขายข้อมูลส่วนบุคคลให้บุคคลที่สาม",
      "ข้อมูลจะถูกเข้าถึงโดยทีมงานที่รับผิดชอบเท่าที่จำเป็นต่อการปฏิบัติงาน",
      "ข้อมูลบางส่วนอาจถูกเปิดเผยต่อหน่วยงานรัฐหรือหน่วยงานบังคับใช้กฎหมายเมื่อมีเหตุอันควรหรือมีข้อกำหนดตามกฎหมาย",
      "หลักฐานที่ผู้ใช้แนบอาจถูกจัดเก็บบนระบบ Cloud Storage เพื่อรองรับการตรวจสอบ",
    ],
  },
  {
    id: 4,
    title: "4. ระยะเวลาการเก็บรักษาและสิทธิตาม PDPA",
    content: [
      "เราเก็บข้อมูลเท่าที่จำเป็นตามวัตถุประสงค์ของบริการและข้อกำหนดทางกฎหมาย",
      "สิทธิในการขอเข้าถึงและรับสำเนาข้อมูล",
      "สิทธิในการขอให้แก้ไขข้อมูลให้ถูกต้อง",
      "สิทธิในการขอให้ลบหรือระงับการใช้ข้อมูล",
      "สิทธิในการถอนความยินยอม",
    ],
  },
];

export default function PrivacyPolicyClient() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl px-4 md:px-6 pt-8 md:pt-14 pb-12 md:pb-20 flex flex-col gap-6 md:gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-title1 md:text-large font-bold text-label tracking-tight">นโยบายความเป็นส่วนตัว</h1>
          <p className="text-body text-label-2">
            ระบบเก็บข้อมูลอะไร ใช้อย่างไร และคุณใช้สิทธิตาม PDPA ได้อย่างไร
          </p>
          <p className="text-footnote text-label-2">อัปเดตล่าสุด พฤษภาคม 2569</p>
        </header>

        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`pp-${section.id}`} className="flex flex-col gap-3">
            <h2 id={`pp-${section.id}`} className="text-title3 font-bold text-label px-1">
              {section.title}
            </h2>
            <ul className="inset-list">
              {section.content.map((item, i) => (
                <li key={i} className="px-4 py-3 text-callout text-label">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="pp-contact" className="card p-5 md:p-6 flex flex-col gap-3">
          <h2 id="pp-contact" className="text-headline font-bold text-label">
            มีคำถามหรือต้องการใช้สิทธิ?
          </h2>
          <p className="text-callout text-label-2">ติดต่อทีมงานผู้ดูแลข้อมูลส่วนบุคคล</p>
          <a href="mailto:thaimigrantwatchs@gmail.com" className="btn btn-tinted self-start">
            <Mail size={18} aria-hidden="true" /> thaimigrantwatchs@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
}
