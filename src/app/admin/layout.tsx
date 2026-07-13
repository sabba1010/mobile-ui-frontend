"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Package, ArrowDownToLine, ArrowUpFromLine,
  ReceiptText, GitBranch, TrendingUp, Megaphone, Image, HeadphonesIcon,
  Wallet, BarChart3, Settings, ShieldCheck, LogOut, ChevronRight, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "VIP Products", href: "/admin/products", icon: Package },
  { label: "Deposits", href: "/admin/deposits", icon: ArrowDownToLine },
  { label: "Withdrawals", href: "/admin/withdrawals", icon: ArrowUpFromLine },
  { label: "Transactions", href: "/admin/transactions", icon: ReceiptText },
  { label: "Referral System", href: "/admin/referrals", icon: GitBranch },
  { label: "Team Management", href: "/admin/team-management", icon: Users },
  { label: "Income Records", href: "/admin/income", icon: TrendingUp },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  // { label: "Banner Mgmt", href: "/admin/banners", icon: Image },
  // { label: "Support Tickets", href: "/admin/tickets", icon: HeadphonesIcon },
  { label: "Wallet Settings", href: "/admin/wallets", icon: Wallet },
  // { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Role Management", href: "/admin/roles", icon: ShieldCheck },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "" : "")}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-white">PAISON VIP</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-wide uppercase">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}>
                <item.icon size={18} className={cn("shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-white/60" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <Link href="/login">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all">
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-60 bg-slate-900 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 bg-slate-900 lg:hidden">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X size={22} />
              </button>
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
            <Menu size={20} className="text-slate-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">Admin Panel</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-none">Super Admin</p>
              <p className="text-xs text-slate-500 mt-0.5">admin@vipinvest.app</p>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
