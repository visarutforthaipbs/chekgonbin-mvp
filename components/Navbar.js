"use client";

import {
  Box,
  Flex,
  Button,
  Heading,
  HStack,
  Image,
  Container,
  VStack,
  IconButton,
  useDisclosure,
  Collapsible,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/media-hub", label: "ศูนย์ความรู้" },
    { href: "/report-scam", label: "รายงาน" },
    { href: "/about", label: "เกี่ยวกับ" },
    { href: "/privacy-policy", label: "ความเป็นส่วนตัว" },
  ];

  const NavLink = ({ href, label }) => (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        size="sm"
        color={scrolled ? "gray.600" : "white"}
        _hover={{
          bg: scrolled ? "gray.100" : "white/20",
        }}
        fontWeight="medium"
      >
        {label}
      </Button>
    </Link>
  );

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
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <Flex justify="space-between" align="center" py={3} minH="64px">
          {/* Logo */}
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
                size={{ base: "sm", md: "md" }}
                color={scrolled ? "brand.600" : "white"}
                fontWeight="bold"
                display={{ base: "none", sm: "block" }}
              >
                เช็คก่อนบิน
              </Heading>
            </HStack>
          </Link>

          {/* Desktop Navigation */}
          <HStack spacing={1} display={{ base: "none", md: "flex" }}>
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            icon={isOpen ? <FaXmark /> : <FaBars />}
            variant="ghost"
            size="lg"
            color={scrolled ? "gray.600" : "white"}
            _hover={{
              bg: scrolled ? "gray.100" : "white/20",
            }}
            display={{ base: "flex", md: "none" }}
            onClick={onToggle}
            aria-label="Toggle menu"
          />
        </Flex>

        {/* Mobile Navigation */}
        <Collapsible.Root open={isOpen}>
          <Collapsible.Content>
            <VStack
              spacing={1}
              align="stretch"
              pb={4}
              display={{ base: "flex", md: "none" }}
              borderTopWidth="1px"
              borderTopColor={scrolled ? "gray.200" : "white/20"}
              pt={2}
            >
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                  <Button
                    variant="ghost"
                    width="100%"
                    justifyContent="flex-start"
                    color={scrolled ? "gray.800" : "white"}
                    _hover={{
                      bg: scrolled ? "brand.50" : "white/20",
                      color: scrolled ? "brand.600" : "white",
                    }}
                    fontWeight="medium"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </VStack>
          </Collapsible.Content>
        </Collapsible.Root>
      </Container>
    </Box>
  );
}
