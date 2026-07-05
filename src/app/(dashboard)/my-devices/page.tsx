"use client";

import { motion } from "framer-motion";

export default function MyDevicesPage() {
  return (
    <div className="flex flex-col bg-[#F5F3FF] min-h-screen">
      {/* Top Banner with Stats */}
      <div className="w-full relative aspect-[16/9] bg-indigo-950 shrink-0 shadow-md overflow-hidden">
        <img
          src="/Gemini_Generated_Image_no7xd9no7xd9no7x.png"
          alt="My Devices"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-violet-900/10" />
        <div className="absolute inset-x-0 bottom-0 flex justify-between px-6 py-4 bg-gradient-to-t from-indigo-950/95 via-violet-900/50 to-transparent">
          <div className="text-center backdrop-blur-sm bg-white/10 px-6 py-2.5 rounded-2xl border border-white/20 shadow-md">
            <p className="text-white font-black text-xl leading-none drop-shadow-md">0</p>
            <p className="text-indigo-200 text-[11px] mt-1.5 font-medium tracking-wide">My device</p>
          </div>
          <div className="text-center backdrop-blur-sm bg-white/10 px-6 py-2.5 rounded-2xl border border-white/20 shadow-md">
            <p className="text-white font-black text-xl leading-none drop-shadow-md">GHS 0</p>
            <p className="text-indigo-200 text-[11px] mt-1.5 font-medium tracking-wide">My income</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-10 mt-10">
        <div className="bg-white rounded-[32px] p-10 w-full max-w-sm shadow-sm border border-violet-100 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500 font-medium">You don't have a product yet.</p>
        </div>
      </div>
    </div>
  );
}
