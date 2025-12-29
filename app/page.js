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
  Card,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import {
  FaBuilding,
  FaPhone,
  FaMoneyBillWave,
  FaUserTie,
  FaArrowRight,
  FaShieldHalved,
  FaPenToSquare,
  FaCheck,
  FaChartLine,
} from "react-icons/fa6";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

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
              <Icon as={FaShieldHalved} boxSize={16} color="brand.500" mb={2} />
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                color="brand.700"
                lineHeight="shorter"
                fontWeight="extrabold"
              >
                เช็คให้ชัวร์ ก่อนตัวไปทำงาน
              </Heading>
              <Text
                color="gray.600"
                fontSize={{ base: "lg", md: "xl" }}
                maxW="600px"
              >
                เครื่องมือตรวจสอบความเสี่ยงเบื้องต้นสำหรับผู้ที่กำลังหางานต่างประเทศ
                ช่วยให้คุณตัดสินใจได้อย่างมั่นใจและปลอดภัยยิ่งขึ้น
              </Text>
            </MotionVStack>

            {/* Problem Statement Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              width="100%"
            >
              <Card.Root
                variant="elevated"
                size="lg"
                boxShadow="lg"
                borderRadius="2xl"
                bg="white"
                borderWidth="1px"
                borderColor="gray.100"
              >
                <Card.Body p={{ base: 6, md: 8 }}>
                  <VStack spacing={4} align="stretch">
                    <Heading size="lg" color="brand.700">
                      ความเป็นจริงของปัญหา
                    </Heading>
                    <Text color="gray.600" fontSize="md" lineHeight="tall">
                      ในปี 2567 มีแรงงานไทยกว่า 1,000
                      คนตกเป็นเหยื่อการหลอกลวงไปทำงานต่างประเทศ
                      ส่งผลให้เสียหายรวมกว่า{" "}
                      <Text as="span" fontWeight="bold" color="brand.600">
                        44.2 ล้านบาท
                      </Text>
                    </Text>
                    <Text color="gray.600" fontSize="md">
                      การตรวจสอบอย่างรอบคอบก่อนตัดสินใจเป็นวิธีที่ดีที่สุดในการปกป้องตัวเอง
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </MotionBox>

            {/* How It Works Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              width="100%"
            >
              <VStack spacing={6} align="stretch">
                <Heading size="lg" textAlign="center" color="brand.700">
                  วิธีการทำงาน
                </Heading>
                <HStack spacing={4} justify="center" flexWrap="wrap">
                  {[
                    {
                      icon: FaPenToSquare,
                      title: "ขั้นตอนที่ 1",
                      desc: "กรอกข้อมูลบริษัท/นายหน้า",
                    },
                    {
                      icon: FaChartLine,
                      title: "ขั้นตอนที่ 2",
                      desc: "ระบบประมวลผล",
                    },
                    {
                      icon: FaCheck,
                      title: "ขั้นตอนที่ 3",
                      desc: "รับผลวิเคราะห์",
                    },
                  ].map((step, idx) => (
                    <MotionBox
                      key={idx}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      flex="1"
                      minW="150px"
                    >
                      <Card.Root
                        variant="outline"
                        borderRadius="xl"
                        textAlign="center"
                        p={4}
                        borderColor="brand.200"
                      >
                        <Icon
                          as={step.icon}
                          boxSize={10}
                          color="brand.500"
                          mb={3}
                          mx="auto"
                        />
                        <Heading size="sm" color="brand.700" mb={2}>
                          {step.title}
                        </Heading>
                        <Text fontSize="sm" color="gray.600">
                          {step.desc}
                        </Text>
                      </Card.Root>
                    </MotionBox>
                  ))}
                </HStack>
              </VStack>
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
                  <VStack spacing={8} align="stretch">
                    <HStack
                      spacing={3}
                      borderBottomWidth="1px"
                      pb={4}
                      borderColor="gray.100"
                    >
                      <Box bg="brand.50" p={2} borderRadius="md">
                        <Icon as={FaBuilding} color="brand.500" boxSize={5} />
                      </Box>
                      <Heading size="md" color="gray.700">
                        กรอกข้อมูลเพื่อประเมินความเสี่ยง
                      </Heading>
                    </HStack>

                    <Box as="form" onSubmit={handleSubmit} width="100%">
                      <VStack spacing={6} align="stretch">
                        <Stack spacing={2}>
                          <Text
                            fontWeight="semibold"
                            color="gray.700"
                            fontSize={{ base: "sm", md: "md" }}
                          >
                            1. ชื่อบริษัทจัดหางาน (ถ้ามี)
                          </Text>
                          <HStack>
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
                              borderRadius="lg"
                              _focus={{ borderColor: "brand.500" }}
                            />
                          </HStack>
                        </Stack>

                        <Stack spacing={2}>
                          <Text
                            fontWeight="semibold"
                            color="gray.700"
                            fontSize={{ base: "sm", md: "md" }}
                          >
                            2. อีเมล/เบอร์ติดต่อ/LINE ID นายหน้า
                          </Text>
                          <HStack>
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
                              borderRadius="lg"
                              _focus={{ borderColor: "brand.500" }}
                            />
                          </HStack>
                        </Stack>

                        <Stack spacing={4} pt={2}>
                          <Box
                            p={4}
                            borderWidth="1px"
                            borderRadius="xl"
                            borderColor={
                              formData.hasUpfrontFee ? "brand.500" : "gray.200"
                            }
                            bg={
                              formData.hasUpfrontFee
                                ? "brand.50"
                                : "transparent"
                            }
                            transition="all 0.2s"
                            _hover={{ borderColor: "brand.400" }}
                          >
                            <Checkbox.Root
                              checked={formData.hasUpfrontFee}
                              onCheckedChange={(details) =>
                                handleInputChange(
                                  "hasUpfrontFee",
                                  details.checked
                                )
                              }
                              colorPalette="brand"
                              size="lg"
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control />
                              <HStack ml={3} spacing={3}>
                                <Icon
                                  as={FaMoneyBillWave}
                                  color={
                                    formData.hasUpfrontFee
                                      ? "brand.600"
                                      : "gray.400"
                                  }
                                />
                                <Checkbox.Label
                                  fontSize={{ base: "sm", md: "md" }}
                                  cursor="pointer"
                                  fontWeight="medium"
                                >
                                  มีการเรียกเก็บเงินล่วงหน้า (ค่าหัว,
                                  ค่าดำเนินการ)
                                </Checkbox.Label>
                              </HStack>
                            </Checkbox.Root>
                          </Box>

                          <Box
                            p={4}
                            borderWidth="1px"
                            borderRadius="xl"
                            borderColor={
                              formData.isSocialContact
                                ? "brand.500"
                                : "gray.200"
                            }
                            bg={
                              formData.isSocialContact
                                ? "brand.50"
                                : "transparent"
                            }
                            transition="all 0.2s"
                            _hover={{ borderColor: "brand.400" }}
                          >
                            <Checkbox.Root
                              checked={formData.isSocialContact}
                              onCheckedChange={(details) =>
                                handleInputChange(
                                  "isSocialContact",
                                  details.checked
                                )
                              }
                              colorPalette="brand"
                              size="lg"
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control />
                              <HStack ml={3} spacing={3}>
                                <Icon
                                  as={FaUserTie}
                                  color={
                                    formData.isSocialContact
                                      ? "brand.600"
                                      : "gray.400"
                                  }
                                />
                                <Checkbox.Label
                                  fontSize={{ base: "sm", md: "md" }}
                                  cursor="pointer"
                                  fontWeight="medium"
                                >
                                  ติดต่อผ่านโซเชียลมีเดียส่วนตัว (Facebook, IG)
                                </Checkbox.Label>
                              </HStack>
                            </Checkbox.Root>
                          </Box>
                        </Stack>

                        <Button
                          type="submit"
                          colorPalette="brand"
                          size={{ base: "lg", md: "xl" }}
                          loading={isLoading}
                          width="100%"
                          mt={4}
                          fontSize={{ base: "lg", md: "xl" }}
                          py={8}
                          borderRadius="xl"
                          boxShadow="lg"
                          _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "xl",
                          }}
                          transition="all 0.2s"
                        >
                          วิเคราะห์ความเสี่ยง <Icon as={FaArrowRight} ml={2} />
                        </Button>
                      </VStack>
                    </Box>
                  </VStack>
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
