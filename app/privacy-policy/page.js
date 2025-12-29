"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Card,
  Icon,
  HStack,
  Separator,
  List,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaShield, FaLock, FaEye } from "react-icons/fa6";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

const sections = [
  {
    id: 1,
    title: "1. ข้อมูลที่เราเก็บรวบรวม",
    content: [
      "ชื่อและข้อมูลติดต่อ (เบอร์โทร, อีเมล)",
      "ข้อมูลเกี่ยวกับการค้นหาของคุณ (ชื่อบริษัท, รายละเอียด)",
      "ข้อมูลการแจ้งเรื่องหลอกลวง (รายละเอียด, หลักฐาน)",
      "ข้อมูลการเข้าใช้เว็บไซต์ (IP address, device info, browsing data)",
    ],
  },
  {
    id: 2,
    title: "2. วิธีใช้ข้อมูล",
    content: [
      "ให้บริการค้นหาและวิเคราะห์ความเสี่ยง",
      "อัปเดตและปรับปรุงฐานข้อมูล",
      "ติดต่อคุณเพื่อความชัดเจนหรือการติดตาม",
      "ปรับปรุงบริการและประสบการณ์ผู้ใช้",
      "ปฏิบัติตามข้อบังคับกฎหมาย",
    ],
  },
  {
    id: 3,
    title: "3. ความเป็นส่วนตัว",
    content: [
      "เราไม่ขายข้อมูลส่วนบุคคลของคุณให้บุคคลที่สาม",
      "เราเก็บข้อมูลเฉพาะเท่าที่จำเป็น",
      "ข้อมูลจะถูกเข้ารหัสและเก็บได้อย่างปลอดภัย",
      "คุณมีสิทธิ์ขอดู ลบ หรือแก้ไขข้อมูลของคุณได้",
    ],
  },
  {
    id: 4,
    title: "4. ความปลอดภัย",
    content: [
      "ใช้การเข้ารหัส SSL/TLS สำหรับการถ่ายโอนข้อมูล",
      "ระบบตรวจสอบการเข้าถึงที่เข้มงวด",
      "การตรวจสอบความปลอดภัยเป็นประจำ",
      "บุคลากรเฉพาะที่ได้รับการฝึกอบรมเท่านั้นที่สามารถเข้าถึง",
    ],
  },
  {
    id: 5,
    title: "5. นโยบาย PDPA (Personal Data Protection Act)",
    content: [
      "เราปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562",
      "คุณมีสิทธิ์ขอเข้าถึงข้อมูลของคุณ",
      "คุณมีสิทธิ์ขอให้ลบหรือแก้ไขข้อมูล",
      "คุณมีสิทธิ์ปฏิเสธการประมวลผลข้อมูล",
      "เราจะตอบสนองต่อคำขออย่างรวดเร็ว",
    ],
  },
  {
    id: 6,
    title: "6. คุกกี้ (Cookies)",
    content: [
      "ใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ",
      "สามารถปิดคุกกี้ผ่านการตั้งค่าเบราว์เซอร์",
      "คุกกี้จำเป็นเพื่อบางฟีเจอร์",
      "ไม่เก็บข้อมูลส่วนตัวในคุกกี้",
    ],
  },
  {
    id: 7,
    title: "7. การเปลี่ยนแปลง",
    content: [
      "อาจมีการปรับปรุงนโยบายฉบับนี้โดยไม่มีการแจ้งก่อน",
      "วันที่อัปเดตล่าสุด: มกราคม 2568",
      "เราสนับสนุนให้คุณตรวจสอบเป็นระยะ",
      "การใช้บริการอย่างต่อเนื่องถือว่าตกลงกับการเปลี่ยนแปลง",
    ],
  },
  {
    id: 8,
    title: "8. ติดต่อเรา",
    content: [
      "หากมีข้อกังวลเกี่ยวกับความเป็นส่วนตัว",
      "Email: privacy@chekgonbin.com",
      "สำนักงาน: ...",
      "เราจะตอบกลับภายใน 30 วัน",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <Box
      minH="calc(100vh - 64px)"
      bgGradient="to-b"
      gradientFrom="brand.50"
      gradientTo="white"
    >
      <Container
        maxW="container.lg"
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 6 }}
      >
        <VStack spacing={12} align="stretch" width="100%">
          {/* Hero Section */}
          <MotionVStack
            spacing={4}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Icon as={FaShield} boxSize={16} color="brand.500" />
            <Heading
              size={{ base: "2xl", md: "3xl" }}
              color="brand.700"
              textAlign="center"
              lineHeight="shorter"
              fontWeight="extrabold"
            >
              นโยบายความเป็นส่วนตัว
            </Heading>
            <Text
              color="gray.600"
              fontSize={{ base: "base", md: "lg" }}
              textAlign="center"
              maxW="600px"
            >
              เราเคารพความเป็นส่วนตัวของคุณและมุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของคุณ
            </Text>
            <Text color="gray.500" fontSize="sm" textAlign="center">
              วันที่อัปเดตล่าสุด: มกราคม 2568
            </Text>
          </MotionVStack>

          {/* Quick Summary */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card.Root
              variant="elevated"
              borderRadius="xl"
              boxShadow="md"
              bg="gradient.subtle"
              borderWidth="1px"
              borderColor="brand.100"
            >
              <Card.Body p={{ base: 4, md: 6 }}>
                <VStack spacing={4} align="stretch">
                  <HStack spacing={3}>
                    <Icon
                      as={FaLock}
                      boxSize={6}
                      color="brand.600"
                      flexShrink={0}
                    />
                    <Box>
                      <Text fontWeight="semibold" color="brand.800">
                        ข้อมูลของคุณปลอดภัย
                      </Text>
                      <Text color="brand.700" fontSize="sm">
                        ใช้การเข้ารหัสและมาตรการรักษาความปลอดภัยขั้นสูง
                      </Text>
                    </Box>
                  </HStack>
                  <Separator borderColor="brand.200" />
                  <HStack spacing={3}>
                    <Icon
                      as={FaEye}
                      boxSize={6}
                      color="brand.600"
                      flexShrink={0}
                    />
                    <Box>
                      <Text fontWeight="semibold" color="brand.800">
                        คุณควบคุมข้อมูลของคุณ
                      </Text>
                      <Text color="brand.700" fontSize="sm">
                        สิทธิ์ขอดู ลบ แก้ไข และปฏิเสธการประมวลผล
                      </Text>
                    </Box>
                  </HStack>
                  <Separator borderColor="brand.200" />
                  <HStack spacing={3}>
                    <Icon
                      as={FaShield}
                      boxSize={6}
                      color="brand.600"
                      flexShrink={0}
                    />
                    <Box>
                      <Text fontWeight="semibold" color="brand.800">
                        ปฏิบัติตาม PDPA
                      </Text>
                      <Text color="brand.700" fontSize="sm">
                        ปฏิบัติตามกฎหมายคุ้มครองข้อมูลส่วนบุคคลของไทย
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          </MotionBox>

          {/* Detailed Sections */}
          <VStack spacing={6} align="stretch">
            {sections.map((section, sectionIdx) => (
              <MotionBox
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + sectionIdx * 0.05 }}
              >
                <Card.Root
                  variant="elevated"
                  borderRadius="lg"
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor="gray.100"
                >
                  <Card.Body p={{ base: 5, md: 6 }}>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md" color="gray.800" fontWeight="bold">
                        {section.title}
                      </Heading>
                      <List.Root as={VStack} spacing={3} align="stretch">
                        {section.content.map((item, itemIdx) => (
                          <List.Item
                            key={itemIdx}
                            display="flex"
                            gap={3}
                            alignItems="flex-start"
                          >
                            <List.Indicator
                              boxSize={5}
                              mt={1}
                              color="brand.500"
                              flexShrink={0}
                            />
                            <Text color="gray.700" lineHeight="relaxed">
                              {item}
                            </Text>
                          </List.Item>
                        ))}
                      </List.Root>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </MotionBox>
            ))}
          </VStack>

          {/* Contact Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card.Root
              variant="elevated"
              borderRadius="xl"
              boxShadow="lg"
              bgGradient="to-r"
              gradientFrom="brand.500"
              gradientTo="brand.600"
              overflow="hidden"
            >
              <Card.Body p={{ base: 6, md: 8 }}>
                <VStack spacing={4} align="center" textAlign="center">
                  <Heading size="lg" color="white">
                    มีคำถาม เกี่ยวกับความเป็นส่วนตัวหรือไม่?
                  </Heading>
                  <Text color="whiteAlpha.90" maxW="500px" lineHeight="relaxed">
                    เราพร้อมที่จะช่วยเหลือและตอบข้อสงสัยของคุณ
                  </Text>
                  <VStack spacing={2} pt={2}>
                    <Text color="white" fontWeight="semibold">
                      Email: privacy@chekgonbin.com
                    </Text>
                    <Text color="white" fontWeight="semibold">
                      โทร: 1694 (สายด่วนแรงงาน)
                    </Text>
                  </VStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          </MotionBox>

          {/* Footer Note */}
          <Box
            p={4}
            borderRadius="lg"
            bg="gray.50"
            borderWidth="1px"
            borderColor="gray.200"
            textAlign="center"
          >
            <Text color="gray.600" fontSize="sm">
              นโยบายนี้คุ้มครองสิทธิของคุณตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล
              พ.ศ. 2562
              <br />
              หากคุณไม่เห็นด้วย คุณสามารถขอเพิกถอนความยินยอมได้ตลอดเวลา
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
