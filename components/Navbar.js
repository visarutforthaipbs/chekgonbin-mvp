"use client";

import { Box, Flex, Button, Heading, HStack, Image } from "@chakra-ui/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <Box bg="brand.500" px={4} py={3} boxShadow="md">
      <Flex
        maxW="container.xl"
        mx="auto"
        justify="space-between"
        align="center"
      >
        <Link href="/" passHref>
          <HStack spacing={2} cursor="pointer">
            <Image
              src="/favicon.svg"
              alt="เช็คก่อนบิน Logo"
              width={{ base: "32px", md: "40px" }}
              height={{ base: "32px", md: "40px" }}
            />
            <Heading as="h1" size="md" color="white">
              เช็คก่อนบิน
            </Heading>
          </HStack>
        </Link>
        <HStack spacing={4}>
          <Link href="/about" passHref>
            <Button variant="ghost" color="white" _hover={{ bg: "brand.600" }}>
              เกี่ยวกับเรา
            </Button>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
}
