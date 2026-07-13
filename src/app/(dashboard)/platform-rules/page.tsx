"use client";

import { Info } from "lucide-react";

export default function PlatformRulesPage() {
  const tableData = [
    { grade: "Level 1", invest: "80", daily: "20", cycle: "720", total: "14,400" },
    { grade: "Level 2", invest: "160", daily: "41", cycle: "720", total: "29,520" },
    { grade: "Level 3", invest: "320", daily: "85", cycle: "720", total: "61,200" },
    { grade: "Level 4", invest: "500", daily: "160", cycle: "720", total: "115,200" },
    { grade: "Level 5", invest: "1,000", daily: "320", cycle: "720", total: "230,400" },
    { grade: "Level 6", invest: "2,000", daily: "650", cycle: "720", total: "468,000" },
    { grade: "Level 7", invest: "4,000", daily: "1,428", cycle: "720", total: "1,028,160" },
    { grade: "Level 8", invest: "8,000", daily: "3,000", cycle: "720", total: "2,160,000" },
    { grade: "Level 9", invest: "16,000", daily: "6,400", cycle: "720", total: "4,608,000" },
    { grade: "Level 10", invest: "20,000", daily: "9,000", cycle: "720", total: "6,480,000" },
  ];

  const rules = [
    "New users receive 30 Ghanaian Cedis upon registration.",
    "Earn commissions of 20%, 3%, and 2% respectively by referring friends.",
    "The minimum withdrawal amount is 30 Ghanaian Cedis.",
    "You must purchase at least one product before you can make a withdrawal — including the GHS 30 login bonus.",
    "Earn a 10% rebate on the product value with your first purchase.",
    "No withdrawal delays; service available 24/7. Withdraw anytime, no waiting.",
    "The platform has a comprehensive risk management system that strictly reviews and controls every transaction to ensure the safety and compliance of your funds.",
    "Follow our official channels for more information."
  ];

  return (
    <div className="min-h-screen bg-[#F5F3FF] p-4 pb-10 font-sans">
      
      {/* Intro Text */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-violet-100 mb-6">
        <p className="text-sm text-slate-600 leading-relaxed text-justify">
          Panasonic massage chairs have undergone a long period of development, incorporating a variety of unique functions. With the advent of 5G, the application of artificial intelligence will further expand, and massage chairs based on body shape recognition technology will continue to improve. It is expected that in the coming years, automatic massage chairs will provide a better customer experience for more people.
        </p>
      </div>

      {/* Investment Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-violet-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-600 py-3 text-center">
          <h2 className="text-white font-black text-xl tracking-widest drop-shadow-sm">Panasonic</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-indigo-900 text-white font-bold">
                <th className="py-2.5 px-2 border-r border-indigo-700 w-1/5">Product Grade</th>
                <th className="py-2.5 px-2 border-r border-indigo-700 w-1/5">Invest<br/>(GHS)</th>
                <th className="py-2.5 px-2 border-r border-indigo-700 w-1/5">Daily Income<br/>(GHS)</th>
                <th className="py-2.5 px-2 border-r border-indigo-700 w-1/5">Product Cycle<br/>(Days)</th>
                <th className="py-2.5 px-2 w-1/5">Total Revenue<br/>(GHS)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-violet-50/50 transition-colors">
                  <td className="py-3 px-2 border-r border-slate-100 font-bold text-indigo-700">{row.grade}</td>
                  <td className="py-3 px-2 border-r border-slate-100 text-slate-700 font-medium">{row.invest}</td>
                  <td className="py-3 px-2 border-r border-slate-100 text-emerald-600 font-bold">{row.daily}</td>
                  <td className="py-3 px-2 border-r border-slate-100 text-slate-600">{row.cycle}</td>
                  <td className="py-3 px-2 text-indigo-600 font-bold">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-violet-100">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Info size={18} className="text-violet-600" />
          <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Rules & Guidelines</h3>
        </div>
        <div className="space-y-4">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-indigo-600 font-black text-sm shrink-0">{idx + 1}.</span>
              <p className="text-sm text-slate-600 leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
