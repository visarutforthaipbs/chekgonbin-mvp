# 🔧 การแก้ไข Chakra UI v3 Compatibility

## ปัญหาที่พบ

เมื่อรันโปรเจกต์ครั้งแรก พบ error:

```
Export extendTheme doesn't exist in target module
```

## สาเหตุ

โปรเจกต์ติดตั้ง **Chakra UI v3** (`@chakra-ui/react@3.28.1`) แต่โค้ดที่เขียนใช้ API ของ Chakra UI v2

## การแก้ไข

### 1. ไฟล์ `theme/theme.js`

**เดิม (Chakra UI v2):**
\`\`\`javascript
import { extendTheme } from "@chakra-ui/react";

const colors = {
brand: {
50: "#e0f7f4",
500: "#40bdab",
// ...
},
};

export const theme = extendTheme({ colors });
\`\`\`

**ใหม่ (Chakra UI v3):**
\`\`\`javascript
import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
theme: {
tokens: {
colors: {
brand: {
50: { value: "#e0f7f4" },
500: { value: "#40bdab" },
// ...
},
},
},
},
});
\`\`\`

### 2. ไฟล์ `app/providers.js`

**เดิม:**
\`\`\`javascript
import { theme } from "@/theme/theme";

export function Providers({ children }) {
return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
\`\`\`

**ใหม่:**
\`\`\`javascript
import { system } from "@/theme/theme";

export function Providers({ children }) {
return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
\`\`\`

## สิ่งที่เปลี่ยนแปลง

| Chakra UI v2                         | Chakra UI v3                                                |
| ------------------------------------ | ----------------------------------------------------------- |
| `extendTheme`                        | `createSystem` + `defaultConfig`                            |
| `colors: { brand: { 500: "#xxx" } }` | `tokens: { colors: { brand: { 500: { value: "#xxx" } } } }` |
| `<ChakraProvider theme={theme}>`     | `<ChakraProvider value={system}>`                           |
| Export ชื่อ `theme`                  | Export ชื่อ `system`                                        |

## การใช้งานสี

สีที่กำหนดยังคงใช้งานได้เหมือนเดิม:
\`\`\`javascript
<Button colorScheme="brand">ปุ่ม</Button>
<Heading color="brand.500">หัวข้อ</Heading>
\`\`\`

## อ้างอิง

- [Chakra UI v3 Migration Guide](https://www.chakra-ui.com/docs/get-started/migration)
- [Chakra UI v3 Theming](https://www.chakra-ui.com/docs/theming/overview)

## วิธีการทดสอบ

หลังจากแก้ไขแล้ว รันคำสั่ง:

\`\`\`bash
cd /Users/visarutsankham/check-before-fly/chekgonbin-mvp
npm run dev
\`\`\`

เปิดเบราว์เซอร์ไปที่ http://localhost:3000 และตรวจสอบว่า:

- ✅ หน้าเว็บแสดงผลได้ปกติ
- ✅ สีเขียวมรกต (#40bdab) แสดงผลถูกต้อง
- ✅ ไม่มี error ใน console

---

**แก้ไขเมื่อ:** 6 พฤศจิกายน 2025
