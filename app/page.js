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
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

const toaster = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
});

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    agencyName: "",
    contactInfo: "",
    hasUpfrontFee: false,
    isSocialContact: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/check-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการประมวลผล");
      }

      const result = await response.json();

      // ส่งผลลัพธ์ไปหน้า Result Page ผ่าน Query Params
      router.push(`/result?data=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (error) {
      toaster.create({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner text="กำลังวิเคราะห์ความเสี่ยง..." />}

      <Container
        maxW="container.xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, md: 6 }}
      >
        <VStack
          spacing={8}
          align="stretch"
          width="100%"
          maxW={{ base: "100%", md: "640px", lg: "700px" }}
          mx="auto"
        >
          <VStack spacing={3} textAlign="center">
            <Heading size={{ base: "xl", md: "2xl" }} color="brand.500">
              กรอกข้อมูลเพื่อตรวจสอบ
            </Heading>
            <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
              กรอกข้อมูลเท่าที่ทราบเพื่อประเมินความเสี่ยง
            </Text>
          </VStack>

          <Box as="form" onSubmit={handleSubmit} width="100%">
            <VStack spacing={6} align="stretch">
              <Stack spacing={2}>
                <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                  1. ชื่อบริษัทจัดหางาน (ถ้ามี)
                </Text>
                <Input
                  name="agencyName"
                  placeholder="เช่น บจก. จัดหางาน..."
                  value={formData.agencyName}
                  onChange={(e) =>
                    handleInputChange("agencyName", e.target.value)
                  }
                  size={{ base: "md", md: "lg" }}
                  fontSize={{ base: "sm", md: "md" }}
                  autoComplete="organization"
                />
              </Stack>

              <Stack spacing={2}>
                <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                  2. อีเมล/เบอร์ติดต่อ/LINE ID นายหน้า (อย่างใดอย่างหนึ่ง)
                </Text>
                <Input
                  name="contactInfo"
                  placeholder="081-xxx-xxxx หรือ example@gmail.com"
                  value={formData.contactInfo}
                  onChange={(e) =>
                    handleInputChange("contactInfo", e.target.value)
                  }
                  size={{ base: "md", md: "lg" }}
                  fontSize={{ base: "sm", md: "md" }}
                  autoComplete="tel email"
                />
              </Stack>

              <Stack spacing={3} pt={2}>
                <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                  3. มีการเรียกเก็บเงินล่วงหน้าหรือไม่? (เช่น ค่าหัว,
                  ค่าดำเนินการก่อนได้งาน)
                </Text>
                <Checkbox.Root
                  checked={formData.hasUpfrontFee}
                  onCheckedChange={(details) =>
                    handleInputChange("hasUpfrontFee", details.checked)
                  }
                  colorPalette="brand"
                  size={{ base: "md", md: "lg" }}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label
                    fontSize={{ base: "sm", md: "md" }}
                    cursor="pointer"
                  >
                    มีการเรียกเก็บเงิน
                  </Checkbox.Label>
                </Checkbox.Root>
              </Stack>

              <Stack spacing={3}>
                <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                  4. ติดต่อผ่านโซเชียลมีเดียส่วนตัวใช่หรือไม่? (เช่น Facebook
                  ส่วนตัว, IG)
                </Text>
                <Checkbox.Root
                  checked={formData.isSocialContact}
                  onCheckedChange={(details) =>
                    handleInputChange("isSocialContact", details.checked)
                  }
                  colorPalette="brand"
                  size={{ base: "md", md: "lg" }}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label
                    fontSize={{ base: "sm", md: "md" }}
                    cursor="pointer"
                  >
                    ติดต่อผ่านโซเชียลมีเดียส่วนตัว
                  </Checkbox.Label>
                </Checkbox.Root>
              </Stack>

              <Button
                type="submit"
                colorPalette="brand"
                size={{ base: "md", md: "lg" }}
                loading={isLoading}
                width="100%"
                mt={4}
                fontSize={{ base: "md", md: "lg" }}
                py={{ base: 6, md: 7 }}
              >
                วิเคราะห์ความเสี่ยง
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
      {toaster.Toaster}
    </>
  );
}
