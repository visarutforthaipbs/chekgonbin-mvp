"use client";

import {
  Box,
  Text,
  Link,
  VStack,
  HStack,
  Container,
  Icon,
  Separator,
} from "@chakra-ui/react";
import { FaFacebook } from "react-icons/fa6";

export default function Footer() {
  return (
    <Box as="footer" bg="gray.900" color="gray.300" py={10} mt="auto">
      <Container maxW="container.xl">
        <VStack spacing={6} textAlign="center">
          <VStack spacing={2}>
            <Text fontSize="md" fontWeight="medium" color="gray.400">
              เว็บไซต์นี้จัดทำขึ้นด้วยความห่วงใยจาก
            </Text>
            <Link
              href="https://www.facebook.com/profile.php?id=61570127262236"
              isExternal
              _hover={{ textDecoration: "none" }}
            >
              <HStack
                spacing={2}
                color="brand.300"
                _hover={{ color: "brand.200" }}
              >
                <Icon as={FaFacebook} boxSize={5} />
                <Text fontWeight="bold" fontSize="lg">
                  Thai Migrant Watch
                </Text>
              </HStack>
            </Link>
            <Text fontSize="sm" color="gray.500">
              เพื่อให้คนไทยต้องไม่ไปตายดาบหน้า
            </Text>
          </VStack>

          <Separator borderColor="gray.800" maxW="200px" />

          <HStack spacing={4} justify="center" flexWrap="wrap">
            <Link href="/media-hub" _hover={{ textDecoration: "none" }}>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "brand.300" }}
              >
                ศูนย์ความรู้
              </Text>
            </Link>
            <Text color="gray.600">•</Text>
            <Link href="/report-scam" _hover={{ textDecoration: "none" }}>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "brand.300" }}
              >
                รายงานข้อมูล
              </Text>
            </Link>
            <Text color="gray.600">•</Text>
            <Link href="/privacy-policy" _hover={{ textDecoration: "none" }}>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "brand.300" }}
              >
                นโยบายความเป็นส่วนตัว
              </Text>
            </Link>
            <Text color="gray.600">•</Text>
            <Link href="/about" _hover={{ textDecoration: "none" }}>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "brand.300" }}
              >
                เกี่ยวกับเรา
              </Text>
            </Link>
          </HStack>

          <Text fontSize="xs" color="gray.600">
            © 2025 เช็คก่อนบิน - ตรวจสอบความเสี่ยงงานต่างประเทศ
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
