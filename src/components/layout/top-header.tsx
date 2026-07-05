"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopHeaderProps {
  title: string;
  showBack?: boolean;
}

export function TopHeader({ title, showBack = true }: TopHeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-600 text-white h-14 flex items-center justify-center shadow-lg shadow-violet-500/25">
      <div className="w-full max-w-md mx-auto relative px-4 flex items-center justify-center">
        {showBack && (
          <button 
            onClick={() => router.back()} 
            className="absolute left-4 p-1 rounded-full hover:bg-white/15 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-semibold tracking-wide">{title}</h1>
      </div>
    </header>
  );
}
