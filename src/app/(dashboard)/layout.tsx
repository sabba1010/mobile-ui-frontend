"use client";

import { Home, ShoppingCart, Users, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

const BOTTOM_NAV = [
  { name: "Home", href: "/", icon: Home },
  { name: "Product", href: "/products", icon: ShoppingCart },
  { name: "Team", href: "/team", icon: Users },
  { name: "Mine", href: "/mine", icon: User },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getHeaderProps = () => {
    switch (pathname) {
      case '/about': return { title: 'ABOUT US', showBack: true };
      case '/platform-rules': return { title: 'PLATFORM RULES', showBack: true };
      case '/my-devices': return { title: 'MY DEVICE', showBack: true };
      case '/deposit': return { title: 'DEPOSIT', showBack: true };
      case '/withdraw': return { title: 'WITHDRAW', showBack: true };
      case '/support': return { title: 'CUSTOMER SERVICE', showBack: true };
      case '/support/deposit-problem': return { title: 'DEPOSIT PROBLEM', showBack: true };
      case '/team-details': return { title: 'MY TEAM', showBack: true };
      case '/wallet-accounts': return { title: 'PAISON VIP', showBack: false };
      case '/products': return { title: 'PAISON VIP', showBack: false };
      case '/mine': return { title: 'PAISON VIP', showBack: false };
      case '/team': return { title: 'PAISON VIP', showBack: false };
      case '/': return { title: 'PAISON VIP', showBack: false };
      default: return { title: 'PAISON VIP', showBack: false };
    }
  };

  const header = getHeaderProps();

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token") || localStorage.getItem("vip_token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#EDE9FE] flex justify-center">
      <div className="w-full max-w-md bg-white h-full relative shadow-2xl flex flex-col">

        {/* Top Header */}
        <header className="sticky top-0 z-50 h-14 bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
          
          {header.showBack && (
            <button 
              onClick={() => router.back()} 
              className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors z-20 text-white"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <h1 className="text-white font-bold text-lg tracking-widest uppercase drop-shadow-sm relative z-10">
            {header.title}
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-[90px] bg-[#F5F3FF]">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 h-[86px] px-2 pb-2 pt-3 bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-600 flex items-center justify-around z-50 shadow-[0_-10px_30px_rgba(139,92,246,0.25)] rounded-t-[32px] border-t border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.2),transparent_70%)] rounded-t-[32px] pointer-events-none" />
          
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex flex-col items-center justify-between w-[22%] h-full relative z-10"
              >
                <div className={cn(
                  "w-[46px] h-[46px] flex items-center justify-center transition-all duration-500 ease-out",
                  isActive 
                    ? "bg-white rounded-2xl shadow-[0_10px_20px_rgba(255,255,255,0.3)] -translate-y-2 scale-110" 
                    : "bg-transparent rounded-2xl group-hover:bg-white/10 group-hover:-translate-y-1"
                )}>
                  <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={cn(
                      "transition-colors duration-500",
                      isActive ? "text-violet-700" : "text-white/70 group-hover:text-white"
                    )} 
                  />
                </div>
                
                <span className={cn(
                  "text-[11px] font-bold tracking-wider uppercase transition-all duration-500 mb-1", 
                  isActive ? "text-white drop-shadow-md -translate-y-1" : "text-white/70"
                )}>
                  {item.name}
                </span>
                
                {isActive && (
                  <span className="absolute -bottom-0 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

