"use client";

import { Wallet, ArrowDownToLine, HeadphonesIcon, Megaphone, ArrowRight, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";

const SLIDES = [
  {
    image: "/Gemini_Generated_Image_bfvdhebfvdhebfvd.png",
    title: "Premium Panasonic Series",
    desc: "Invest in the world's leading massage chair technology and start earning."
  },
  {
    image: "/Gemini_Generated_Image_m4c314m4c314m4c3 (1).png",
    title: "Daily Passive Income",
    desc: "Watch your wealth grow with automated daily returns on your VIP device."
  },
  {
    image: "/Gemini_Generated_Image_oh28kqoh28kqoh28.png",
    title: "Global Investment Platform",
    desc: "Join thousands of smart investors securing their financial future."
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  // Real stats loaded from backend
  const [stats, setStats] = useState<any>({
    activeMembers: 142890,
    totalPayout: 8492100,
    recentWithdrawals: [
      { phone: "***5421", amount: "GHS 1,450", time: "Just now" },
      { phone: "***8902", amount: "GHS 320", time: "2 mins ago" },
      { phone: "***1124", amount: "GHS 5,200", time: "5 mins ago" }
    ]
  });

  // Fetch announcements & public stats
  useEffect(() => {
    fetch(`${API_URL}/api/announcements`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnnouncements(data.announcements || []);
        }
      })
      .catch(err => console.error("Failed to load announcements:", err));

    const fetchPublicStats = async () => {
      try {
        const token = localStorage.getItem("authToken") || localStorage.getItem("token") || localStorage.getItem("vip_token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/public-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStats({
              activeMembers: data.activeMembers,
              totalPayout: data.totalPayout,
              recentWithdrawals: data.recentWithdrawals
            });
          }
        }
      } catch (err) {
        console.error("Failed to load public stats:", err);
      }
    };

    fetchPublicStats();
  }, []);

  // Slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Popup delay
  useEffect(() => {
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);
    return () => clearTimeout(popupTimer);
  }, []);

  // Client-side loop ticker for fake/active rolling withdrawals simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Generate random amount between 150 and 6500 GHS in steps of 50
      const randomAmount = Math.floor(Math.random() * 128 + 3) * 50; 
      
      // 2. Generate random 4-digit suffix
      const suffix = Math.floor(1000 + Math.random() * 9000);
      const randomPhone = `***${suffix}`;

      // 3. Generate random relative times
      const times0 = ["Just now", "5s ago", "12s ago", "28s ago", "45s ago", "52s ago", "1 min ago", "2 mins ago"];
      const times1 = ["3 mins ago", "4 mins ago", "5 mins ago", "7 mins ago", "9 mins ago", "11 mins ago", "14 mins ago", "18 mins ago", "22 mins ago"];
      const times2 = ["25 mins ago", "30 mins ago", "35 mins ago", "45 mins ago", "50 mins ago", "1 hour ago", "2 hours ago", "3 hours ago", "5 hours ago"];

      const randomTime0 = times0[Math.floor(Math.random() * times0.length)];
      const randomTime1 = times1[Math.floor(Math.random() * times1.length)];
      const randomTime2 = times2[Math.floor(Math.random() * times2.length)];

      setStats((prev: any) => {
        const newList = [
          { phone: randomPhone, amount: `GHS ${randomAmount.toLocaleString()}`, time: randomTime0 },
          { 
            phone: `***${Math.floor(1000 + Math.random() * 9000)}`, 
            amount: `GHS ${(Math.floor(Math.random() * 128 + 3) * 50).toLocaleString()}`, 
            time: randomTime1 
          },
          { 
            phone: `***${Math.floor(1000 + Math.random() * 9000)}`, 
            amount: `GHS ${(Math.floor(Math.random() * 128 + 3) * 50).toLocaleString()}`, 
            time: randomTime2 
          }
        ];

        return {
          ...prev,
          recentWithdrawals: newList
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-[#F5F3FF] pb-6">
      
      {/* Top Banner Slider */}
      <div className="w-full relative aspect-[16/9] bg-violet-900 shrink-0 shadow-md overflow-hidden">
        {SLIDES.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-indigo-950/20 via-transparent to-transparent z-25"></div>
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Slider Indicators */}
        <div className="absolute bottom-3 right-4 flex gap-1.5 z-30">
          {SLIDES.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "w-4 bg-violet-300 shadow-sm" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="relative -mt-6 z-30 px-4">
        <div className="flex items-center justify-around bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-[28px] py-5 px-2 shadow-[0_8px_30px_rgb(139,92,246,0.3)] border border-violet-400/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.15),transparent_70%)] rounded-[28px] pointer-events-none" />
          
          <Link href="/deposit" className="flex flex-col items-center gap-2 flex-1 transition-transform active:scale-95 relative z-10 group">
            <div className="w-12 h-12 rounded-[18px] bg-white/15 group-hover:bg-white/25 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner transition-all duration-300">
              <Wallet size={22} className="text-white drop-shadow-sm" />
            </div>
            <span className="text-white text-xs font-bold tracking-wide drop-shadow-sm">Deposit</span>
          </Link>
          
          <Link href="/withdraw" className="flex flex-col items-center gap-2 flex-1 relative transition-transform active:scale-95 z-10 group">
            <div className="w-12 h-12 rounded-[18px] bg-white/15 group-hover:bg-white/25 flex items-center justify-center relative backdrop-blur-md border border-white/20 shadow-inner transition-all duration-300">
              <ArrowDownToLine size={22} className="text-white drop-shadow-sm" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-[2.5px] border-violet-600 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            </div>
            <span className="text-white text-xs font-bold tracking-wide drop-shadow-sm">Withdraw</span>
          </Link>
          
          <Link href="/support" className="flex flex-col items-center gap-2 flex-1 transition-transform active:scale-95 relative z-10 group">
            <div className="w-12 h-12 rounded-[18px] bg-white/15 group-hover:bg-white/25 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner transition-all duration-300">
              <HeadphonesIcon size={22} className="text-white drop-shadow-sm" />
            </div>
            <span className="text-white text-xs font-bold tracking-wide drop-shadow-sm">Service</span>
          </Link>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="bg-white px-4 py-3.5 flex items-center gap-3 mt-4 mx-3 rounded-2xl shadow-sm border border-violet-100">
        <Megaphone size={18} className="text-violet-600 shrink-0 animate-pulse" />
        <div className="overflow-hidden flex-1 relative h-4">
          {(() => {
            const marqueeText = announcements.length > 0 
              ? announcements.map(a => `🔥 ${a.title}: ${a.message}`).join("   |   ")
              : "🎉 Welcome to PAISON VIP Official Investment Hub! 🚀 Signup Bonus GHS 30 credited instantly! 💰 Member ***842 just withdrew GHS 1,250 successfully! 🔥 Level 1 referral rewards increased to 20%!";
            return (
              <motion.div
                key={marqueeText}
                initial={{ x: "100%" }}
                animate={{ x: "-110%" }}
                transition={{ repeat: Infinity, duration: Math.max(10, marqueeText.length * 0.08), ease: "linear" }}
                className="absolute left-0 top-0 whitespace-nowrap text-xs text-slate-700 font-medium"
                style={{ width: "max-content" }}
              >
                {marqueeText}
              </motion.div>
            );
          })()}
        </div>
      </div>

      {/* Call to Action Link */}
      <Link href="/products" className="mx-3 mt-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-5 flex items-center justify-between text-white shadow-lg shadow-violet-500/30 transition-transform active:scale-95">
        <div>
          <h3 className="font-bold text-sm tracking-wide">Start Earning Today</h3>
          <p className="text-[11px] text-white/80 mt-1 font-medium">Browse our VIP massage chair products</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
          <ArrowRight size={18} />
        </div>
      </Link>

      {/* Global Stats Section */}
      <div className="mx-3 mt-4 bg-white rounded-[24px] p-5 flex items-center shadow-sm border border-violet-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex-1 flex flex-col relative z-10">
          <span className="text-[10px] text-violet-500 font-bold tracking-wider mb-1.5 uppercase">Active Members</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black text-slate-800 tracking-tight">{stats.activeMembers.toLocaleString()}</span>
            <TrendingUp size={14} className="text-violet-600" />
          </div>
        </div>
        <div className="w-px h-10 bg-violet-100 mx-4 relative z-10"></div>
        <div className="flex-1 flex flex-col relative z-10">
          <span className="text-[10px] text-violet-500 font-bold tracking-wider mb-1.5 uppercase">Total Payout (GHS)</span>
          <span className="text-xl font-black text-indigo-700 tracking-tight">GHS {stats.totalPayout.toLocaleString()}</span>
        </div>
      </div>

      {/* Recent Payouts Section */}
      <div className="mt-5 mx-3 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-4 border border-violet-100/60 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-violet-400/10 rounded-full blur-xl"></div>
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <TrendingUp size={16} className="text-violet-600" />
          <h3 className="font-bold text-slate-800 text-xs tracking-wide">Live VIP Withdrawals</h3>
        </div>
        <div className="flex flex-col gap-2 relative z-10">
          {stats.recentWithdrawals.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-xl shadow-sm border border-violet-50">
              <span className="text-xs font-bold text-slate-600">{item.phone}</span>
              <span className="text-xs font-black text-emerald-600">{item.amount}</span>
              <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Advantages */}
      <div className="mt-5 px-3">
        <div className="flex items-center justify-between px-1 mb-3">
          <h3 className="font-black text-slate-800 text-sm tracking-wide">Platform Advantages</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center text-center gap-2.5 border border-violet-100">
             <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
               <ShieldCheck size={24} className="text-emerald-600" />
             </div>
             <div>
               <p className="font-bold text-slate-800 text-xs">Secure</p>
               <p className="text-[10px] text-slate-500 leading-tight mt-1">Bank-grade security.</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center text-center gap-2.5 border border-violet-100">
             <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
               <Zap size={24} className="text-violet-600" />
             </div>
             <div>
               <p className="font-bold text-slate-800 text-xs">Fast Returns</p>
               <p className="text-[10px] text-slate-500 leading-tight mt-1">Daily automated income.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-5 px-4 py-4 bg-white mx-3 rounded-2xl border border-violet-100 flex items-center justify-around shadow-sm">
        <div className="flex flex-col items-center gap-1">
           <span className="text-lg font-black text-indigo-600">50K+</span>
           <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Active Users</span>
        </div>
        <div className="w-px h-8 bg-violet-100"></div>
        <div className="flex flex-col items-center gap-1">
           <span className="text-lg font-black text-violet-600">24/7</span>
           <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Support</span>
        </div>
        <div className="w-px h-8 bg-violet-100"></div>
        <div className="flex flex-col items-center gap-1">
           <span className="text-lg font-black text-purple-600">100%</span>
           <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Guaranteed</span>
        </div>
      </div>

      {/* Promotional Graphic */}
      <div className="w-full relative aspect-[16/9] bg-violet-900 mt-5 rounded-3xl overflow-hidden mx-3 shadow-md" style={{ width: 'calc(100% - 24px)' }}>
        <div className="absolute inset-0 flex items-center justify-center z-10 p-6 bg-indigo-950/20">
          <div className="bg-white/95 px-6 py-3.5 shadow-xl rounded-xl flex items-center justify-center text-center backdrop-blur-md border border-violet-200/50">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-wider">
              Panasonic GREEN IMP<span className="text-violet-600">ACT</span>
            </h2>
          </div>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=800&auto=format&fit=crop" 
          alt="Green Impact" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* FAQ Section */}
      <div className="mt-5 mx-3 mb-6">
        <div className="flex items-center justify-between px-1 mb-3">
          <h3 className="font-black text-slate-800 text-sm tracking-wide">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-3">
          {[
            { q: "How are daily returns calculated?", a: "Returns are automatically credited to your account balance every 24 hours based on your active VIP plan." },
            { q: "What is the minimum withdrawal?", a: "The minimum withdrawal amount is GHS 30. Withdrawals are processed within 24 hours." },
            { q: "How do the referral rewards work?", a: "Earn commissions of 20% on Level 1, 3% on Level 2, and 2% on Level 3 referrals directly in your account balance." }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-violet-100">
              <h4 className="font-bold text-slate-800 text-xs mb-1.5">{faq.q}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Notification Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[400px] bg-white rounded-[28px] p-5 shadow-2xl flex flex-col max-h-[75vh]"
            >
              <h3 className="text-[17px] font-bold text-slate-900 mb-4 px-1">Platform notification</h3>
              
              <div className="flex-1 overflow-y-auto pr-3 space-y-4 mb-4 text-[13px] text-slate-700 font-medium leading-[1.6]">
                <p>✨ Welcome to the Panasonic massage chair online store. ✨</p>
                <p>✔️ The most trusted wealth management and investment app!</p>
                <p>➤ Register as a new user and receive a 30 Ghana Cedis bonus.</p>
                <p>➤ Earn a 10% rebate on the product value with your first purchase.</p>
                <p>➤ Earn commissions of 20%, 3%, and 2% by inviting friends to join.</p>
              </div>

              <div className="flex flex-col gap-2.5 mt-2">
                <a
                  href="https://t.me/vipinvest_group"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-[#229ED9] hover:bg-[#0088cc] text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-1.5 transition-all text-xs text-center"
                >
                  Telegram Group
                </a>
                <a
                  href="https://t.me/vipinvest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-1.5 transition-all text-xs text-center"
                >
                  Telegram Support
                </a>
                <button 
                  onClick={() => setShowPopup(false)}
                  className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl active:scale-[0.98] transition-all text-xs"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
