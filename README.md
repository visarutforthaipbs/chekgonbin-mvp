# เช็คก่อนบิน - Thai Job Scam Checker

🛡️ เครื่องมือตรวจสอบความเสี่ยงสำหรับผู้ที่กำลังพิจารณาไปทำงานต่างประเทศ

## 🚀 Overview

**เช็คก่อนบิน (ChekGonBin)** เป็นเครื่องมือช่วยตรวจสอบความเสี่ยงเบื้องต้นสำหรับผู้ที่กำลังหางานต่างประเทศ เพื่อป้องกันการโดนหลอกและมิจฉาชีพ โดยใช้ฐานข้อมูลจากกรมการจัดหางาน (DOE) และฐานข้อมูลเฝ้าระวัง (Blacklist)

## 📋 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase
- **Icons:** Lucide React
- **Animation:** Framer Motion

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- Supabase Account & Project

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup Environment Variables:
   Create `.env.local` with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   ADMIN_KEY=your_custom_admin_key_for_api
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## 🔍 Features

✅ **Real-time risk assessment:** ประเมินความเสี่ยงจากชื่อบริษัทและข้อมูลติดต่อ  
✅ **Agency Search:** ค้นหารายชื่อบริษัทจัดหางานที่ได้รับอนุญาต (Whitelist)  
✅ **Scam Reporting:** ระบบรายงานเบาะแสมิจฉาชีพจากผู้ใช้งาน  
✅ **Automated Scraper:** ระบบดึงข้อมูลอัตโนมัติจากกรมการจัดหางานทุกวัน  
✅ **Mobile-first Design:** ออกแบบตามหลัก SIGNAL 39 (Cognitive Design)

## 📁 Project Structure

- `app/` - Next.js App Router (Pages & API)
- `components/` - Shared UI components
- `scripts/` - Python scraper and utility scripts
- `utils/` - Supabase clients and helper functions
- `public/` - Static assets and fonts

## 🤖 Automated Scraper

The scraper (`scripts/scraper.py`) runs daily via GitHub Actions to keep the agency whitelist up-to-date.

## 📞 Contact

**Thai Migrant Watch**  
Email: thaimigrantwatchs@gmail.com  
Mission: คนไทยต้องไม่ไปตายดาบหน้า

---
© 2026 เช็คก่อนบิน - ป้องกันมิจฉาชีพงานต่างประเทศ
