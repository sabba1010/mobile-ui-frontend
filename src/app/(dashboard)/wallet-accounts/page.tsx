"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Check, Landmark, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

const WALLET_TYPES = [
  { id: "bank", label: "Bank Account", color: "text-primary bg-blue-50" },
  { id: "momo", label: "Mobile Money (MoMo)", color: "text-amber-700 bg-amber-50" }
];

export default function WalletAccountsPage() {
  const router = useRouter();
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [walletType, setWalletType] = useState("");
  const [walletNumber, setWalletNumber] = useState("");
  const [walletLabel, setWalletLabel] = useState("");
  const [bankName, setBankName] = useState("");

  const fetchWallets = async () => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/wallets`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setWallets(data.wallets || []);
        }
      }
    } catch (err) {
      console.error("Failed to load wallets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletType || !walletLabel || !walletNumber || (walletType === 'bank' && !bankName)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/wallets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ type: walletType, label: walletLabel, number: walletNumber, bankName: walletType === 'bank' ? bankName : '' })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWallets(data.wallets);
        toast.success("Wallet added successfully!");
        setWalletNumber("");
        setWalletLabel("");
        setWalletType("");
        setBankName("");
        setShowAdd(false);
      } else {
        toast.error(data.message || "Failed to add wallet");
      }
    } catch (err) {
      toast.error("Network error while adding wallet");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/wallets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWallets(data.wallets);
        toast.success("Wallet account deleted!");
      } else {
        toast.error(data.message || "Failed to delete wallet");
      }
    } catch (err) {
      toast.error("Network error while deleting wallet");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/wallets/${id}/default`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWallets(data.wallets);
        toast.success("Default wallet updated!");
      } else {
        toast.error(data.message || "Failed to update default wallet");
      }
    } catch (err) {
      toast.error("Network error while updating default wallet");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Wallet Accounts</h1>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-bold px-3.5 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mb-2" />
            Loading accounts...
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Landmark size={28} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-600">No wallets added</p>
            <p className="text-sm text-slate-400 mt-1">Add a wallet to start withdrawing</p>
          </div>
        ) : (
          wallets.map((wallet, idx) => (
            <motion.div
              key={wallet._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${wallet.type === 'bank' ? "text-indigo-600 bg-indigo-50" : "text-amber-600 bg-amber-50"}`}>
                  <Landmark size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-slate-900 text-sm">{wallet.label}</p>
                    {wallet.isDefault && <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-md">Default</span>}
                  </div>
                  <p className="text-xs text-slate-500">
                    {wallet.type === 'bank' && wallet.bankName ? `${wallet.bankName} - ` : ""}
                    {wallet.number}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                {!wallet.isDefault && (
                  <button onClick={() => handleSetDefault(wallet._id)} className="flex-1 py-2 border border-indigo-600 text-indigo-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-indigo-50 transition-colors">
                    <Check size={13} /> Set Default
                  </button>
                )}
                <button onClick={() => handleDelete(wallet._id)} className="flex-1 py-2 border border-red-200 text-red-500 text-xs font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-red-50 transition-colors">
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Wallet Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[400px] bg-white rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-5">Add Wallet</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium text-black mb-1.5 block">*Select operator channel</label>
                  <div className="relative">
                    <select
                      value={walletType}
                      onChange={(e) => setWalletType(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded text-[13px] text-slate-600 focus:outline-none appearance-none"
                    >
                      <option value="" disabled>Please select</option>
                      {WALLET_TYPES.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-black mb-1.5 block">*Account Title / Name</label>
                  <input 
                    value={walletLabel} 
                    onChange={(e) => setWalletLabel(e.target.value)} 
                    placeholder={walletType === 'bank' ? "e.g. John Doe" : "e.g. MTN MoMo - John"}
                    required
                    className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded text-[13px] text-slate-700 focus:outline-none"
                  />
                </div>

                {walletType === 'bank' && (
                  <div>
                    <label className="text-[13px] font-medium text-black mb-1.5 block">*Bank Name</label>
                    <input 
                      value={bankName} 
                      onChange={(e) => setBankName(e.target.value)} 
                      placeholder="e.g. GCB Bank, Ecobank"
                      required={walletType === 'bank'}
                      className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded text-[13px] text-slate-700 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[13px] font-medium text-black mb-1.5 block">*Account Number / Phone</label>
                  <input 
                    value={walletNumber} 
                    onChange={(e) => setWalletNumber(e.target.value)} 
                    placeholder="e.g. +233 551234567"
                    required
                    className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded text-[13px] text-slate-700 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="flex-1 h-10 border border-slate-200 text-slate-500 rounded text-xs font-bold hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 h-10 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all">
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
