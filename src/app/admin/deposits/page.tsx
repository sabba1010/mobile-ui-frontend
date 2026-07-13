"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDeposit, setViewDeposit] = useState<any>(null);

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/deposits`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setDeposits(data);
      }
    } catch (err) {
      console.error("Failed to fetch deposits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/deposit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Deposit ${status} successfully!`);
        fetchDeposits();
      } else {
        toast.error(data.message || "Failed to update deposit status");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to execute update");
    }
  };

  const formattedDeposits = deposits.map(d => {
    let formattedPhone = d.userPhone || "";
    if (formattedPhone.length >= 9) {
      formattedPhone = formattedPhone.substring(0, 6) + " *** " + formattedPhone.substring(formattedPhone.length - 4);
    }
    return {
      id: d._id,
      user: formattedPhone,
      amount: d.amount || 0,
      method: d.description || "Bank Transfer",
      trxId: d.trxId || "N/A",
      date: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "",
      status: d.status || "pending"
    };
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Deposits</h1>
        <p className="text-sm text-slate-500 mt-0.5">Review and approve deposit requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", count: formattedDeposits.filter(d=>d.status==="pending").length, color: "bg-amber-50 text-amber-700 border-amber-200" },
          { label: "Approved", count: formattedDeposits.filter(d=>d.status==="approved" || d.status==="completed").length, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
          { label: "Rejected", count: formattedDeposits.filter(d=>d.status==="rejected").length, color: "bg-red-50 text-red-700 border-red-200" },
        ].map((s) => (
          <div key={s.label} className={`border rounded-2xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-black">{loading ? "..." : s.count}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["User", "Amount", "Method", "TRX ID", "Date", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                    Loading deposits...
                  </td>
                </tr>
              ) : formattedDeposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                    No deposit requests found
                  </td>
                </tr>
              ) : (
                formattedDeposits.map((d, idx) => (
                  <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                    className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{d.user}</td>
                    <td className="px-4 py-3.5 font-black text-emerald-600">GHS {d.amount.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-slate-700">{d.method}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{d.trxId}</td>
                    <td className="px-4 py-3.5 text-slate-500">{d.date}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${
                        d.status === "approved" || d.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        d.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
                      }`}>
                        {d.status === "pending" ? <Clock size={11} /> : d.status === "approved" || d.status === "completed" ? <Check size={11} /> : <X size={11} />}
                        <span className="capitalize">{d.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {d.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(d.id, "approved")} className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-200 transition-colors">
                            <Check size={14} />
                          </button>
                          <button onClick={() => updateStatus(d.id, "rejected")} className="w-8 h-8 bg-red-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-200 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                      {d.status !== "pending" && (
                        <button onClick={() => setViewDeposit(d)} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                          <Eye size={14} className="text-slate-500" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Deposit Details</h3>
              <button onClick={() => setViewDeposit(null)} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">User Phone</p>
                <p className="font-bold text-slate-900">{viewDeposit.user}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Amount</p>
                <p className="font-black text-emerald-600">GHS {viewDeposit.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Method</p>
                <p className="font-medium text-slate-900">{viewDeposit.method}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">TRX ID</p>
                <p className="font-mono text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">{viewDeposit.trxId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Date</p>
                <p className="font-medium text-slate-900">{viewDeposit.date}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
                <span className={`inline-block mt-1 text-xs font-bold px-2.5 py-1 rounded-lg capitalize ${
                  viewDeposit.status === "approved" || viewDeposit.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                  viewDeposit.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
                }`}>
                  {viewDeposit.status}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
