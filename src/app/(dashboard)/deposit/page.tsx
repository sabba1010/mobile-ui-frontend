"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Landmark, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

const METHODS = [
  { id: "bank", icon: Landmark, label: "Bank Transfer", sub: "Standard bank wire" },
];

export default function DepositPage() {
  const router = useRouter();
  const [method, setMethod] = useState("bank");
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [minDeposit, setMinDeposit] = useState(50);
  const [depositInstructions, setDepositInstructions] = useState("Please transfer exact amount to our MOMO number.");

  const fetchHistoryAndSettings = async () => {
    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token") || localStorage.getItem("vip_token");
      if (!token) return;

      // 1. Fetch History
      const res = await fetch(`${API_URL}/api/user/my-deposits`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }

      // 2. Fetch Settings
      const settingsRes = await fetch(`${API_URL}/api/user/settings`);
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.settings) {
          setMinDeposit(settingsData.settings.minDeposit || 50);
          setDepositInstructions(settingsData.settings.depositInstructions || "Please transfer exact amount to our MOMO number.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch deposit page data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryAndSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount < minDeposit) {
      toast.error(`Minimum deposit is GHS ${minDeposit}`);
      return;
    }

    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token") || localStorage.getItem("vip_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const res = await fetch(`${API_URL}/api/user/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: numAmount,
          method: method === "bank" ? "Bank Transfer" : "Mobile Money",
          trxId
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setAmount("");
        setTrxId("");
        setFile(null);
        toast.success("Deposit request submitted successfully!");
        fetchHistoryAndSettings();
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        toast.error(data.message || "Failed to submit deposit request");
      }
    } catch (err) {
      console.error("Submit deposit error:", err);
      toast.error("Network error while submitting deposit");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Deposit</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Payment Methods */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-3">Payment Method</h3>
          <div className="space-y-2">
            {METHODS.map((m) => (
              <button key={m.id} onClick={() => setMethod(m.id)} className={`w-full flex items-center gap-4 p-3.5 rounded-2xl border-2 transition-all ${method === m.id ? "border-primary bg-blue-50" : "border-slate-100 hover:border-slate-200"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === m.id ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                  <m.icon size={20} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm text-slate-900">{m.label}</p>
                  <p className="text-xs text-slate-500">{m.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === m.id ? "border-primary bg-primary" : "border-slate-300"}`}>
                  {method === m.id && <Check size={11} className="text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Deposit Info */}
        <AnimatePresence mode="wait">
          {method === "bank" && (
            <motion.div key="bank" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-1">
              <p className="font-bold text-blue-800 text-sm mb-1">Bank Transfer Details & Instructions</p>
              <p className="text-sm text-blue-700">Bank Name: <strong>GCB Bank</strong></p>
              <p className="text-sm text-blue-700">Account Number: <strong>8071010033230</strong></p>
              <p className="text-sm text-blue-700">Name on account: <strong>Moses Muomaalah</strong></p>
              <p className="text-sm text-blue-700">Phone number: <strong>0204222980</strong></p>
              <p className="text-xs text-blue-600/90 mt-2 font-medium bg-blue-100/50 p-2 rounded-xl border border-blue-200/50 leading-relaxed">
                💡 {depositInstructions}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Deposit Amount (Min. GHS {minDeposit})</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">GHS</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" min={minDeposit} required
                className="w-full h-12 pl-14 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Transaction ID (TRX ID)</label>
            <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)}
              placeholder="Enter TRX ID from your payment" required
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Upload Payment Screenshot</label>
            <label className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-blue-50/50 transition-all">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              {file ? (
                <div className="text-center">
                  <Check size={24} className="text-emerald-500 mx-auto mb-1" />
                  <p className="text-sm font-medium text-emerald-600">{file.name}</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Tap to upload screenshot</p>
                </div>
              )}
            </label>
          </div>

          <AnimatePresence>
            {submitted && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2">
                <Check size={16} className="text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-700">Deposit submitted! Pending review.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-md shadow-primary/20">
            Submit Deposit
          </button>
        </form>

        {/* History */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Deposit History</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-6 text-sm text-slate-400">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-400">No deposits recorded yet</div>
            ) : (
              history.map((h) => (
                <div key={h._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <ArrowLeft size={18} className="text-primary rotate-[-90deg]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-900">GHS {(h.amount || 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-500">
                      {h.description || "Bank Transfer"} · {h.createdAt ? new Date(h.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                    h.status === "approved" || h.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                    h.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  }`}>
                    {h.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
