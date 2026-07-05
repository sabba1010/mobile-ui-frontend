"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { API_URL } from "@/lib/api";
import { ArrowLeft, UserCheck, Calendar, DollarSign, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeamDetailsPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<any>(null);
  const router = useRouter();

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
            setTeamData(resData);
          }
        }
      } catch (err) {
        console.error("Failed to load team details:", err);
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
        Loading team members...
      </div>
    );
  }

  const members = teamData?.members || { level1: [], level2: [], level3: [] };
  
  const getTabList = () => {
    const l1 = members.level1 || [];
    const l2 = members.level2 || [];
    const l3 = members.level3 || [];
    return [
      { id: 1, label: `Level 1 (${l1.length})`, data: l1 },
      { id: 2, label: `Level 2 (${l2.length})`, data: l2 },
      { id: 3, label: `Level 3 (${l3.length})`, data: l3 },
    ];
  };

  const tabs = getTabList();
  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];
  const list = currentTab.data;

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      
      {/* Header bar back arrow redirect */}
      <div className="bg-white border-b border-gray-100 flex items-center h-14 px-4 gap-3 shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <span className="font-bold text-slate-800 text-base">Team Hierarchy Details</span>
      </div>

      {/* Tabs */}
      <div className="flex w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-4 text-xs font-bold text-center transition-all relative",
              activeTab === tab.id
                ? "text-indigo-600 bg-indigo-50/10"
                : "text-gray-500 hover:text-gray-700 bg-white"
            )}
          >
            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-sm font-black">{tab.data.length}</span>
              <span>{tab.label.split(' ')[0]} {tab.label.split(' ')[1]}</span>
            </div>
            
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Member List */}
      <div className="flex-1 p-4 space-y-3.5">
        {list.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-8 mt-16 text-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/40 blur-2xl rounded-full" />
              <div className="relative z-10 text-gray-200">
                <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z" fill="url(#paint0_linear)"/>
                  <path d="M60 70H140V150C140 155.523 135.523 160 130 160H70C64.4772 160 60 155.523 60 150V70Z" fill="#F3F4F6"/>
                  <path d="M70 50H130V70H70V50Z" fill="#E5E7EB"/>
                  <path d="M80 90H120" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M80 110H120" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M80 130H100" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round"/>
                  <circle cx="120" cy="130" r="16" fill="#D1D5DB"/>
                  <rect x="112" y="124" width="4" height="12" rx="1" fill="#F3F4F6"/>
                  <rect x="118" y="120" width="4" height="16" rx="1" fill="#F3F4F6"/>
                  <rect x="124" y="128" width="4" height="8" rx="1" fill="#F3F4F6"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F9FAFB" stopOpacity="0"/>
                      <stop offset="1" stopColor="#F3F4F6" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-wider">No team members at this level yet</p>
          </div>
        ) : (
          list.map((m: any, idx: number) => (
            <div 
              key={m._id || idx} 
              className="bg-white rounded-3xl p-4 border border-violet-100/60 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Badge for status */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm tracking-wide">
                  {m.phoneNumber.substring(0, 6)} *** {m.phoneNumber.substring(m.phoneNumber.length - 4)}
                </span>
                
                {m.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">
                    Active Investor
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-100 uppercase tracking-wider">
                    Pending plan
                  </span>
                )}
              </div>

              {/* Stats details */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50/50 rounded-2xl p-2.5 border border-slate-100/50 mt-1">
                <div className="text-center border-r border-slate-200 last:border-0 pr-1">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                    <Package size={11} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Plan</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-700 block truncate">{m.plan}</span>
                </div>
                
                <div className="text-center border-r border-slate-200 last:border-0 px-1">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                    <Calendar size={11} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Joined</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-600 block">
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB') : "N/A"}
                  </span>
                </div>
                
                <div className="text-center last:border-0 pl-1">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                    <DollarSign size={11} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Profit</span>
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 block">GHS {m.contribution}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
