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
  Grid,
  Button,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaDownload,
  FaMapLocationDot,
  FaArrowRight,
} from "react-icons/fa6";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

const stories = [
  {
    id: 1,
    title: "บทเรียนจากการหลอกลวง",
    thumbnail: "https://via.placeholder.com/300x200/4299E1/FFFFFF?text=Story+1",
    description: "เรื่องจริงจากผู้ประสบภัยคนแรก ที่เข้าใจสัญญาณเตือน",
  },
  {
    id: 2,
    title: "วิธีตรวจสอบความสัตย์",
    thumbnail: "https://via.placeholder.com/300x200/48BB78/FFFFFF?text=Story+2",
    description: "คำแนะนำเชิงปฏิบัติสำหรับการเลือกสรรทัวร์",
  },
  {
    id: 3,
    title: "ศักยภาพมาจากการแบ่งปัน",
    thumbnail: "https://via.placeholder.com/300x200/ED8936/FFFFFF?text=Story+3",
    description: "ชุมชนช่วยเหลือซึ่งกันและกัน",
  },
  {
    id: 4,
    title: "สัญญาณอันตรายส่วนตัว",
    thumbnail: "https://via.placeholder.com/300x200/D69E2E/FFFFFF?text=Story+4",
    description: "เครื่องหมายที่ยอดนิยมสำหรับการหลอกลวง",
  },
  {
    id: 5,
    title: "เมื่อไม่ต้องกลัว",
    thumbnail: "https://via.placeholder.com/300x200/9F7AEA/FFFFFF?text=Story+5",
    description: "การตั้งสำนักหลังจากการตรวจสอบ",
  },
  {
    id: 6,
    title: "รายประกอบการนั่นดี",
    thumbnail: "https://via.placeholder.com/300x200/38B2AC/FFFFFF?text=Story+6",
    description: "สัญญาณของบริษัทจริง",
  },
];

const infographics = [
  {
    id: 1,
    title: "15 สัญญาณอันตรายหลัก",
    image:
      "https://via.placeholder.com/400x500/4299E1/FFFFFF?text=Infographic+1",
  },
  {
    id: 2,
    title: "ขั้นตอนการตรวจสอบ",
    image:
      "https://via.placeholder.com/400x500/48BB78/FFFFFF?text=Infographic+2",
  },
  {
    id: 3,
    title: "โครงสร้างค่าใช้จ่ายชอบธรรม",
    image:
      "https://via.placeholder.com/400x500/ED8936/FFFFFF?text=Infographic+3",
  },
  {
    id: 4,
    title: "หลักฐานที่ต้องการ",
    image:
      "https://via.placeholder.com/400x500/D69E2E/FFFFFF?text=Infographic+4",
  },
];

const routes = [
  {
    id: 1,
    title: "เส้นทางปลอดภัยไปต่างประเทศ",
    steps: [
      "วิจัยบริษัทนายหน้า",
      "ยืนยันหลักฐานการจ้างอย่างแท้จริง",
      "ตรวจสอบสัญญา",
      "ติดต่อสถานทูต",
      "แจ้งสัญญาณเตือนให้ทีม",
    ],
  },
  {
    id: 2,
    title: "ถ้าคุณเป็นเหยื่อ",
    steps: [
      "หยุดการติดต่อทันที",
      "รวบรวมหลักฐาน",
      "แจ้งเรื่องให้สำนัก",
      "ติดต่อสายด่วนแรงงาน",
      "พิจารณาคำปรึกษากฎหมาย",
    ],
  },
];

export default function MediaHub() {
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
          <VStack spacing={20} align="stretch" width="100%">
            {/* Hero Section */}
            <MotionVStack
              spacing={4}
              textAlign="center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                color="brand.700"
                lineHeight="shorter"
                fontWeight="extrabold"
              >
                ศูนย์ความรู้ CHEK GON BIN
              </Heading>
              <Text
                color="gray.600"
                fontSize={{ base: "lg", md: "xl" }}
                maxW="600px"
              >
                เรียนรู้วิธีปกป้องตัวเองจากการหลอกลวง และทำให้ชุมชนปลอดภัยขึ้น
              </Text>
            </MotionVStack>

            {/* Stories Section */}
            <MotionVStack
              spacing={8}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              align="stretch"
            >
              <VStack spacing={2} align="flex-start">
                <Heading size="xl" color="gray.800">
                  เรื่องเล่าของผู้ประสบภัย
                </Heading>
                <Text color="gray.600">
                  เรียนรู้จากประสบการณ์จริงของผู้อื่น
                </Text>
              </VStack>

              <Grid
                gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={6}
              >
                {stories.map((story, idx) => (
                  <MotionBox
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Card.Root
                      variant="elevated"
                      borderRadius="xl"
                      overflow="hidden"
                      boxShadow="md"
                      _hover={{
                        boxShadow: "lg",
                        transform: "translateY(-4px)",
                      }}
                      transition="all 0.3s"
                      cursor="pointer"
                    >
                      <Box position="relative">
                        <Image
                          src={story.thumbnail}
                          alt={story.title}
                          w="100%"
                          h="200px"
                          objectFit="cover"
                        />
                        <Box
                          position="absolute"
                          inset={0}
                          bg="blackAlpha.40"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          opacity={0}
                          _groupHover={{ opacity: 1 }}
                          transition="opacity 0.3s"
                        >
                          <Icon
                            as={FaPlay}
                            boxSize={12}
                            color="white"
                            filter="drop-shadow(0 2px 8px rgba(0,0,0,0.3))"
                          />
                        </Box>
                      </Box>
                      <Card.Body p={4}>
                        <Heading size="sm" mb={2} color="gray.800">
                          {story.title}
                        </Heading>
                        <Text fontSize="sm" color="gray.600">
                          {story.description}
                        </Text>
                      </Card.Body>
                    </Card.Root>
                  </MotionBox>
                ))}
              </Grid>
            </MotionVStack>

            {/* Infographics Section */}
            <MotionVStack
              spacing={8}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              align="stretch"
            >
              <VStack spacing={2} align="flex-start">
                <Heading size="xl" color="gray.800">
                  เนื้อหาข้อมูล
                </Heading>
                <Text color="gray.600">ดาวน์โหลดและแบ่งปันข้อมูล</Text>
              </VStack>

              <Grid
                gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={6}
              >
                {infographics.map((item, idx) => (
                  <MotionBox
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Card.Root
                      variant="elevated"
                      borderRadius="xl"
                      overflow="hidden"
                      boxShadow="md"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        w="100%"
                        h="300px"
                        objectFit="cover"
                      />
                      <Card.Body p={4}>
                        <HStack justify="space-between" width="100%">
                          <Heading size="sm" color="gray.800">
                            {item.title}
                          </Heading>
                          <Button
                            size="sm"
                            colorPalette="brand"
                            variant="ghost"
                            _hover={{ bg: "brand.50" }}
                          >
                            <Icon as={FaDownload} />
                          </Button>
                        </HStack>
                      </Card.Body>
                    </Card.Root>
                  </MotionBox>
                ))}
              </Grid>
            </MotionVStack>

            {/* Safe Routes Section */}
            <MotionVStack
              spacing={8}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              align="stretch"
            >
              <VStack spacing={2} align="flex-start">
                <Heading size="xl" color="gray.800">
                  เส้นทางปลอดภัย
                </Heading>
                <Text color="gray.600">คำแนะนำทีละขั้นตอน</Text>
              </VStack>

              <Grid
                gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={6}
              >
                {routes.map((route, idx) => (
                  <MotionBox
                    key={route.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Card.Root
                      variant="elevated"
                      borderRadius="xl"
                      boxShadow="md"
                      bg="gradient.subtle"
                      borderWidth="1px"
                      borderColor="brand.100"
                    >
                      <Card.Body p={6}>
                        <VStack spacing={4} align="stretch">
                          <HStack>
                            <Icon
                              as={FaMapLocationDot}
                              boxSize={6}
                              color="brand.600"
                            />
                            <Heading size="md" color="gray.800">
                              {route.title}
                            </Heading>
                          </HStack>
                          <VStack spacing={3} align="stretch">
                            {route.steps.map((step, stepIdx) => (
                              <HStack
                                key={stepIdx}
                                spacing={3}
                                p={3}
                                borderRadius="lg"
                                bg="white"
                                borderWidth="1px"
                                borderColor="gray.100"
                              >
                                <Box
                                  w={8}
                                  h={8}
                                  borderRadius="full"
                                  bg="brand.500"
                                  color="white"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  fontWeight="bold"
                                  fontSize="sm"
                                  flexShrink={0}
                                >
                                  {stepIdx + 1}
                                </Box>
                                <Text
                                  color="gray.700"
                                  fontSize="sm"
                                  fontWeight="500"
                                >
                                  {step}
                                </Text>
                              </HStack>
                            ))}
                          </VStack>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  </MotionBox>
                ))}
              </Grid>
            </MotionVStack>

            {/* CTA Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card.Root
                variant="elevated"
                borderRadius="2xl"
                boxShadow="xl"
                bgGradient="to-r"
                gradientFrom="brand.500"
                gradientTo="brand.600"
                overflow="hidden"
              >
                <Card.Body p={{ base: 6, md: 10 }}>
                  <VStack spacing={4} align="center" textAlign="center">
                    <Heading size="lg" color="white" lineHeight="shorter">
                      พบสัญญาณอันตรายใหม่?
                    </Heading>
                    <Text color="whiteAlpha.90" fontSize="lg" maxW="500px">
                      ช่วยให้เราปรับปรุงฐานข้อมูล โดยรายงานข้อมูลใหม่
                    </Text>
                    <Button
                      colorPalette="white"
                      size="lg"
                      mt={4}
                      _hover={{ transform: "translateY(-2px)" }}
                      transition="all 0.3s"
                    >
                      ไปที่หน้ารายงาน
                      <Icon as={FaArrowRight} ml={2} />
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </MotionBox>
          </VStack>
        </Container>
      </Box>
    </>
  );
}
