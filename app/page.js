import { Suspense } from "react";
import HomeClient from "./HomeClient";

function HomeFallback() {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl">
        <section className="bg-white border-2 border-brand-primary/25 rounded-4xl md:rounded-5xl overflow-hidden">
          <div className="p-6 md:p-12 flex flex-col gap-5 md:gap-6">
            <div className="h-8 md:h-10 w-56 md:w-72 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-4 w-44 md:w-56 bg-slate-100 rounded-lg animate-pulse" />

            <div className="h-14 md:h-16 w-full bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-4 w-40 md:w-52 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-4 w-64 md:w-80 bg-slate-100 rounded-lg animate-pulse" />

            <div className="h-14 md:h-16 w-full bg-brand-primary/20 rounded-2xl animate-pulse" />
            <div className="h-12 w-full bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeClient />
    </Suspense>
  );
}
