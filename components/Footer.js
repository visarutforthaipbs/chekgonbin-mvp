"use client";

import { Box, Text, Link, VStack, HStack } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="gray.50"
      borderTop="1px"
      borderColor="gray.200"
      py={8}
      mt="auto"
    >
      <VStack spacing={3} textAlign="center">
        <Text fontSize="sm" color="gray.700">
          เว็บไซต์นี้จัดทำขึ้นด้วยความห่วงใยจาก
        </Text>
        <Link
          href="https://www.facebook.com/profile.php?id=61570127262236"
          isExternal
          color="brand.500"
          fontWeight="bold"
          fontSize="md"
          _hover={{ color: "brand.600", textDecoration: "underline" }}
        >
          Thai Migrant Watch
        </Link>
        <Text fontSize="sm" color="gray.600" fontWeight="medium" mt={2}>
          เพื่อให้คนไทยต้องไม่ไปตายดาบหน้า
        </Text>
        <Text fontSize="xs" color="gray.500" mt={4}>
          © 2025 เช็คก่อนบิน - ตรวจสอบความเสี่ยงงานต่างประเทศ
        </Text>
      </VStack>
    </Box>
  );
}
