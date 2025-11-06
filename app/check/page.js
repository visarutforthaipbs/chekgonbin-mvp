"use client";

import {
  Box,
  Heading,
  Input,
  Checkbox,
  Button,
  VStack,
  Container,
  Text,
  Stack,
  createToaster,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const toaster = createToaster({
  placement: "top-right",
  duration: 5000,
});

export default function Check() {
  const [formData, setFormData] = useState({
    agencyName: "",
    contactInfo: "",
    hasUpfrontFee: false,
    isSocialContact: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/check-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("เกิดข้อผิดพลาดในการประมวลผล");
      }

      const result = await res.json();

      // ส่งผลลัพธ์ไปหน้า Result Page ผ่าน Query Params
      router.push(`/result?data=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (error) {
      setIsLoading(false);
      toaster.create({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        type: "error",
      });
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack as="form" spacing={6} onSubmit={handleSubmit}>
        <Heading as="h1" mb={6} color="brand.500">
          กรอกข้อมูลเพื่อตรวจสอบ
        </Heading>

        <Stack width="100%" gap={2}>
          <Text fontWeight="medium">1. ชื่อบริษัทจัดหางาน (ถ้ามี)</Text>
          <Input
            name="agencyName"
            placeholder="เช่น บจก. จัดหางาน..."
            value={formData.agencyName}
            onChange={handleChange}
          />
        </Stack>

        <Stack width="100%" gap={2}>
          <Text fontWeight="medium">
            2. อีเมล/เบอร์ติดต่อ/LINE ID นายหน้า (อย่างใดอย่างหนึ่ง)
          </Text>
          <Input
            name="contactInfo"
            placeholder="เช่น 081-xxx-xxxx หรือ example@gmail.com"
            value={formData.contactInfo}
            onChange={handleChange}
          />
        </Stack>

        <Box width="100%">
          <Checkbox.Root
            checked={formData.hasUpfrontFee}
            onCheckedChange={(details) =>
              setFormData((prev) => ({
                ...prev,
                hasUpfrontFee: details.checked,
              }))
            }
            colorPalette="brand"
          >
            <Checkbox.Control />
            <Checkbox.Label>
              3. มีการเรียกเก็บเงินล่วงหน้าหรือไม่? (เช่น ค่าหัว,
              ค่าดำเนินการก่อนได้งาน)
            </Checkbox.Label>
          </Checkbox.Root>
        </Box>

        <Box width="100%">
          <Checkbox.Root
            checked={formData.isSocialContact}
            onCheckedChange={(details) =>
              setFormData((prev) => ({
                ...prev,
                isSocialContact: details.checked,
              }))
            }
            colorPalette="brand"
          >
            <Checkbox.Control />
            <Checkbox.Label>
              4. ติดต่อผ่านโซเชียลมีเดียส่วนตัวใช่หรือไม่? (เช่น Facebook
              ส่วนตัว, IG)
            </Checkbox.Label>
          </Checkbox.Root>
        </Box>

        <Button
          type="submit"
          size="lg"
          loading={isLoading}
          loadingText="กำลังประมวลผล"
          width="100%"
          mt={4}
          css={{
            backgroundColor: "var(--colors-danger-500)",
            color: "white",
            "&:hover": {
              backgroundColor: "var(--colors-danger-600)",
            },
            "&:active": {
              backgroundColor: "var(--colors-danger-700)",
            },
          }}
        >
          วิเคราะห์ความเสี่ยง
        </Button>
      </VStack>
      {toaster.Toaster}
    </Container>
  );
}
