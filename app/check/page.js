"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Text } from "@chakra-ui/react";

export default function Check() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return (
    <Container centerContent py={20}>
      <Text>กำลังนำทางไปหน้าหลัก...</Text>
    </Container>
  );
}
