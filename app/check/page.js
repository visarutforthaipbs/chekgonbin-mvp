"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Check() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500">กำลังนำทางไปหน้าหลัก...</p>
    </div>
  );
}
