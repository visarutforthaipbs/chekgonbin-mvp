import { Box, Spinner, Text, VStack, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa6";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

export default function LoadingSpinner({ text = "กำลังโหลด..." }) {
  return (
    <MotionBox
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(255, 255, 255, 0.95)"
      backdropFilter="blur(4px)"
      zIndex="9999"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <MotionVStack
        spacing={4}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Icon as={FaSpinner} boxSize={12} color="brand.500" />
        </motion.div>
        <Text
          color="gray.700"
          fontSize="lg"
          fontWeight="500"
          textAlign="center"
          maxW="300px"
        >
          {text}
        </Text>
      </MotionVStack>
    </MotionBox>
  );
}
