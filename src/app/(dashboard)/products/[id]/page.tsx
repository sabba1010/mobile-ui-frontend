"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Package, Check, ShieldCheck, Clock, TrendingUp, Calendar } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            const found = data.products.find((p: any) => p._id === params.id);
            setProduct(found || data.products[0] || null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleBuy = async () => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const res = await fetch(`${API_URL}/api/products/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Purchase successful!");
        setPurchased(true);
        setTimeout(() => {
          setShowModal(false);
          router.push("/my-products");
        }, 1800);
      } else {
        toast.error(data.message || "Failed to purchase plan");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      toast.error("Network error while purchasing plan");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mb-2" />
        <p className="text-sm text-slate-400 font-medium">Loading plan details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Package size={48} className="text-slate-300 mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Plan Not Found</h2>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 px-4 pt-4 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Plan Details</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center overflow-hidden shrink-0 border border-white/10 shadow-inner">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package size={40} className="text-white" />
            )}
          </div>
          <div>
            {product.badge && (
              <div className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full mb-1.5">
                <span className="text-white/90 text-[11px] font-semibold">{product.badge}</span>
              </div>
            )}
            <h2 className="text-2xl font-black text-white">{product.name}</h2>
            <p className="text-white/75 text-sm font-medium">Investment Plan</p>
          </div>
        </div>
      </div>

      {/* Content pulled up */}
      <div className="px-4 -mt-8 space-y-4">
        {/* Price Card */}
        <div className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Investment Amount</p>
              <p className="text-3xl font-black text-primary">GHS {(product.price || 0).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">ROI</p>
              <p className="text-xl font-bold text-emerald-600">
                {product.price ? Math.round(((product.total || 0) / product.price - 1) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: TrendingUp, label: "Daily Income", value: `GHS ${(product.daily || 0).toLocaleString()}`, color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: Calendar, label: "Period", value: `${product.days || 0} Days`, color: "text-primary", bg: "bg-blue-50" },
            { icon: ShieldCheck, label: "Total Return", value: `GHS ${(product.total || 0).toLocaleString()}`, color: "text-violet-600", bg: "bg-violet-50" },
            { icon: Clock, label: "Income After", value: "24 Hours", color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-2`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className="text-[11px] text-slate-500 mb-0.5">{stat.label}</p>
              <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-3">Investment Rules</h3>
          <div className="space-y-2.5">
            {[
              "Income starts 24 hours after purchase",
              "Daily income is automatically credited",
              "Plan runs for specified consecutive days",
              "Plan cannot be cancelled after purchase",
              "You can purchase multiple plans",
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-emerald-600" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Buy Button */}
        {product.active !== false ? (
          <button
            onClick={() => setShowModal(true)}
            className="w-full h-14 bg-primary text-white font-bold rounded-2xl text-base shadow-lg shadow-primary/25 hover:bg-blue-700 transition-all hover:shadow-xl active:scale-[0.98]"
          >
            Purchase {product.name} — GHS {product.price}
          </button>
        ) : (
          <button
            disabled
            className="w-full h-14 bg-slate-300 text-slate-600 font-bold rounded-2xl text-base cursor-not-allowed opacity-80"
          >
            🔒 Plan Coming Soon
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-0"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 shadow-2xl"
            >
              {purchased ? (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 250 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check size={40} className="text-emerald-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Purchase Successful!</h3>
                  <p className="text-slate-500 text-sm">Your {product.name} plan is now active.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Confirm Purchase</h3>
                  <p className="text-sm text-slate-500 mb-6">You are about to purchase {product.name}</p>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Plan</span>
                      <span className="font-semibold">{product.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Amount</span>
                      <span className="font-bold text-primary">GHS {product.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Daily Income</span>
                      <span className="font-semibold text-emerald-600">GHS {product.daily}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-semibold">{product.days} Days</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowModal(false)} className="flex-1 h-12 border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleBuy} className="flex-1 h-12 bg-primary text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-md shadow-primary/20">
                      Confirm Buy
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
