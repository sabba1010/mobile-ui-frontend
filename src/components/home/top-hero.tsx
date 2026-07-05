"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Premium VIP Packages",
    description: "Earn passive income every day",
    color: "from-indigo-700 to-violet-600",
  },
  {
    id: 2,
    title: "Invite Friends & Earn",
    description: "Up to 20% commission on referrals",
    color: "from-violet-600 to-purple-700",
  },
  {
    id: 3,
    title: "Secure & Fast Withdrawals",
    description: "Get your money in seconds",
    color: "from-blue-700 to-indigo-700",
  },
];

export function TopHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 mt-2">
      <div className="relative h-44 rounded-[20px] overflow-hidden shadow-lg">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-r ${slide.color} flex flex-col justify-center p-6 text-white`}
            style={{ pointerEvents: currentSlide === index ? 'auto' : 'none' }}
          >
            <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
            <p className="text-white/80 font-medium">{slide.description}</p>
          </motion.div>
        ))}
        
        {/* Indicators */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
