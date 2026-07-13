"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight, Info, AlertCircle, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { WITHDRAW_RULES } from "@/lib/data";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function WithdrawPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [wallets, setWallets] = useState<any[]>([]);
  const [activeWallet, setActiveWallet] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [minWithdrawal, setMinWithdrawal] = useState(30);
  const [taxRate, setTaxRate] = useState(0.15);

  const fetchProfileAndSettings = async () => {
    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token") || localStorage.getItem("vip_token");
      if (!token) return;

      // 1. Fetch Profile Balance
      const res = await fetch(`${API_URL}/api/user/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance || 0);
      }

      // 2. Fetch Platform Settings
      const settingsRes = await fetch(`${API_URL}/api/user/settings`);
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.settings) {
          setMinWithdrawal(settingsData.settings.minWithdrawal || 30);
          setTaxRate((settingsData.settings.withdrawFee || 15) / 100);
        }
      }

      // 3. Fetch Wallets list
      const walletsRes = await fetch(`${API_URL}/api/user/wallets`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (walletsRes.ok) {
        const walletsData = await walletsRes.json();
        if (walletsData.success) {
          const list = walletsData.wallets || [];
          setWallets(list);
          const def = list.find((w: any) => w.isDefault) || list[0] || null;
          setActiveWallet(def);
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile or settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndSettings();
  }, []);

  const numericAmount = parseFloat(amount) || 0;
  const tax = numericAmount * taxRate;
  const received = numericAmount - tax;

  const handleWithdraw = async () => {
    if (numericAmount < minWithdrawal) {
      toast.error(`Minimum withdrawal is GHS ${minWithdrawal}`);
      return;
    }

    if (numericAmount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!activeWallet) {
      toast.error("Please add and select a withdrawal wallet account first");
      return;
    }

    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token") || localStorage.getItem("vip_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const res = await fetch(`${API_URL}/api/user/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount: numericAmount,
          walletDetails: `${activeWallet.type === 'bank' ? 'Bank Account' : 'Mobile Money'} - ${activeWallet.label} (Acct: ${activeWallet.number})`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Withdrawal request submitted successfully!");
        setAmount("");
        fetchProfileAndSettings();
      } else {
        toast.error(data.message || "Failed to submit withdrawal");
      }
    } catch (err) {
      console.error("Withdrawal error:", err);
      toast.error("Network error while withdrawing");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Withdraw</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Balance Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-5 shadow-lg shadow-indigo-600/20">
          <p className="text-white/70 text-xs font-medium mb-1">Available Balance</p>
          <p className="text-3xl font-black text-white">GHS {loading ? "..." : balance.toLocaleString()}</p>
          <div className="mt-3 flex items-center gap-2">
            <Info size={14} className="text-white/60" />
            <p className="text-white/70 text-xs">Processing fees are {taxRate * 100}%</p>
          </div>
        </div>

        {/* Wallet Selection */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-3">Withdrawal Wallet</h3>
          <button
            onClick={() => router.push("/wallet-accounts")}
            className="w-full flex items-center gap-4 p-3.5 border-2 border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50/20 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Landmark size={20} />
            </div>
            <div className="text-left flex-1">
              {activeWallet ? (
                <>
                  <p className="text-sm font-bold text-slate-800">{activeWallet.label}</p>
                  <p className="text-xs text-slate-500">{activeWallet.number}</p>
                </>
              ) : (
                <span className="text-sm font-semibold text-slate-400">
                  Select / Add withdrawal wallet account
                </span>
              )}
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-3">Withdrawal Amount</h3>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">GHS</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-bold text-slate-800"
            />
          </div>
          {numericAmount > 0 && (
            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Fee ({taxRate * 100}%):</span>
                <span className="font-semibold text-red-500">- GHS {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-700 pt-1.5 border-t border-slate-200">
                <span>Amount to receive:</span>
                <span className="text-indigo-600">GHS {received > 0 ? received.toFixed(2) : "0.00"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleWithdraw}
          className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:opacity-95 active:scale-[0.98] transition-all text-sm uppercase tracking-wide"
        >
          Submit Withdrawal Request
        </button>

        {/* Rules */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
            <AlertCircle size={16} className="text-indigo-500" />
            Withdrawal Instructions
          </h3>
          <ul className="space-y-2.5">
            {WITHDRAW_RULES.map((rule, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-[13px] text-slate-500 leading-relaxed font-medium">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
