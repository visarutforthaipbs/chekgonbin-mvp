"use client";

import {
  Box,
  Heading,
  Input,
  Text,
  VStack,
  Container,
  Button,
  Card,
  Icon,
  HStack,
  Textarea,
  createToaster,
} from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaBell, FaCircleCheck, FaArrowRight } from "react-icons/fa6";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

const toaster = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
});

export default function ReportScam() {
  const [formData, setFormData] = useState({
    agencyName: "",
    contactPerson: "",
    contactInfo: "",
    evidence: "",
    description: "",
    reporterName: "",
    reporterPhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/report-scam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการส่งรายงาน");
      }

      toaster.create({
        title: "ขอบคุณสำหรับการรายงาน",
        description: "เราจะตรวจสอบข้อมูลของคุณและอัปเดตฐานข้อมูล",
        type: "success",
        duration: 5000,
      });

      setFormData({
        agencyName: "",
        contactPerson: "",
        contactInfo: "",
        evidence: "",
        description: "",
        reporterName: "",
        reporterPhone: "",
      });
    } catch (error) {
      toaster.create({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาลองใหม่อีกครั้ง",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box
        bgGradient="to-b"
        gradientFrom="brand.50"
        gradientTo="white"
        minH="calc(100vh - 64px)"
      >
        <Container
          maxW="container.xl"
          py={{ base: 10, md: 16 }}
          px={{ base: 4, md: 6 }}
        >
          <VStack spacing={12} align="center" width="100%" mx="auto">
            {/* Hero Section */}
            <MotionVStack
              spacing={4}
              textAlign="center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              maxW="800px"
            >
              <Icon as={FaBell} boxSize={16} color="brand.500" mb={2} />
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                color="brand.700"
                lineHeight="shorter"
                fontWeight="extrabold"
              >
                รายงานข้อมูลเบาะแสใหม่
              </Heading>
              <Text
                color="gray.600"
                fontSize={{ base: "lg", md: "xl" }}
                maxW="600px"
              >
                ช่วยเราสร้างฐานข้อมูลให้ครอบคลุมและแม่นยำยิ่งขึ้น
                โดยรายงานข้อมูลเกี่ยวกับบริษัทหรือนายหน้าที่น่าสงสัย
              </Text>
            </MotionVStack>

            {/* Info Card */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              width="100%"
              maxW="700px"
            >
              <Card.Root
                variant="elevated"
                size="lg"
                boxShadow="lg"
                borderRadius="2xl"
                bg="brand.50"
                borderWidth="1px"
                borderColor="brand.200"
              >
                <Card.Body p={{ base: 6, md: 8 }}>
                  <VStack spacing={3} align="flex-start">
                    <HStack spacing={3}>
                      <Icon as={FaCircleCheck} boxSize={6} color="brand.600" />
                      <Text fontWeight="semibold" color="brand.800">
                        ข้อมูลจะถูกเก็บเป็นความลับ
                      </Text>
                    </HStack>
                    <Text color="brand.700" fontSize="sm" ml={9}>
                      เราเคารพความเป็นส่วนตัวของคุณและจะไม่เปิดเผยข้อมูลส่วนบุคคล
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </MotionBox>

            {/* Form Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              width="100%"
              maxW="700px"
            >
              <Card.Root
                variant="elevated"
                size="lg"
                boxShadow="xl"
                borderRadius="2xl"
                overflow="hidden"
                bg="white"
                borderWidth="1px"
                borderColor="gray.100"
              >
                <Box
                  h="6px"
                  bgGradient="to-r"
                  gradientFrom="brand.400"
                  gradientTo="brand.600"
                />
                <Card.Body p={{ base: 6, md: 10 }}>
                  <Box as="form" onSubmit={handleSubmit} width="100%">
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color="gray.700">
                        ข้อมูลเกี่ยวกับบริษัท/นายหน้า
                      </Heading>

                      <VStack spacing={2}>
                        <Text
                          fontWeight="semibold"
                          color="gray.700"
                          alignSelf="flex-start"
                        >
                          ชื่อบริษัท/นายหน้า
                        </Text>
                        <Input
                          placeholder="เช่น บจก. จัดหางาน ABC"
                          value={formData.agencyName}
                          onChange={(e) =>
                            handleInputChange("agencyName", e.target.value)
                          }
                          size="lg"
                          borderRadius="lg"
                          _focus={{ borderColor: "brand.500" }}
                        />
                      </VStack>

                      <VStack spacing={2}>
                        <Text
                          fontWeight="semibold"
                          color="gray.700"
                          alignSelf="flex-start"
                        >
                          ชื่อบุคคลที่ติดต่อ (ถ้ามี)
                        </Text>
                        <Input
                          placeholder="เช่น นายสมชาย"
                          value={formData.contactPerson}
                          onChange={(e) =>
                            handleInputChange("contactPerson", e.target.value)
                          }
                          size="lg"
                          borderRadius="lg"
                          _focus={{ borderColor: "brand.500" }}
                        />
                      </VStack>

                      <VStack spacing={2}>
                        <Text
                          fontWeight="semibold"
                          color="gray.700"
                          alignSelf="flex-start"
                        >
                          เบอร์โทรศัพท์/EMAIL/LINE ID
                        </Text>
                        <Input
                          placeholder="081-xxx-xxxx หรือ example@gmail.com"
                          value={formData.contactInfo}
                          onChange={(e) =>
                            handleInputChange("contactInfo", e.target.value)
                          }
                          size="lg"
                          borderRadius="lg"
                          _focus={{ borderColor: "brand.500" }}
                        />
                      </VStack>

                      <Heading size="md" color="gray.700" mt={6}>
                        หลักฐานและรายละเอียด
                      </Heading>

                      <VStack spacing={2}>
                        <Text
                          fontWeight="semibold"
                          color="gray.700"
                          alignSelf="flex-start"
                        >
                          รูปแบบของหลักฐาน
                        </Text>
                        <Input
                          placeholder="เช่น ข้อความ LINE, ภาพสกรีนแชต, บันทึกการโทร"
                          value={formData.evidence}
                          onChange={(e) =>
                            handleInputChange("evidence", e.target.value)
                          }
                          size="lg"
                          borderRadius="lg"
                          _focus={{ borderColor: "brand.500" }}
                        />
                      </VStack>

                      <VStack spacing={2}>
                        <Text
                          fontWeight="semibold"
                          color="gray.700"
                          alignSelf="flex-start"
                        >
                          รายละเอียดการหลอกลวง
                        </Text>
                        <Textarea
                          placeholder="อธิบายว่าเกิดอะไรขึ้น, เรียกเก็บเงินเท่าไร, สัญญาณอันตรายอะไร"
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          size="lg"
                          borderRadius="lg"
                          minH="150px"
                          _focus={{ borderColor: "brand.500" }}
                        />
                      </VStack>

                      <Heading size="md" color="gray.700" mt={6}>
                        ข้อมูลผู้รายงาน
                      </Heading>

                      <VStack spacing={2}>
                        <Text
                          fontWeight="semibold"
                          color="gray.700"
                          alignSelf="flex-start"
                        >
                          ชื่อ (ไม่บังคับ - เพื่อยืนยันหลักฐาน)
                        </Text>
                        <Input
                          placeholder="ชื่อของคุณ"
                          value={formData.reporterName}
                          onChange={(e) =>
                            handleInputChange("reporterName", e.target.value)
                          }
                          size="lg"
                          borderRadius="lg"
                          _focus={{ borderColor: "brand.500" }}
                        />
                      </VStack>

                      <VStack spacing={2}>
                        <Text
                          fontWeight="semibold"
                          color="gray.700"
                          alignSelf="flex-start"
                        >
                          เบอร์โทรศัพท์ (ไม่บังคับ)
                        </Text>
                        <Input
                          placeholder="เพื่อติดต่อยืนยันข้อมูล"
                          value={formData.reporterPhone}
                          onChange={(e) =>
                            handleInputChange("reporterPhone", e.target.value)
                          }
                          size="lg"
                          borderRadius="lg"
                          _focus={{ borderColor: "brand.500" }}
                        />
                      </VStack>

                      <Button
                        type="submit"
                        colorPalette="brand"
                        size="lg"
                        loading={isLoading}
                        width="100%"
                        mt={6}
                        py={7}
                        borderRadius="xl"
                        boxShadow="lg"
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "xl",
                        }}
                        transition="all 0.2s"
                      >
                        ส่งรายงาน <Icon as={FaArrowRight} ml={2} />
                      </Button>
                    </VStack>
                  </Box>
                </Card.Body>
              </Card.Root>
            </MotionBox>
          </VStack>
        </Container>
      </Box>
      {toaster.Toaster}
    </>
  );
}
