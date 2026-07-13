"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Percent, Shield, ArrowDown, ArrowUp } from "lucide-react";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    minDeposit: 50,
    depositInstructions: "Please transfer exact amount to our MOMO number.",
    minWithdrawal: 30,
    withdrawFee: 5,
    commissionRateL1: 20,
    commissionRateL2: 3,
    commissionRateL3: 2,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("vip_token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setConfig({
              minDeposit: data.settings.minDeposit || 50,
              depositInstructions: data.settings.depositInstructions || "",
              minWithdrawal: data.settings.minWithdrawal || 30,
              withdrawFee: data.settings.withdrawFee || 5,
              commissionRateL1: data.settings.commissionRateL1 !== undefined ? data.settings.commissionRateL1 : 20,
              commissionRateL2: data.settings.commissionRateL2 !== undefined ? data.settings.commissionRateL2 : 3,
              commissionRateL3: data.settings.commissionRateL3 !== undefined ? data.settings.commissionRateL3 : 2,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) {
        toast.error("Authentication required");
        setSaving(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/user/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Platform settings updated successfully!");
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      toast.error("Network error while saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 text-sm">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Platform configuration, transaction limits, and referral commissions</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-10 bg-primary text-white font-bold px-5 rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-75"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction limits settings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 pb-3 border-b border-slate-50">
            <Shield size={18} className="text-primary" /> Limits & Transfers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Min Deposit (GHS)</label>
              <div className="relative">
                <input
                  type="number"
                  value={config.minDeposit}
                  onChange={(e) => setConfig({ ...config, minDeposit: Number(e.target.value) })}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Min Withdrawal (GHS)</label>
              <input
                type="number"
                value={config.minWithdrawal}
                onChange={(e) => setConfig({ ...config, minWithdrawal: Number(e.target.value) })}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Withdrawal Fee (%)</label>
            <input
              type="number"
              value={config.withdrawFee}
              onChange={(e) => setConfig({ ...config, withdrawFee: Number(e.target.value) })}
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Deposit Instructions</label>
            <textarea
              rows={3}
              value={config.depositInstructions}
              onChange={(e) => setConfig({ ...config, depositInstructions: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        {/* Commission settings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 pb-3 border-b border-slate-50">
            <Percent size={18} className="text-emerald-600" /> Referral Commission Rates
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed -mt-2">
            These percentages are dynamically distributed to referrers when a downline user purchases a VIP product plan.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-800">Level 1 (Direct Referrals)</p>
                <p className="text-xs text-slate-500">First-level direct team member commission</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={config.commissionRateL1}
                  onChange={(e) => setConfig({ ...config, commissionRateL1: Number(e.target.value) })}
                  className="w-20 h-10 px-3 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <span className="text-sm font-black text-slate-600">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-800">Level 2 (Indirect referrals)</p>
                <p className="text-xs text-slate-500">Sub-level team member commission</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={config.commissionRateL2}
                  onChange={(e) => setConfig({ ...config, commissionRateL2: Number(e.target.value) })}
                  className="w-20 h-10 px-3 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <span className="text-sm font-black text-slate-600">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-800">Level 3 (Indirect referrals)</p>
                <p className="text-xs text-slate-500">Sub-sub-level team member commission</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={config.commissionRateL3}
                  onChange={(e) => setConfig({ ...config, commissionRateL3: Number(e.target.value) })}
                  className="w-20 h-10 px-3 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <span className="text-sm font-black text-slate-600">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
