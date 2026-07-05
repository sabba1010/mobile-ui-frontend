"use client";
import { useEffect, useState } from "react";
import { Users, Copy, Share2, Award, CheckCircle, Gift, AwardIcon, Bookmark, X } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem("vip_token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/team`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const resData = await res.json();
          if (resData.success) {
            setData(resData);
          }
        }
      } catch (err) {
        console.error("Failed to load team data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 text-sm">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mb-2" />
        Loading team stats...
      </div>
    );
  }

  const inviteCode = data?.inviteCode || "HSB3X8";
  const invitationLink = typeof window !== "undefined"
    ? `${window.location.origin}/register?code=${inviteCode}`
    : `https://paisonvip.com/register?code=${inviteCode}`;

  const copyToClipboard = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
    toast.success("Copied to clipboard!");
  };

  const certificate = data?.certificate || "None";
  const weeklyIncentive = data?.weeklyIncentive || 0;
  const stats = data?.stats || {
    totalMembers: 0,
    activeMembers: 0,
    teamIncome: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    activeLevel1: 0,
    activeLevel2: 0,
    activeLevel3: 0
  };

  const members = data?.members || { level1: [], level2: [], level3: [] };
  const commissionRates = data?.commissionRates || { level1: 20, level2: 3, level3: 2 };

  // Calculate sum of contributions per level
  const getLevelIncome = (levelMembers: any[]) => {
    return levelMembers.reduce((sum, m) => sum + (m.contribution || 0), 0);
  };

  // Next rank calculation
  const getNextRankInfo = (activeCount: number) => {
    if (activeCount < 10) {
      return { next: "Business Specialist", target: 10, current: activeCount, bonus: 150 };
    } else if (activeCount < 25) {
      return { next: "High Commissioner", target: 25, current: activeCount, bonus: 200 };
    } else if (activeCount < 150) {
      return { next: "Business Consultant", target: 150, current: activeCount, bonus: 250 };
    } else {
      return null;
    }
  };

  const nextRank = getNextRankInfo(stats.activeMembers);
  const progressPercent = nextRank ? Math.min(Math.round((nextRank.current / nextRank.target) * 100), 100) : 100;

  return (
    <div className="flex flex-col bg-[#F5F3FF] min-h-full pb-6">
      
      {/* Top Header */}
      <div className="bg-gradient-to-br from-indigo-700 via-violet-600 to-purple-700 pt-6 pb-24 px-5 rounded-b-[40px] relative shrink-0 shadow-lg shadow-violet-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),transparent_60%)] rounded-b-[40px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <h1 className="text-white font-black text-2xl relative z-10 tracking-tight drop-shadow-sm">Invite Friends</h1>
        <p className="text-violet-200 text-xs mt-2 relative z-10 max-w-[250px] leading-relaxed font-medium">Build your team and earn up to {commissionRates.level1}% passive commission on direct referrals.</p>
        
        {/* Background Graphic */}
        <div className="absolute right-2 top-8 opacity-20 pointer-events-none">
           <Users size={100} className="text-white" />
        </div>
      </div>

      <div className="-mt-16 px-4 space-y-4 relative z-20">
        
        {/* Invitation Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-violet-200/30 border border-violet-100 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-3 shadow-inner border border-violet-200">
            <Share2 size={24} />
          </div>
          <h2 className="text-slate-800 font-black text-lg tracking-tight">Your Invitation Code</h2>
          
          <div className="mt-4 bg-violet-50 border-2 border-dashed border-violet-300 w-full rounded-2xl py-3 px-4 flex items-center justify-between">
            <span className="text-2xl font-black text-indigo-700 tracking-[0.2em]">{inviteCode}</span>
            <button 
              onClick={() => copyToClipboard(inviteCode, "code")}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-violet-500/20 active:scale-95 transition-transform"
            >
              {copiedCode ? "COPIED!" : "COPY"}
            </button>
          </div>

          <div className="mt-5 w-full">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 text-left px-1">Invitation Link</p>
            <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-2xl p-2 pl-4">
              <div className="truncate text-xs text-slate-700 font-medium flex-1 text-left">
                {invitationLink}
              </div>
              <button 
                onClick={() => copyToClipboard(invitationLink, "link")}
                className="w-10 h-10 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-700 flex items-center justify-center shrink-0 active:scale-95 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-[#8B5CF6] rounded-2xl p-4 shadow-md text-white">
            <p className="text-white font-bold text-[11px] uppercase tracking-wide mb-1 opacity-90">Active Team</p>
            <p className="text-white font-black text-2xl leading-none">
              {stats.activeMembers} <span className="text-xs font-bold text-white/90 tracking-normal ml-0.5">users</span>
            </p>
            <p className="text-[9px] mt-1 text-white/70 font-semibold">{stats.totalMembers} total members</p>
          </div>
          <div className="flex-1 bg-[#10B981] rounded-2xl p-4 shadow-md text-white">
            <p className="text-white font-bold text-[11px] uppercase tracking-wide mb-1 opacity-90">Team Income</p>
            <p className="text-white font-black text-2xl leading-none">
              <span className="text-sm font-bold text-white/90 tracking-normal mr-1">GHS</span>
              {stats.teamIncome.toLocaleString()}
            </p>
            <p className="text-[9px] mt-1 text-white/70 font-semibold">Commissions earned</p>
          </div>
        </div>

        {/* Incentives & Certificates Section */}
        <div className="bg-white rounded-3xl p-5 shadow-xl shadow-violet-200/30 border border-violet-100 flex flex-col">
          <div className="flex items-center gap-3 border-b border-violet-50 pb-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200 text-amber-500">
              <Award size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-sm">Team Rank & Weekly Incentives</h3>
              <p className="text-[10px] text-slate-500 font-semibold">Unlock digital certificates and weekly wages</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current Status</p>
              <div className="text-base font-black text-slate-800 mt-1 flex items-center gap-2">
                {certificate === "None" ? "No Active Rank" : certificate}
                {certificate !== "None" && (
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                )}
              </div>
              {weeklyIncentive > 0 ? (
                <p className="text-xs text-emerald-600 font-bold mt-0.5">Wage: GHS {weeklyIncentive}/week</p>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">No weekly wage</p>
              )}
            </div>

            {certificate !== "None" && (
              <button
                onClick={() => setCertModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-xl text-xs shadow-md shadow-orange-200 active:scale-95 transition-all flex items-center gap-1.5 font-sans"
              >
                <Award size={14} /> View Cert
              </button>
            )}
          </div>

          {/* Progress bar to next rank */}
          {nextRank ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Next: {nextRank.next}</span>
                <span className="text-indigo-600 font-bold">{nextRank.current} / {nextRank.target} Active Investors</span>
              </div>
              <div className="h-3 bg-violet-100/50 border border-violet-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 shadow-inner"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic mt-1 leading-relaxed">
                Add {nextRank.target - nextRank.current} more active investors to your team to earn {nextRank.next} Certificate & GHS {nextRank.bonus} weekly salary!
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 text-center flex flex-col items-center gap-1">
              <Gift size={24} className="text-emerald-500 mb-1" />
              <p className="text-xs font-bold text-emerald-800">Highest Rank Achieved!</p>
              <p className="text-[10px] text-emerald-600">You are earning the maximum weekly incentive of GHS 250.</p>
            </div>
          )}
        </div>

        {/* Commission Rates & Team Details */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden mt-2 mb-6">
          <div className="divide-y divide-slate-200">
            {[
              { level: 1, rate: commissionRates.level1, count: stats.level1Count, active: stats.activeLevel1, income: getLevelIncome(members.level1), img: "https://i.ibb.co.com/CqbjZKz/1-2.png" },
              { level: 2, rate: commissionRates.level2, count: stats.level2Count, active: stats.activeLevel2, income: getLevelIncome(members.level2), img: "https://i.ibb.co.com/4ZgZf5gW/2.png" },
              { level: 3, rate: commissionRates.level3, count: stats.level3Count, active: stats.activeLevel3, income: getLevelIncome(members.level3), img: "https://i.ibb.co.com/4ZgZf5gW/2.png" }
            ].map((tier, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 gap-2 bg-white hover:bg-slate-50/20">
                <div className="w-[60px] h-[60px] shrink-0 rounded-[14px] overflow-hidden border border-slate-100">
                  <img src={tier.img} alt={`Product`} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex justify-between items-center text-center px-1">
                  <div className="flex flex-col items-center flex-1">
                    <span className="font-bold text-slate-800 text-sm mb-0.5">{tier.rate}%</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Comm. rate</span>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1">
                    <span className="font-bold text-slate-800 text-sm mb-0.5">{tier.active} / {tier.count}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Active members</span>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1">
                    <span className="font-bold text-emerald-600 text-sm mb-0.5">GHS {tier.income}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Income</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/team-details" className="block w-full">
            <div className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white text-sm font-bold tracking-wide hover:opacity-95 transition-opacity">
              Team details &gt;&gt;
            </div>
          </Link>
        </div>

        {/* Rules Text */}
        <div className="bg-white rounded-xl shadow-md border border-violet-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex justify-between px-6 py-2.5 text-[13px] font-bold">
            <span>Valid users</span>
            <span>Total income</span>
          </div>
          <div className="p-4 text-[13px] text-slate-600 space-y-3.5 leading-relaxed bg-white font-medium">
            <p>When friends you invite sign up and invest, you instantly receive {commissionRates.level1}% cashback.</p>
            <p>You receive {commissionRates.level2}% cashback when members of your Level 2 team invest.</p>
            <p>You receive {commissionRates.level3}% cashback when members of your Level 3 team invest.</p>
            <p>Cash rewards will be deposited into your account once your team members have invested. You can withdraw them immediately.</p>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {certModalOpen && certificate !== "None" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setCertModalOpen(false)} 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xl bg-amber-50/90 rounded-[2.5rem] border-[16px] border-amber-950 p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(254,243,199,0.3) 0%, rgba(217,119,6,0.05) 100%)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 100px rgba(120,53,4,0.15)"
              }}
            >
              {/* Gold corners */}
              <div className="absolute top-2 left-2 w-16 h-16 border-t-4 border-l-4 border-amber-500 rounded-tl-xl pointer-events-none opacity-85" />
              <div className="absolute top-2 right-2 w-16 h-16 border-t-4 border-r-4 border-amber-500 rounded-tr-xl pointer-events-none opacity-85" />
              <div className="absolute bottom-2 left-2 w-16 h-16 border-b-4 border-l-4 border-amber-500 rounded-bl-xl pointer-events-none opacity-85" />
              <div className="absolute bottom-2 right-2 w-16 h-16 border-b-4 border-r-4 border-amber-500 rounded-br-xl pointer-events-none opacity-85" />

              {/* Close button */}
              <button 
                onClick={() => setCertModalOpen(false)} 
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-amber-950/10 hover:bg-amber-950/20 flex items-center justify-center transition-colors border border-amber-900/10"
              >
                <X size={16} className="text-amber-900" />
              </button>

              {/* Header Badge */}
              <div className="mb-4 mt-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-300">
                  <AwardIcon size={34} className="text-white" />
                </div>
              </div>

              {/* Certificate content */}
              <p className="font-serif tracking-widest text-amber-800 text-[11px] font-black uppercase mb-3">
                Certificate of Rank Achievement
              </p>
              
              <h2 className="text-slate-900 font-serif text-xl font-bold uppercase tracking-tight mb-2">
                PAISON VIP GLOBAL NETWORK
              </h2>
              <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-6 mx-auto" />

              <p className="text-slate-500 text-xs italic mb-4 font-medium">
                This is to officially recognize that user
              </p>

              <p className="text-slate-800 font-black font-sans text-lg tracking-wide bg-amber-100/50 px-5 py-1.5 rounded-full border border-amber-200/40 mb-4 inline-block shadow-inner">
                {data?.userPhone || "User Account"}
              </p>

              <p className="text-slate-500 text-xs max-w-sm leading-relaxed mb-6 font-medium">
                has successfully established a robust and verified investor downline team on the Paison VIP platform, thereby earning the prestigious rank of
              </p>

              {/* Rank Title Display */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-600/20 border border-amber-300 relative mb-8">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.2),transparent_70%)] pointer-events-none rounded-2xl" />
                <h3 className="text-white font-black font-serif text-lg tracking-wide uppercase drop-shadow-md">
                  {certificate}
                </h3>
              </div>

              <p className="text-slate-500 text-[10px] leading-relaxed max-w-sm font-semibold mb-6">
                In recognition of this leadership, the owner is entitled to a weekly passive wage of GHS {weeklyIncentive} alongside platform team management credentials.
              </p>

              {/* Signature Area */}
              <div className="flex justify-between items-end w-full max-w-md mt-4 px-6 border-t border-amber-900/10 pt-5">
                <div className="text-left">
                  <p className="text-amber-900 font-serif font-bold text-xs italic">VIP Operations</p>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Paison VIP Board</p>
                </div>
                
                {/* Simulated Seal */}
                <div className="w-14 h-14 rounded-full border-4 border-dashed border-amber-600 bg-amber-50 flex items-center justify-center text-[10px] font-black text-amber-700 tracking-tighter rotate-12 shadow-sm font-sans shrink-0 uppercase">
                  VERIFIED<br/>LEADER
                </div>

                <div className="text-right">
                  <p className="text-slate-700 font-medium text-[11px] underline underline-offset-4 decoration-amber-500 font-mono">
                    {new Date().toLocaleDateString('en-GB')}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Date Issued</p>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
