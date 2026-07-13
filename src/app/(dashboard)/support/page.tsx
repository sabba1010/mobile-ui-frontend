"use client";

import { ArrowLeft, Info, ChevronRight, Clock, Shield, HeadphonesIcon, MessageSquare, Send, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f0f4ff] pb-20">

      {/* Clean Intro Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-800 to-purple-900 pt-8 pb-16 px-5 rounded-b-[32px] shadow-lg mb-8">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-indigo-400/10 -ml-10 -mb-10" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-lg mb-4">
            <HeadphonesIcon size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-black text-white mb-1">How can we help?</h2>
          <p className="text-indigo-200 text-sm font-medium mb-5">Our support team is always ready to assist you.</p>

          {/* Online Hours Badge */}
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <Clock size={13} className="text-indigo-200" />
            <span className="text-white text-xs font-semibold">Online Hours: 9:00 &ndash; 17:00</span>
          </div>
        </div>
      </div>

      {/* Cards overlap */}
      <div className="px-4 -mt-14 space-y-4 relative z-20">

        {/* Deposit Problem Alert Card */}
        <Link href="/support/deposit-problem" className="block">
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-50 p-5 flex items-start gap-4 active:scale-[0.98] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-md shadow-orange-200">
              <Info size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 mb-1">Deposit Problem?</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                If your deposit hasn&apos;t been credited, submit your information and we&apos;ll process it within 24 hours.
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 self-center">
              <ChevronRight size={16} className="text-slate-500" />
            </div>
          </div>
        </Link>

        {/* Contact Us Section */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-100 border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Contact Us</h2>
            </div>
          </div>

          {[
            {
              label: "Telegram Channel",
              sub: "Get official announcements",
              href: "https://t.me/+s4anzVeVpwYwYzU0",
              icon: MessageSquare,
              bg: "from-[#0088cc] to-[#229ED9]",
            },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 active:bg-slate-50 transition-colors"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center shadow-sm shrink-0`}>
                <item.icon size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </a>
          ))}
        </div>

        {/* Trust / Security Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-5 flex items-center gap-4 shadow-lg shadow-indigo-200">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Secure &amp; Confidential</p>
            <p className="text-indigo-200 text-xs mt-0.5 leading-relaxed">
              All conversations are encrypted and your data is always protected.
            </p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-100 border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Important Notes</h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              "If you cannot open the official Telegram app above, please try using another browser.",
              "If you have any questions about our platform, contact our online customer service. They will answer all your questions. Response time may be a bit long, so please be patient.",
              "If our customer service does not reply immediately, please wait patiently. We are receiving many messages and will respond as soon as possible. Thank you for your understanding!",
              "Want to make more money? Join our official Telegram channel for the latest updates!",
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-black text-indigo-600">{i + 1}</span>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
