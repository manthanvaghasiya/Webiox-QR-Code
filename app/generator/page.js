"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ModeToggle from "@/components/qr/ModeToggle";
import SimpleGenerator from "@/components/qr/SimpleGenerator";
import ProGenerator from "@/components/qr/ProGenerator";

function GeneratorInner() {
  const params = useSearchParams();
  const mode = params.get("mode") === "pro" ? "pro" : "basic";

  return (
    <div className="animate-gradient-mesh flex-grow flex flex-col items-center py-10 px-4 sm:px-8 w-full min-h-screen">
      <div className="mb-8">
        <ModeToggle mode={mode} />
      </div>
      {mode === "pro" ? <ProGenerator /> : <SimpleGenerator />}
    </div>
  );
}

function Fallback() {
  return (
    <div className="animate-gradient-mesh flex-grow flex items-center justify-center py-20 w-full min-h-screen">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm font-semibold">Loading generator...</p>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <GeneratorInner />
    </Suspense>
  );
}
