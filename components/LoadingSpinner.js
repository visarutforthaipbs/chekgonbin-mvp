import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

export default function LoadingSpinner({ text = "กำลังโหลด..." }) {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(255, 255, 255, 0.9)"
      zIndex="9999"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
        <Text color="gray.600" fontSize="lg">
          {text}
        </Text>
      </VStack>
    </Box>
  );
}
