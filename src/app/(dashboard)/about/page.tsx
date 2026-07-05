"use client";
import { motion } from "framer-motion";
import { ChevronLeft, Info, History, Cpu, Sparkles, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AboutUsPage() {
  const router = useRouter();

  const chapters = [
    {
      title: "Chapter 1: The Beginning of Temperature (1960s - 1980s)",
      icon: History,
      color: "from-amber-400 to-orange-500",
      content: "Early massage chairs were merely rigid gear meshing and mechanical knocking. The Panasonic R&D team realized that massage without warmth cannot be called \"physiotherapy.\" They pioneered the embedding of heating elements into the rollers: when the first wisp of warmth slowly spread along the spine, the machine began to have body temperature. Subsequently, the introduction of air compressors and airbag technology transformed the rigid mechanical motion into a gentle pressure, like being enveloped by a human hand. Panasonic officially bid farewell to the \"mechanical feel\" of massage chairs."
    },
    {
      title: "Chapter 2: Deconstruction of Ingenuity (1990s - 2000s)",
      icon: HeartHandshake,
      color: "from-blue-400 to-indigo-500",
      content: "In its quest to find the \"most comfortable pressure,\" Panasonic encountered a technological bottleneck: no matter how precise the machinery, it always felt lacking in \"human touch.\" Therefore, Panasonic made an almost insane decision: to seek out Japan's top massage masters. The R&D team covered the masters' fingers and wrists with high-precision sensors, capturing day and night in front of a computer the microsecond level pauses when they applied pressure, the angles of rotation during kneading, and the accumulation of pressure during acupressure. By \"digitizing\" the masters' techniques, Panasonic conquered the core 4D intelligent sensing mechanism. When millimeter-level temperature tracking precisely avoids bones and targets pain points, the user exclaimed, \"I thought it was that familiar massage therapist standing behind my chair!\""
    },
    {
      title: "Chapter 3: Intelligent Manufacturing of the Era (Modern)",
      icon: Cpu,
      color: "from-violet-400 to-purple-500",
      content: "Today's Panasonic automatic massage chair has evolved into a multi-sensory intelligent health cockpit. Understanding your fatigue better than you understand it. Relying on adaptive AI algorithms, it can read muscle fatigue and heart rate changes in real time, customizing a personalized massage technique and intensity for you. Escape the constraints of gravity. The 170° suspended golden reclining posture combined with the SL-shaped long guide rail allows the body to instantly enter a state of extreme relaxation akin to weightlessness. A pure space for complete breathing. The infusion of exclusive nanoe™ technology ensures that every deep breath is accompanied by healthy nourishment."
    }
  ];

  return (
    <div className="flex flex-col bg-[#F5F3FF] min-h-screen pb-10">
      


      {/* Hero Image */}
      <div className="w-full relative aspect-[16/9] overflow-hidden bg-indigo-950">
        <img 
          src="/Gemini_Generated_Image_u3l7yeu3l7yeu3l7 (1).png" 
          alt="Panasonic Massage Chair" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/20 via-transparent to-transparent z-20"></div>
      </div>
      
      {/* Title */}
      <div className="px-6 mt-6 mb-2">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-slate-800 drop-shadow-sm leading-tight"
        >
          The Evolution of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Touch & Craftsmanship
          </span>
        </motion.h2>
      </div>

      {/* Intro Text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-5 mt-2"
      >
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          Panasonic's philosophy of creation contains an ironclad rule: <span className="text-indigo-600 font-bold">"Home appliances are for people's enjoyment."</span> More than half a century ago, when the first massage chair with a warm feel was born in the laboratory, Panasonic planted a seed of an obsessive dream - to perfectly recreate the most delicate and gentle touch of human hands using the rigor and precision of technology. This is a long evolution of "touch and craftsmanship" that has spanned more than 50 years.
        </p>
      </motion.div>

      {/* Timeline / Chapters */}
      <div className="px-4 mt-10 space-y-6 relative">
        {/* Timeline connecting line */}
        <div className="absolute left-9 top-4 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-violet-200 to-transparent z-0"></div>

        {chapters.map((chapter, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1 }}
            className="relative z-10 flex gap-4"
          >
            {/* Icon Bubble */}
            <div className={`w-10 h-10 shrink-0 rounded-full bg-gradient-to-br ${chapter.color} flex items-center justify-center shadow-lg shadow-violet-200 border-4 border-[#F5F3FF]`}>
              <chapter.icon size={18} className="text-white" />
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-violet-100 flex-1">
              <h3 className="font-bold text-slate-800 text-sm mb-3 pb-2 border-b border-slate-100">
                {chapter.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed text-justify">
                {chapter.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Epilogue */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-4 mt-10 mb-8 rounded-3xl p-6 bg-gradient-to-br from-indigo-900 to-violet-900 text-center relative overflow-hidden shadow-xl shadow-indigo-900/20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
        
        <Sparkles className="text-yellow-400 mx-auto mb-3" size={28} />
        
        <h4 className="text-white font-black text-lg mb-3">Knowing your fatigue, providing warmth.</h4>
        
        <p className="text-indigo-100 text-xs leading-relaxed opacity-90">
          From a wooden heated chair in 1969 to today's AI-powered health cabin that can sense your heartbeat, Panasonic's 50-year evolution of massage chairs is a history of using cold machinery to chase the warmth of human hands. Our technological leaps across half a century are solely for the purpose of giving you a perfectly timed embrace on every weary night.
        </p>
      </motion.div>

    </div>
  );
}
