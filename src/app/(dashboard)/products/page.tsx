"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, TrendingUp, Wallet, CheckCircle, X } from "lucide-react";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [myIncome, setMyIncome] = useState<number>(0);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch profile
      const profRes = await fetch(`${API_URL}/api/user/me`, { headers });
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile(profData);
      }

      // Fetch transactions for income
      const txRes = await fetch(`${API_URL}/api/user/my-transactions`, { headers });
      if (txRes.ok) {
        const txData = await txRes.json();
        const income = (txData || [])
          .filter((t: any) => t.type === "income")
          .reduce((sum: number, t: any) => sum + t.amount, 0);
        setMyIncome(income);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetchUserData();
  }, []);

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;
    setConfirming(true);
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) {
        toast.error("Authentication required");
        setConfirming(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/products/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId: selectedProduct._id })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Purchase successful!");
        setConfirming(false);
        setDone(true);
        fetchUserData(); // Refresh profile values
        setTimeout(() => { 
          setDone(false); 
          setSelectedProduct(null); 
        }, 1800);
      } else {
        toast.error(data.message || "Failed to purchase plan");
        setConfirming(false);
      }
    } catch (err) {
      console.error("Purchase error:", err);
      toast.error("Network error while purchasing plan");
      setConfirming(false);
    }
  };

  const closeModal = () => { if (!confirming) { setSelectedProduct(null); setDone(false); } };

  return (
    <div className="flex flex-col bg-[#F5F3FF] min-h-full pb-6 relative">
      {/* Top Banner */}
      <div className="w-full relative aspect-[16/9] bg-indigo-950 shrink-0 shadow-md overflow-hidden">
        <img
          src="/Gemini_Generated_Image_8qh20z8qh20z8qh2.png"
          alt="VIP Investment"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-violet-900/10" />
        <div className="absolute inset-x-0 bottom-0 flex justify-between px-6 py-4 bg-gradient-to-t from-indigo-950/95 via-violet-900/50 to-transparent">
          <div className="text-center backdrop-blur-sm bg-white/10 px-6 py-2.5 rounded-2xl border border-white/20 shadow-md">
            <p className="text-white font-black text-xl leading-none drop-shadow-md">
              {profile?.plan && profile.plan !== "None" ? "1" : "0"}
            </p>
            <p className="text-indigo-200 text-[11px] mt-1.5 font-medium tracking-wide">My device</p>
          </div>
          <div className="text-center backdrop-blur-sm bg-white/10 px-6 py-2.5 rounded-2xl border border-white/20 shadow-md">
            <p className="text-white font-black text-xl leading-none drop-shadow-md">GHS {myIncome.toLocaleString()}</p>
            <p className="text-indigo-200 text-[11px] mt-1.5 font-medium tracking-wide">My income</p>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="px-4 pt-8 mt-2 space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-[28px] h-36 animate-pulse border border-violet-100 shadow-sm" />
          ))
        ) : products.length === 0 ? (
          <div className="text-center text-slate-500 py-10 text-sm">No products found</div>
        ) : (
          products.map((prod, idx) => (
            <motion.div
              key={prod._id || prod.id}
              whileTap={{ scale: prod.active ? 0.98 : 1 }}
              onClick={() => setSelectedProduct(prod)}
              className={`bg-white rounded-[28px] p-4 flex gap-4 shadow-sm border relative overflow-hidden transition-all cursor-pointer ${prod.active ? 'border-violet-100/80 hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 active:scale-[0.99]' : 'border-amber-100/80 hover:shadow-md hover:shadow-amber-100/50'}`}
            >
              {/* Background glow */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-violet-100 to-fuchsia-50 rounded-full blur-2xl opacity-60 pointer-events-none" />

              {/* Image */}
              <div className="w-[104px] h-[104px] shrink-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-violet-50 rounded-[20px] border border-violet-100/60 relative z-10 shadow-inner group">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-[90%] h-[90%] object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between relative z-10 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-black text-slate-900 text-base leading-tight">{prod.name}</h3>
                    <span className="text-[10px] font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Income after 24h
                    </span>
                  </div>
                  {prod.active ? (
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-sm shadow-indigo-200 shrink-0">
                      Buy Now
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-sm shadow-amber-200 shrink-0 animate-pulse">
                      🔒 Soon
                    </div>
                  )}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
                  <p className="text-[11px] text-slate-500">Price</p>
                  <p className="text-[11px] font-black text-indigo-700">GHS {prod.price.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500">Daily</p>
                  <p className="text-[11px] font-black text-emerald-600">GHS {prod.daily.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500">Total</p>
                  <p className="text-[11px] font-black text-emerald-600">GHS {prod.total.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500">Period</p>
                  <p className="text-[11px] font-black text-violet-600">{prod.days} days</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#1e1b4b]/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 16 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border border-white/20"
            >
              {/* Brand gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3730a3] via-[#4f46e5] to-[#7c3aed]" />
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-52 h-52 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button onClick={closeModal} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <X size={15} className="text-white" />
              </button>

              <div className="relative z-10 flex flex-col items-center px-7 pt-8 pb-7">

                {/* Image with glow ring */}
                <div className="relative w-28 h-28 mb-5">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-28 h-28 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-inner">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-20 h-20 object-contain drop-shadow-xl hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-white text-3xl font-black self-start mb-2 tracking-tight">
                  {selectedProduct.name}
                </h2>

                {/* Warning */}
                <div className="self-start bg-red-500/15 border border-red-400/25 rounded-2xl px-4 py-3 mb-6 w-full">
                  <p className="text-red-300 text-[12px] font-semibold leading-relaxed">
                    ⏱ Income generates after owning a massage chair for 24 hours
                  </p>
                </div>

                {/* Stats */}
                <div className="w-full space-y-3 mb-7">
                  {[
                    { label: "Price", value: `GHS ${selectedProduct.price.toLocaleString()}`, color: "text-white", icon: Wallet },
                    { label: "Daily income", value: `GHS ${selectedProduct.daily.toLocaleString()}`, color: "text-emerald-300", icon: TrendingUp },
                    { label: "Total income", value: `GHS ${selectedProduct.total.toLocaleString()}`, color: "text-emerald-300", icon: TrendingUp },
                    { label: "Ownership period", value: `${selectedProduct.days} days`, color: "text-indigo-200", icon: Clock },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-white/10 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <item.icon size={13} className="text-white/40" />
                        <span className="text-white/70 text-sm font-medium">{item.label}</span>
                      </div>
                      <span className={`font-black text-base ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                {selectedProduct.active ? (
                  <div className="w-full flex gap-3">
                    <button
                      onClick={closeModal}
                      disabled={confirming}
                      className="flex-1 py-3.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-bold rounded-2xl hover:bg-white/25 transition-all active:scale-95 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmPurchase}
                      disabled={confirming || done}
                      className="flex-1 py-3.5 bg-white text-indigo-700 text-sm font-black rounded-2xl hover:bg-indigo-50 shadow-lg shadow-indigo-900/30 transition-all active:scale-95 disabled:opacity-80 flex items-center justify-center gap-2"
                    >
                      {done ? (
                        <><CheckCircle size={16} className="text-emerald-600" /> Done!</>
                      ) : confirming ? (
                        <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
                      ) : (
                        "Confirm"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="w-full text-center">
                    <div className="bg-amber-400/20 border border-amber-400/30 rounded-2xl px-5 py-4 mb-4">
                      <p className="text-amber-300 font-black text-lg mb-1">🔒 Coming Soon</p>
                      <p className="text-white/60 text-xs">This plan will be available soon. Stay tuned!</p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="w-full py-3.5 bg-white/15 border border-white/25 text-white text-sm font-bold rounded-2xl hover:bg-white/25 transition-all active:scale-95"
                    >
                      Close
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
