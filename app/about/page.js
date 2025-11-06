"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Separator,
} from "@chakra-ui/react";

export default function About() {
  return (
    <Container maxW="container.xl" py={10} px={{ base: 4, md: 6 }}>
      <VStack
        spacing={6}
        align="stretch"
        width="100%"
        maxW={{ base: "100%", md: "640px", lg: "800px" }}
        mx="auto"
      >
        <Heading as="h1" textAlign="center" color="brand.500">
          เกี่ยวกับ &ldquo;เช็คก่อนบิน&rdquo;
        </Heading>
        <Text textAlign="justify">
          <strong>เช็คก่อนบิน</strong>{" "}
          เป็นเครื่องมือช่วยตรวจสอบความเสี่ยงเบื้องต้น
          สำหรับผู้ที่กำลังพิจารณาไปทำงานต่างประเทศ
          เพื่อลดโอกาสในการตกเป็นเหยื่อของการหลอกลวงจากนายหน้าหรือบริษัทจัดหางานที่ไม่สุจริต
        </Text>
        <Text textAlign="justify">
          โครงการนี้มุ่งหวังที่จะช่วยปกป้องแรงงานไทยจากการถูกหลอกลวงไปทำงานในต่างประเทศ
          โดยให้ข้อมูลและเครื่องมือในการตรวจสอบความน่าเชื่อถือของบริษัทจัดหางานและนายหน้า
          ก่อนที่จะตัดสินใจเดินทาง
        </Text>
        <Text textAlign="justify">
          แอปพลิเคชันนี้เป็นเพียง <strong>MVP (Minimum Viable Product)</strong>{" "}
          ที่ใช้ในการทดสอบแนวคิด ซึ่งใช้ฐานข้อมูลจำกัดและกฎการตรวจสอบเบื้องต้น
          ผลลัพธ์ที่ได้เป็นเพียงการประเมินเบื้องต้นเท่านั้น
        </Text>

        <Separator my={6} />

        <Heading as="h2" size="lg" color="brand.500">
          วิธีการทำงาน
        </Heading>
        <Text textAlign="justify">
          ระบบจะตรวจสอบข้อมูลที่คุณกรอกโดยเปรียบเทียบกับ:
        </Text>
        <VStack align="stretch" pl={6}>
          <Text textAlign="justify">
            • <strong>Whitelist:</strong>{" "}
            รายชื่อบริษัทจัดหางานที่ได้รับอนุญาตจากกรมการจัดหางาน
          </Text>
          <Text textAlign="justify">
            • <strong>Blacklist:</strong>{" "}
            รายชื่อบริษัทหรือบุคคลที่มีประวัติการหลอกลวง
          </Text>
          <Text textAlign="justify">
            • <strong>Red Flags:</strong> สัญญาณเตือนต่างๆ เช่น
            การติดต่อผ่านช่องทางที่ไม่เป็นทางการ
          </Text>
        </VStack>

        <Separator my={6} />

        <Heading as="h2" size="lg" color="brand.500">
          นโยบายความเป็นส่วนตัว (PDPA)
        </Heading>
        <Text textAlign="justify">
          <strong>การเก็บรักษาข้อมูล:</strong>{" "}
          เราไม่เก็บบันทึกข้อมูลส่วนบุคคลของผู้ใช้งาน
          ข้อมูลที่ท่านกรอกจะถูกนำไปประมวลผลและแสดงผลทันทีโดยไม่มีการบันทึกลงในระบบ
        </Text>
        <Text textAlign="justify">
          <strong>การใช้ข้อมูล:</strong>{" "}
          ข้อมูลที่ท่านกรอกจะใช้เพื่อการประมวลผลและแสดงผลลัพธ์เท่านั้น
          เราไม่แบ่งปันข้อมูลให้กับบุคคลที่สาม
        </Text>

        <Separator my={6} />

        <Heading as="h2" size="lg" color="brand.500">
          ข้อจำกัดความรับผิดชอบ (Disclaimer)
        </Heading>
        <Text textAlign="justify">
          การประเมินความเสี่ยงที่ได้จากเครื่องมือนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น
          <strong>
            {" "}
            ไม่สามารถใช้เป็นหลักฐานทางกฎหมายหรือการตัดสินใจขั้นสุดท้ายได้
          </strong>
        </Text>
        <Text textAlign="justify">
          ผู้ใช้งานควรใช้วิจารณญาณและตรวจสอบข้อมูลเพิ่มเติมจากแหล่งที่เชื่อถือได้
          เช่น:
        </Text>
        <VStack align="stretch" pl={6}>
          <Text textAlign="justify">• กรมการจัดหางาน กระทรวงแรงงาน</Text>
          <Text textAlign="justify">• สถานทูตไทยในประเทศปลายทาง</Text>
          <Text textAlign="justify">• สายด่วนแรงงานไทย 1694</Text>
        </VStack>

        <Separator my={6} />

        <Heading as="h2" size="lg" color="brand.500">
          ช่องทางติดต่อ
        </Heading>
        <Text textAlign="justify">
          หากท่านพบปัญหาในการใช้งาน หรือต้องการแจ้งข้อมูลเพิ่มเติม กรุณาติดต่อ:
        </Text>
        <VStack align="stretch" pl={6}>
          <Text textAlign="justify">• อีเมล: thaimigrantwatchs@gmail.com</Text>
          <Text textAlign="justify">• Facebook: Thai Migrant Watch </Text>
        </VStack>

        <Box mt={8} p={4} bg="brand.50" borderRadius="md">
          <Text fontSize="sm" textAlign="center" color="gray.700">
            โครงการ &ldquo;เช็คก่อนบิน&rdquo; พัฒนาขึ้นเพื่อประโยชน์ของสังคม
            และไม่มีวัตถุประสงค์ในเชิงพาณิชย์
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
