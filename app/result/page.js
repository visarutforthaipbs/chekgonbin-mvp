"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Button,
  HStack,
  Card,
  Icon,
  Badge,
  Separator,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaCircleExclamation,
  FaArrowRotateLeft,
  FaPhone,
  FaGlobe,
  FaClipboardList,
} from "react-icons/fa6";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

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

  // Risk Config
  const riskConfig = {
    low: {
      color: "green.500",
      bg: "green.50",
      borderColor: "green.200",
      text: "ความเสี่ยงต่ำ",
      description:
        "ไม่พบสัญญาณอันตรายที่ชัดเจน แต่ควรตรวจสอบอย่างละเอียดอีกครั้ง",
      icon: FaCheckCircle,
    },
    medium: {
      color: "orange.500",
      bg: "orange.50",
      borderColor: "orange.200",
      text: "ความเสี่ยงปานกลาง",
      description:
        "พบข้อควรระวังบางประการ ควรตรวจสอบข้อมูลเพิ่มเติมกับกรมการจัดหางาน",
      icon: FaExclamationTriangle,
    },
    high: {
      color: "red.500",
      bg: "red.50",
      borderColor: "red.200",
      text: "ความเสี่ยงสูง",
      description:
        "พบสัญญาณอันตราย! โปรดระมัดระวังอย่างยิ่งและหลีกเลี่ยงการโอนเงิน",
      icon: FaCircleExclamation,
    },
  };

  const config = riskConfig[result.riskLevel] || riskConfig.medium;

  // Action Plan based on risk level
  const actionPlans = {
    low: [
      {
        icon: FaGlobe,
        title: "ตรวจสอบใบอนุญาต",
        desc: "ยืนยันว่าบริษัทได้รับอนุญาตจากกรมการจัดหางาน",
      },
      {
        icon: FaClipboardList,
        title: "ตรวจสอบเอกสาร",
        desc: "ขอเอกสารสัญญาอย่างครบถ้วนและอ่านอย่างละเอียด",
      },
    ],
    medium: [
      {
        icon: FaPhone,
        title: "ติดต่อกรมการจัดหางาน",
        desc: "โทร 1300 เพื่อยืนยันข้อมูลบริษัท",
      },
      {
        icon: FaClipboardList,
        title: "ล็อคเงินไว้ก่อน",
        desc: "อย่าโอนเงินจนกว่าจะยืนยันทุกประการ",
      },
    ],
    high: [
      {
        icon: FaPhone,
        title: "เรียกสายด่วนแรงงาน",
        desc: "โทร 1694 (สายด่วนแรงงานไทย)",
      },
      {
        icon: FaGlobe,
        title: "ติดต่อสถานทูต",
        desc: "ขอข้อมูลติดต่อสถานทูตไทยในประเทศปลายทาง",
      },
    ],
  };

  const actions = actionPlans[result.riskLevel] || actionPlans.medium;

  return (
    <Box
      bgGradient="to-b"
      gradientFrom={config.bg}
      gradientTo="white"
      minH="calc(100vh - 64px)"
    >
      <Container
        maxW="container.md"
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 6 }}
      >
        <MotionVStack
          spacing={8}
          width="100%"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Heading as="h1" size="xl" color="gray.700" textAlign="center">
            ผลการวิเคราะห์ความเสี่ยง
          </Heading>

          <Card.Root
            variant="elevated"
            size="lg"
            boxShadow="xl"
            borderRadius="2xl"
            overflow="hidden"
            bg="white"
            borderWidth="1px"
            borderColor={config.borderColor}
            w="100%"
          >
            <Box h="8px" bg={config.color} />
            <Card.Body p={{ base: 6, md: 10 }} textAlign="center">
              <VStack spacing={6}>
                <MotionBox
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.2,
                  }}
                >
                  <Icon as={config.icon} boxSize={24} color={config.color} />
                </MotionBox>

                <VStack spacing={2}>
                  <Heading size="2xl" color={config.color}>
                    {config.text}
                  </Heading>
                  <Text fontSize="lg" color="gray.600" maxW="md">
                    {config.description}
                  </Text>
                </VStack>

                <Badge
                  colorPalette={
                    result.riskLevel === "high"
                      ? "red"
                      : result.riskLevel === "medium"
                      ? "orange"
                      : "green"
                  }
                  variant="subtle"
                  size="lg"
                  px={4}
                  py={1}
                  borderRadius="full"
                >
                  คะแนนความเสี่ยง: {result.score}
                </Badge>

                <Separator my={4} />

                <VStack spacing={4} align="stretch" w="100%" textAlign="left">
                  <Heading as="h3" size="md" color="gray.700">
                    รายละเอียดการประเมิน:
                  </Heading>
                  <VStack spacing={3} align="stretch">
                    {result.reasons.length > 0 ? (
                      result.reasons.map((reason, index) => (
                        <MotionBox
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          p={4}
                          bg="gray.50"
                          borderRadius="lg"
                          borderLeftWidth="4px"
                          borderLeftColor={config.color}
                        >
                          <HStack align="flex-start" spacing={3}>
                            <Icon
                              as={FaCircleExclamation}
                              color={config.color}
                              mt={1}
                            />
                            <Text color="gray.700">{reason}</Text>
                          </HStack>
                        </MotionBox>
                      ))
                    ) : (
                      <Box
                        p={4}
                        bg="green.50"
                        borderRadius="lg"
                        borderLeftWidth="4px"
                        borderLeftColor="green.500"
                      >
                        <HStack align="flex-start" spacing={3}>
                          <Icon as={FaCheckCircle} color="green.500" mt={1} />
                          <Text color="green.800">
                            ไม่พบปัจจัยเสี่ยงในฐานข้อมูลเบื้องต้น
                          </Text>
                        </HStack>
                      </Box>
                    )}
                  </VStack>
                </VStack>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Action Plan Section */}
          <Card.Root
            variant="elevated"
            size="lg"
            boxShadow="lg"
            borderRadius="2xl"
            bg="white"
            borderWidth="1px"
            borderColor="gray.100"
            w="100%"
          >
            <Card.Body p={{ base: 6, md: 8 }}>
              <VStack spacing={6} align="stretch">
                <Heading size="md" color="brand.700">
                  📋 แนวทางการดำเนินการ
                </Heading>
                <VStack spacing={3} align="stretch">
                  {actions.map((action, idx) => (
                    <MotionBox
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      p={4}
                      bg="gray.50"
                      borderRadius="lg"
                      borderLeftWidth="4px"
                      borderLeftColor="brand.500"
                    >
                      <HStack align="flex-start" spacing={3}>
                        <Icon as={action.icon} color="brand.600" mt={1} />
                        <VStack align="flex-start" spacing={1}>
                          <Text fontWeight="semibold" color="gray.800">
                            {action.title}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {action.desc}
                          </Text>
                        </VStack>
                      </HStack>
                    </MotionBox>
                  ))}
                </VStack>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Emergency Hotlines */}
          <Card.Root
            variant="outline"
            size="lg"
            borderRadius="2xl"
            borderColor={config.color}
            bg={config.bg}
            w="100%"
          >
            <Card.Body p={{ base: 6, md: 8 }}>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color={config.color}>
                  📞 เบอร์ติดต่อฉุกเฉิน
                </Heading>
                <HStack spacing={4} flexWrap="wrap">
                  <VStack align="flex-start" spacing={1} flex="1" minW="200px">
                    <Text fontWeight="semibold" color="gray.800">
                      สายด่วนแรงงาน
                    </Text>
                    <Heading size="lg" color={config.color}>
                      1694
                    </Heading>
                  </VStack>
                  <VStack align="flex-start" spacing={1} flex="1" minW="200px">
                    <Text fontWeight="semibold" color="gray.800">
                      กรมการจัดหางาน
                    </Text>
                    <Heading size="lg" color={config.color}>
                      1300
                    </Heading>
                  </VStack>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Box textAlign="center" w="100%">
            <Text fontSize="sm" color="gray.500" mb={6} maxW="600px" mx="auto">
              *ผลลัพธ์นี้เป็นการประเมินเบื้องต้นจากข้อมูลที่คุณให้มาเท่านั้น
              ไม่สามารถรับรองความปลอดภัยได้ 100%
              โปรดตรวจสอบกับกรมการจัดหางานโดยตรงอีกครั้ง
            </Text>
            <Link href="/" passHref>
              <Button
                colorPalette="brand"
                variant="outline"
                size="xl"
                px={8}
                borderRadius="xl"
                _hover={{ bg: "brand.50" }}
              >
                <Icon as={FaArrowRotateLeft} mr={2} /> ตรวจสอบใหม่
              </Button>
            </Link>
          </Box>
        </MotionVStack>
      </Container>
    </Box>
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
