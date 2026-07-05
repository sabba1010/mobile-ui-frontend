"use client";

import { useState, useEffect } from "react";
import { Wallet, Settings2, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function AdminWalletsPage() {
  const [form, setForm] = useState({
    minDeposit: 50,
    depositInstructions: "",
    minWithdrawal: 100,
    withdrawFee: 5
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setForm({
            minDeposit: data.settings.minDeposit ?? 50,
            depositInstructions: data.settings.depositInstructions ?? "",
            minWithdrawal: data.settings.minWithdrawal ?? 100,
            withdrawFee: data.settings.withdrawFee ?? 5
          });
        }
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      toast.error("Failed to fetch settings from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Platform settings updated successfully!");
        fetchSettings();
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      toast.error("Network error while saving configurations");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
        <p className="text-sm font-semibold">Loading platform settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Wallet Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure platform deposit and withdrawal parameters</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-10 bg-slate-900 text-white font-bold px-4 rounded-xl shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-75"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Settings2 size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-emerald-600" />
            </div>
            <h2 className="font-bold text-slate-900">Deposit Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Minimum Deposit (GHS)</label>
              <input
                type="number"
                value={form.minDeposit}
                onChange={e => setForm({ ...form, minDeposit: Number(e.target.value) })}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Deposit Instructions</label>
              <textarea
                value={form.depositInstructions}
                onChange={e => setForm({ ...form, depositInstructions: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-amber-600" />
            </div>
            <h2 className="font-bold text-slate-900">Withdrawal Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Minimum Withdrawal (GHS)</label>
              <input
                type="number"
                value={form.minWithdrawal}
                onChange={e => setForm({ ...form, minWithdrawal: Number(e.target.value) })}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Withdrawal Fee (%)</label>
              <input
                type="number"
                value={form.withdrawFee}
                onChange={e => setForm({ ...form, withdrawFee: Number(e.target.value) })}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
