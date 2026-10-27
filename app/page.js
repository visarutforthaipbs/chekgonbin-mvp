import { Suspense } from "react";
import HomeClient from "./HomeClient";
import HomeHero from "@/components/home/HomeHero";

function HomeFallback() {
  return (
    <div className="w-full max-w-2xl px-4 md:px-6 pt-8 md:pt-16 pb-12 flex flex-col gap-6" aria-hidden="true">
      <div className="flex flex-col gap-3 md:items-center">
        <div className="h-10 md:h-12 w-64 md:w-96 rounded-xl animate-shimmer" />
        <div className="h-5 w-full max-w-md rounded-lg animate-shimmer" />
      </div>
      <div className="card p-5 md:p-8 flex flex-col gap-5">
        <div className="h-6 w-40 rounded-lg animate-shimmer" />
        <div className="h-[52px] w-full rounded-xl animate-shimmer" />
        <div className="h-11 w-full rounded-xl animate-shimmer" />
        <div className="h-14 w-full rounded-2xl animate-shimmer" />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <HomeHero />
      <div id="check" className="scroll-mt-20">
        <Suspense fallback={<HomeFallback />}>
          <HomeClient />
        </Suspense>
      </div>
    </>
  );
}
