"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Separator,
  Card,
  Icon,
  HStack,
} from "@chakra-ui/react";
import {
  FaCircleCheck,
  FaDatabase,
  FaShieldHalved,
  FaTriangleExclamation,
} from "react-icons/fa6";

export default function About() {
  return (
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
        <VStack
          spacing={8}
          align="stretch"
          width="100%"
          maxW={{ base: "100%", md: "800px" }}
          mx="auto"
        >
          <Heading
            as="h1"
            size="2xl"
            textAlign="center"
            color="brand.700"
            mb={4}
          >
            เกี่ยวกับ &ldquo;เช็คก่อนบิน&rdquo;
          </Heading>

          <Card.Root
            variant="elevated"
            size="lg"
            borderRadius="2xl"
            boxShadow="lg"
            bg="white"
          >
            <Card.Body p={{ base: 6, md: 10 }}>
              <VStack spacing={6} align="stretch">
                <Text fontSize="lg" lineHeight="tall" color="gray.700">
                  <Text as="span" fontWeight="bold" color="brand.600">
                    เช็คก่อนบิน
                  </Text>{" "}
                  เป็นเครื่องมือช่วยตรวจสอบความเสี่ยงเบื้องต้น
                  สำหรับผู้ที่กำลังพิจารณาไปทำงานต่างประเทศ
                  เพื่อลดโอกาสในการตกเป็นเหยื่อของการหลอกลวงจากนายหน้าหรือบริษัทจัดหางานที่ไม่สุจริต
                </Text>
                <Text fontSize="lg" lineHeight="tall" color="gray.700">
                  โครงการนี้มุ่งหวังที่จะช่วยปกป้องแรงงานไทยจากการถูกหลอกลวงไปทำงานในต่างประเทศ
                  โดยให้ข้อมูลและเครื่องมือในการตรวจสอบความน่าเชื่อถือของบริษัทจัดหางานและนายหน้า
                  ก่อนที่จะตัดสินใจเดินทาง
                </Text>

                <Box
                  bg="orange.50"
                  p={4}
                  borderRadius="lg"
                  borderLeftWidth="4px"
                  borderLeftColor="orange.400"
                >
                  <HStack align="flex-start" spacing={3}>
                    <Icon
                      as={FaTriangleExclamation}
                      color="orange.500"
                      mt={1}
                    />
                    <Text color="orange.800">
                      <strong>หมายเหตุ:</strong> แอปพลิเคชันนี้เป็นเพียง{" "}
                      <strong>MVP (Minimum Viable Product)</strong>{" "}
                      ที่ใช้ในการทดสอบแนวคิด
                      ซึ่งใช้ฐานข้อมูลจำกัดและกฎการตรวจสอบเบื้องต้น
                      ผลลัพธ์ที่ได้เป็นเพียงการประเมินเบื้องต้นเท่านั้น
                    </Text>
                  </HStack>
                </Box>

                <Separator my={4} />

                <Heading as="h2" size="lg" color="brand.600">
                  วิธีการทำงาน
                </Heading>
                <Text color="gray.700">
                  ระบบจะตรวจสอบข้อมูลที่คุณกรอกโดยเปรียบเทียบกับ:
                </Text>

                <VStack spacing={3} align="stretch" pl={2}>
                  <HStack align="flex-start" spacing={3}>
                    <Icon as={FaCircleCheck} color="green.500" mt={1} />
                    <Text color="gray.700">
                      ฐานข้อมูลบริษัทจัดหางานที่ถูกกฎหมาย (Whitelist)
                    </Text>
                  </HStack>
                  <HStack align="flex-start" spacing={3}>
                    <Icon as={FaDatabase} color="red.500" mt={1} />
                    <Text color="gray.700">
                      ฐานข้อมูลรายชื่อมิจฉาชีพ (Blacklist)
                    </Text>
                  </HStack>
                  <HStack align="flex-start" spacing={3}>
                    <Icon as={FaShieldHalved} color="brand.500" mt={1} />
                    <Text color="gray.700">
                      รูปแบบพฤติกรรมความเสี่ยงทั่วไป (เช่น
                      การเรียกเก็บเงินล่วงหน้า)
                    </Text>
                  </HStack>
                </VStack>

                <Separator my={4} />

                <Heading as="h2" size="lg" color="brand.600">
                  นโยบายความเป็นส่วนตัว (PDPA)
                </Heading>
                <Text color="gray.700">
                  <strong>การเก็บรักษาข้อมูล:</strong>{" "}
                  เราไม่เก็บบันทึกข้อมูลส่วนบุคคลของผู้ใช้งาน
                  ข้อมูลที่ท่านกรอกจะถูกนำไปประมวลผลและแสดงผลทันทีโดยไม่มีการบันทึกลงในระบบ
                </Text>
                <Text color="gray.700">
                  <strong>การใช้ข้อมูล:</strong>{" "}
                  ข้อมูลที่ท่านกรอกจะใช้เพื่อการประมวลผลและแสดงผลลัพธ์เท่านั้น
                  เราไม่แบ่งปันข้อมูลให้กับบุคคลที่สาม
                </Text>

                <Separator my={4} />

                <Heading as="h2" size="lg" color="brand.600">
                  ข้อจำกัดความรับผิดชอบ (Disclaimer)
                </Heading>
                <Text color="gray.700">
                  การประเมินความเสี่ยงที่ได้จากเครื่องมือนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น
                  <strong>
                    {" "}
                    ไม่สามารถใช้เป็นหลักฐานทางกฎหมายหรือการตัดสินใจขั้นสุดท้ายได้
                  </strong>
                </Text>
                <Text color="gray.700">
                  ผู้ใช้งานควรใช้วิจารณญาณและตรวจสอบข้อมูลเพิ่มเติมจากแหล่งที่เชื่อถือได้
                  เช่น:
                </Text>
                <VStack align="stretch" pl={2} spacing={2}>
                  <Text color="gray.700">• กรมการจัดหางาน กระทรวงแรงงาน</Text>
                  <Text color="gray.700">• สถานทูตไทยในประเทศปลายทาง</Text>
                  <Text color="gray.700">• สายด่วนแรงงานไทย 1694</Text>
                </VStack>

                <Separator my={4} />

                <Heading as="h2" size="lg" color="brand.600">
                  ช่องทางติดต่อ
                </Heading>
                <Text color="gray.700">
                  หากท่านพบปัญหาในการใช้งาน หรือต้องการแจ้งข้อมูลเพิ่มเติม
                  กรุณาติดต่อ:
                </Text>
                <VStack align="stretch" pl={2} spacing={2}>
                  <Text color="gray.700">
                    • อีเมล: thaimigrantwatchs@gmail.com
                  </Text>
                  <Text color="gray.700">• Facebook: Thai Migrant Watch </Text>
                </VStack>

                <Box
                  mt={6}
                  p={4}
                  bg="brand.50"
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Text fontSize="sm" color="brand.800" fontWeight="medium">
                    โครงการ &ldquo;เช็คก่อนบิน&rdquo;
                    พัฒนาขึ้นเพื่อประโยชน์ของสังคม
                    และไม่มีวัตถุประสงค์ในเชิงพาณิชย์
                  </Text>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  );
}
