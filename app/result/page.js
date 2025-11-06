"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState(() => {
    // Initialize state directly from searchParams to avoid effect setState
    const data = searchParams.get("data");
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse result data", e);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    // Redirect if no result
    if (!result) {
      router.push("/");
    }
  }, [result, router]);

  if (!result) {
    return (
      <Container centerContent py={20}>
        <Text>กำลังโหลดผลลัพธ์...</Text>
      </Container>
    );
  }

  // กำหนดสีและข้อความตาม Risk Level
  const riskConfig = {
    low: {
      color: "green.500",
      text: "ความเสี่ยงต่ำ",
      icon: "✓",
      bgColor: "green.100",
    },
    medium: {
      color: "yellow.500",
      text: "ความเสี่ยงปานกลาง (ควรตรวจสอบเพิ่ม)",
      icon: "⚠",
      bgColor: "yellow.100",
    },
    high: {
      color: "red.500",
      text: "ความเสี่ยงสูง (อันตราย)",
      icon: "⚠",
      bgColor: "red.100",
    },
  };

  const config = riskConfig[result.riskLevel];

  return (
    <Container
      maxW="container.md"
      py={{ base: 8, md: 10, lg: 12 }}
      px={{ base: 4, md: 6 }}
      centerContent
    >
      <VStack
        spacing={6}
        width="100%"
        maxW={{ base: "100%", md: "600px", lg: "700px" }}
        mx="auto"
      >
        <Heading as="h1" color="brand.500" textAlign="center">
          ผลการตรวจสอบ
        </Heading>

        <Box
          w="100%"
          bg={config.bgColor}
          borderColor={config.color}
          borderWidth={2}
          borderRadius="md"
          p={6}
          textAlign="center"
        >
          <Heading as="h2" size="lg" color={config.color}>
            {config.text}
          </Heading>
          <Text fontSize="md">(คะแนนความเสี่ยง: {result.score})</Text>
        </Box>

        <VStack spacing={3} align="stretch" w="100%">
          <Heading as="h3" size="md">
            เหตุผลประกอบการประเมิน:
          </Heading>
          <VStack spacing={3} align="stretch">
            {result.reasons.length > 0 ? (
              result.reasons.map((reason, index) => (
                <HStack key={index} align="flex-start">
                  <Text color={config.color} fontSize="xl" fontWeight="bold">
                    {config.icon}
                  </Text>
                  <Text>{reason}</Text>
                </HStack>
              ))
            ) : (
              <HStack align="flex-start">
                <Text color="gray.500" fontSize="xl" fontWeight="bold">
                  ✓
                </Text>
                <Text>ไม่พบข้อมูลที่น่าสงสัยในฐานข้อมูลของเรา</Text>
              </HStack>
            )}
          </VStack>
        </VStack>

        <Box textAlign="center" pt={4} w="100%">
          <Text fontSize="sm" color="gray.600" mb={4} px={{ base: 2, md: 4 }}>
            *การประเมินนี้เป็นเพียงการตรวจสอบเบื้องต้น
            โดยใช้ฐานข้อมูลที่มีและกฎที่ตั้งไว้เท่านั้น
            โปรดใช้วิจารณญาณและตรวจสอบกับกรมการจัดหางานอีกครั้ง
          </Text>
          <Link href="/" passHref>
            <Button
              colorPalette="brand"
              variant="outline"
              size={{ base: "md", md: "lg" }}
              px={{ base: 8, md: 12 }}
            >
              ตรวจสอบอีกครั้ง
            </Button>
          </Link>
        </Box>
      </VStack>
    </Container>
  );
}

export default function Result() {
  return (
    <Suspense
      fallback={
        <Container centerContent py={20}>
          <Text>กำลังโหลดผลลัพธ์...</Text>
        </Container>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
