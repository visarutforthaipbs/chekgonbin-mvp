// Greeting sent to new friends of the LINE OA (app/api/line/webhook). Owner-reviewed copy only.
// Same wording rules as the site: see scripts/test-countries.mjs BANNED list.
const LIFF = "https://liff.line.me/2012240595-SxwiOV5l";

export const GREETING_TEXT = `สวัสดีค่ะ ขอบคุณที่เพิ่ม Thai Migrant Watch เป็นเพื่อน

ก่อนโอนเงินให้ใคร เพื่อไปทำงานต่างประเทศ เช็ก 3 อย่างนี้ก่อน
1. บริษัทมีใบอนุญาตไหม
2. งานนี้มีใบอนุญาตไหม
3. โฆษณาแบบนี้คือหลอกไหม

กดเมนูด้านล่างได้เลยค่ะ หรือเปิดที่นี่
${LIFF}

อยู่ต่างประเทศแล้วมีปัญหา กดปุ่ม "ฉุกเฉิน" ในเมนู

ถ้ามีคนเรียกค่าสมัครหรือค่าบริการ โทร 1506 กด 2 หรือ 1694 ก่อนโอน

เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน`;

export const GREETING = [{ type: "text", text: GREETING_TEXT }];
