"use client";

import { ArrowLeft, Bell, Package, Megaphone, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const NOTIFICATIONS = [
  { id: 1, type: "income", title: "Daily Income Credited", message: "GHS 82 has been added to your wallet from your active VIP plans.", time: "2 hours ago", read: false },
  { id: 2, type: "announcement", title: "New VIP Plan Available!", message: "VIP 6 is now live. Earn GHS 704 daily. Limited slots available!", time: "1 day ago", read: false },
  { id: 3, type: "system", title: "Referral Bonus Received", message: "You earned GHS 16 referral commission from Level 1 member.", time: "2 days ago", read: true },
  { id: 4, type: "system", title: "Withdrawal Processed", message: "Your withdrawal of GHS 200 has been processed successfully.", time: "3 days ago", read: true },
  { id: 5, type: "announcement", title: "Platform Maintenance", message: "Scheduled maintenance on July 5th from 2AM–4AM UTC.", time: "4 days ago", read: true },
];

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  income: { icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
  announcement: { icon: Megaphone, color: "text-amber-600", bg: "bg-amber-50" },
  system: { icon: Settings, color: "text-primary", bg: "bg-blue-50" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const markAllRead = () => setNotifs(notifs.map((n) => ({ ...n, read: true })));
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:underline">Mark all read</button>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-2.5">
        {notifs.map((n, idx) => {
          const config = TYPE_CONFIG[n.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setNotifs(notifs.map((x) => x.id === n.id ? { ...x, read: true } : x))}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${n.read ? "bg-white border-slate-100" : "bg-blue-50/50 border-blue-100"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${config.bg}`}>
                  <Icon size={20} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className={`font-semibold text-sm ${n.read ? "text-slate-900" : "text-slate-900"}`}>{n.title}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{n.time}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
