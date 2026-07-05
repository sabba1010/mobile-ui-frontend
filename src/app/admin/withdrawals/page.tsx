"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock } from "lucide-react";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/withdrawals`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data);
      }
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/withdraw/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Withdrawal request ${status} successfully!`);
        fetchWithdrawals();
      } else {
        toast.error(data.message || "Failed to update withdrawal status");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to execute update");
    }
  };

  const formattedWithdrawals = withdrawals.map(w => {
    let formattedPhone = w.userPhone || "";
    if (formattedPhone.length >= 9) {
      formattedPhone = formattedPhone.substring(0, 6) + " *** " + formattedPhone.substring(formattedPhone.length - 4);
    }
    const rawAmt = Math.abs(w.amount || 0);
    const taxAmt = rawAmt * 0.15;
    const receivedAmt = rawAmt - taxAmt;

    return {
      id: w._id,
      user: formattedPhone,
      amount: rawAmt,
      tax: taxAmt,
      received: receivedAmt,
      wallet: w.description || "Mobile Money",
      date: w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "",
      status: w.status || "pending"
    };
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Withdrawals</h1>
        <p className="text-sm text-slate-500 mt-0.5">Review and process withdrawal requests</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", count: formattedWithdrawals.filter(d=>d.status==="pending").length, color: "bg-amber-50 text-amber-700 border-amber-200" },
          { label: "Approved", count: formattedWithdrawals.filter(d=>d.status==="approved" || d.status==="completed").length, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
          { label: "Rejected", count: formattedWithdrawals.filter(d=>d.status==="rejected").length, color: "bg-red-50 text-red-700 border-red-200" },
        ].map(s => (
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
                {["User","Amount","Tax (15%)","Received","Wallet","Date","Status","Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                    Loading withdrawals...
                  </td>
                </tr>
              ) : formattedWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                formattedWithdrawals.map((w, idx) => (
                  <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                    className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{w.user}</td>
                    <td className="px-4 py-3.5 font-bold text-rose-500">GHS {w.amount.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-slate-500">GHS {w.tax.toLocaleString()}</td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600">GHS {w.received.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-slate-600">{w.wallet}</td>
                    <td className="px-4 py-3.5 text-slate-500">{w.date}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${
                        w.status === "approved" || w.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        w.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
                      }`}>
                        {w.status === "pending" ? <Clock size={11} /> : w.status === "approved" || w.status === "completed" ? <Check size={11} /> : <X size={11} />}
                        <span className="capitalize">{w.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {w.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(w.id, "approved")} className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-200 transition-colors">
                            <Check size={14} />
                          </button>
                          <button onClick={() => updateStatus(w.id, "rejected")} className="w-8 h-8 bg-red-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-200 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </td>
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
