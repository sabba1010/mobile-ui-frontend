"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Package, Clock, CheckCircle2, TrendingUp, Calendar, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function MyProductsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch profile
      const profRes = await fetch(`${API_URL}/api/user/me`, { headers });
      let profData: any = null;
      if (profRes.ok) {
        profData = await profRes.json();
        setProfile(profData);
      }

      // Fetch transactions
      const txRes = await fetch(`${API_URL}/api/user/my-transactions`, { headers });
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData || []);
      }

      // Fetch products
      const prodRes = await fetch(`${API_URL}/api/products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success) {
          setProducts(prodData.products || []);
        }
      }
    } catch (err) {
      console.error("Failed to load user products data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDailyWork = async () => {
    setWorking(true);
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/daily-work`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Daily yield claimed successfully!");
        // Reload data to reflect new transaction and balance
        await loadData();
      } else {
        toast.error(data.message || "Failed to claim daily yield.");
      }
    } catch (err) {
      toast.error("Network error while claiming yield.");
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mb-2" />
        <p className="text-sm text-slate-400 font-medium">Loading active products...</p>
      </div>
    );
  }

  // Check if user has an active plan
  const hasPlan = profile?.plan && profile.plan !== "None";
  
  // Find product details
  const activeProduct = hasPlan 
    ? products.find(p => p.name === profile.plan || p.name.replace(/\s+/g, '') === profile.plan.replace(/\s+/g, ''))
    : null;

  // Filter yields/income transactions for this active plan
  const planYields = transactions.filter(t => 
    t.type === "income" && 
    (t.description.includes("Yield") || t.description.includes("daily") || t.description.includes("yield") || t.description.includes("Yield"))
  );
  
  const totalEarned = planYields.reduce((sum, t) => sum + t.amount, 0);

  // Find purchase date from transactions
  const purchaseTx = transactions.find(t => 
    t.type === "purchase" && 
    t.description.replace(/\s+/g, '').includes(profile?.plan?.replace(/\s+/g, ''))
  );
  
  const purchaseDate = purchaseTx 
    ? new Date(purchaseTx.createdAt).toLocaleDateString('en-GB')
    : "Recently";

  // Calculate remaining days
  let daysRemaining = activeProduct?.days || 720;
  if (purchaseTx) {
    const timeDiff = Date.now() - new Date(purchaseTx.createdAt).getTime();
    const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max((activeProduct?.days || 720) - daysPassed, 0);
  }

  const progress = activeProduct 
    ? Math.round(((activeProduct.days - daysRemaining) / activeProduct.days) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">My Products</h1>
          <span className="ml-auto text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
            {hasPlan ? "1" : "0"} Active
          </span>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {!hasPlan || !activeProduct ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-10 mt-10">
            <div className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-md border border-violet-100 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-violet-50 text-violet-500 rounded-2xl flex items-center justify-center mb-4">
                <Package size={32} />
              </div>
              <p className="text-slate-700 font-bold text-base">No active investment devices</p>
              <p className="text-slate-400 text-xs mt-1.5 max-w-[200px]">Go to the Product page and purchase a VIP massage chair to start earning daily returns.</p>
              <button 
                onClick={() => router.push("/products")} 
                className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl text-xs shadow-md shadow-violet-500/20 active:scale-95 transition-transform"
              >
                BROWSE VIP DEVICES
              </button>
            </div>
          </div>
        ) : (
          /* Running Product Card */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-5 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/10 shadow-inner">
                <img src={activeProduct.image || "https://i.ibb.co.com/CqbjZKz/1-2.png"} alt={activeProduct.name} className="w-[90%] h-[90%] object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-white">{activeProduct.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Running
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
                  <TrendingUp size={16} className="text-emerald-600 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Daily</p>
                  <p className="text-sm font-black text-emerald-600">GHS {activeProduct.daily}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
                  <Clock size={16} className="text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Remaining</p>
                  <p className="text-sm font-black text-primary">{daysRemaining}d</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
                  <CheckCircle2 size={16} className="text-violet-600 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Earned</p>
                  <p className="text-sm font-black text-violet-600">GHS {totalEarned.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Usage Cycle Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pb-2 border-b border-slate-100">
                <Calendar size={12} />
                <span>Purchased on: {purchaseDate}</span>
              </div>

              {/* Work Panel depending on referral status */}
              {profile?.referredBy ? (
                /* Auto-yield mode for team members */
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col items-center text-center gap-1.5 mt-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs uppercase animate-pulse">
                    Auto
                  </div>
                  <p className="text-xs font-bold text-emerald-800">Auto-Yield System Active</p>
                  <p className="text-[10px] text-emerald-600/90 leading-relaxed max-w-[280px]">
                    You are a registered team member. Daily task work is automated for your account; returns are automatically credited without manual action.
                  </p>
                </div>
              ) : (
                /* Manual work mode for standard users */
                <div className="mt-2 space-y-2.5">
                  <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2 leading-relaxed font-semibold">
                    ⏱ Standard Account: You must manually run the machine once every 24 hours to claim your daily yield of GHS {activeProduct.daily}.
                  </p>
                  
                  <button
                    onClick={handleDailyWork}
                    disabled={working}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 active:scale-95 transition-all disabled:opacity-75"
                  >
                    {working ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Play size={16} fill="white" />
                        RUN MACHINE & COLLECT YIELD
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
