"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";

export default function AdminIncomePage() {
  const [income, setIncome] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const token = localStorage.getItem("vip_token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/income`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setIncome(data);
        }
      } catch (err) {
        console.error("Failed to fetch income records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, []);

  const formattedIncome = income.map(item => ({
    id: item._id,
    user: item.userPhone || "",
    source: item.source || "",
    amount: item.amount || 0,
    date: item.createdAt ? new Date(item.createdAt).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }) : ""
  }));

  const filtered = formattedIncome.filter(i => 
    i.user.toLowerCase().includes(search.toLowerCase()) || 
    i.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Income Records</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track daily yields and user income</p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by phone or source..."
          className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (GHS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                    Loading income records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                    No income records found
                  </td>
                </tr>
              ) : (
                filtered.map((inc, idx) => (
                  <motion.tr key={inc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                    className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{inc.user}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">{inc.source}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs font-medium">{inc.date}</td>
                    <td className="px-4 py-3.5 font-black text-emerald-600">+{inc.amount}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
