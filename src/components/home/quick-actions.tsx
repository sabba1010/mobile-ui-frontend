"use client";

import { Wallet, ArrowDownToLine, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function QuickActions() {
  const actions = [
    {
      name: "Deposit",
      icon: Wallet,
      href: "/deposit",
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Withdraw",
      icon: ArrowDownToLine,
      href: "/withdraw",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      name: "Support",
      icon: HeadphonesIcon,
      href: "/support",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="px-4 mt-6">
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.name} href={action.href}>
              <Card className="flex flex-col items-center justify-center p-4 border-0 shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow rounded-[16px]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${action.color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-semibold text-slate-700">{action.name}</span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
