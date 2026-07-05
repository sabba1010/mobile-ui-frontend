"use client";

import { useState, useEffect } from "react";
import { Search, Eye, CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownLeft, X } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTrx, setSelectedTrx] = useState<any | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("vip_token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/transactions`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formattedTransactions = transactions.map(item => ({
    id: item._id,
    user: item.userPhone || "",
    type: item.type === "withdraw" ? "withdrawal" : item.type === "purchase" ? "investment" : item.type,
    amount: Math.abs(item.amount),
    description: item.description || "",
    date: item.createdAt ? new Date(item.createdAt).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }) : "",
    status: item.status || "completed"
  }));

  const filtered = formattedTransactions.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) || 
    t.user.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all user deposits, withdrawals, and investments</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Transaction ID, Phone, or Type..."
          className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Trx ID</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                    Loading transactions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((trx, idx) => (
                  <motion.tr key={trx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                    className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900 truncate max-w-[120px]">{trx.id}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">{trx.user}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {trx.type === "deposit" && <ArrowDownLeft size={14} className="text-emerald-500" />}
                        {trx.type === "withdrawal" && <ArrowUpRight size={14} className="text-red-500" />}
                        {trx.type === "income" && <ArrowDownLeft size={14} className="text-violet-500" />}
                        {trx.type === "investment" && <CheckCircle size={14} className="text-primary" />}
                        <span className="capitalize font-semibold text-slate-700">{trx.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-black text-slate-900">GHS {trx.amount.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs font-medium">{trx.date}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${
                        trx.status === "completed" || trx.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                        trx.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
                      }`}>
                        {trx.status === "completed" || trx.status === "approved" ? <CheckCircle size={11} /> : trx.status === "pending" ? <Clock size={11} /> : <XCircle size={11} />}
                        <span className="capitalize">{trx.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button 
                        onClick={() => setSelectedTrx(trx)}
                        className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">Transaction Details</h2>
              <button onClick={() => setSelectedTrx(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Transaction ID</p>
                  <p className="text-sm font-semibold text-slate-800 break-all">{selectedTrx.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">User Phone</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedTrx.user}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Type</p>
                  <p className="text-sm font-semibold text-slate-800 capitalize">{selectedTrx.type}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Description</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedTrx.description || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Amount</p>
                  <p className="text-sm font-bold text-slate-800">GHS {selectedTrx.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date & Time</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedTrx.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</p>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 mt-1 capitalize ${
                    selectedTrx.status === "completed" || selectedTrx.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                    selectedTrx.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
                  }`}>
                    {selectedTrx.status === "completed" || selectedTrx.status === "approved" ? <CheckCircle size={10} /> : selectedTrx.status === "pending" ? <Clock size={10} /> : <XCircle size={10} />}
                    {selectedTrx.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTrx(null)}
              className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
