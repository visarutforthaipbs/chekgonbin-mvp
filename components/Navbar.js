"use client";

import {
  Box,
  Flex,
  Button,
  Heading,
  HStack,
  Image,
  Container,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={1000}
      bg={scrolled ? "rgba(255, 255, 255, 0.9)" : "brand.500"}
      backdropFilter={scrolled ? "blur(10px)" : "none"}
      boxShadow={scrolled ? "sm" : "none"}
      transition="all 0.3s"
      py={3}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Link href="/" passHref>
            <HStack spacing={3} cursor="pointer">
              <Box bg="white" borderRadius="full" p={1} boxShadow="sm">
                <Image
                  src="/favicon.svg"
                  alt="เช็คก่อนบิน Logo"
                  width={{ base: "32px", md: "40px" }}
                  height={{ base: "32px", md: "40px" }}
                />
              </Box>
              <Heading
                as="h1"
                size="md"
                color={scrolled ? "brand.600" : "white"}
                fontWeight="bold"
              >
                เช็คก่อนบิน
              </Heading>
            </HStack>
          </Link>
          <HStack spacing={4}>
            <Link href="/about" passHref>
              <Button
                variant="ghost"
                color={scrolled ? "gray.600" : "white"}
                _hover={{ bg: scrolled ? "gray.100" : "white/20" }}
                fontWeight="medium"
              >
                เกี่ยวกับเรา
              </Button>
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
