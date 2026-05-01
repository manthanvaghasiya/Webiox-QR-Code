"use client";

import { Smartphone } from "lucide-react";

export default function DeviceFrame({ children }) {
  return (
    <div className="relative mx-auto w-[320px] h-[650px] bg-black rounded-[40px] shadow-2xl ring-[8px] ring-black overflow-hidden flex flex-col">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
        <div className="w-32 h-6 bg-black rounded-b-3xl"></div>
      </div>
      
      {/* Screen Area */}
      <div className="flex-1 bg-white relative overflow-y-auto scrollbar-hide rounded-[32px]">
        {children}
      </div>

      {/* Frame Gloss/Reflection (optional) */}
      <div className="pointer-events-none absolute inset-0 rounded-[40px] shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]"></div>
    </div>
  );
}
