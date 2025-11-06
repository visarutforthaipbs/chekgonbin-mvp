"use client";

import { ChakraProvider, Box } from "@chakra-ui/react";
import system from "@/theme/theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function Providers({ children }) {
  return (
    <ChakraProvider value={system} disableGlobalStyle={false}>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        position="relative"
      >
        <Navbar />
        <Box as="main" flex="1" display="flex" flexDirection="column">
          {children}
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}
