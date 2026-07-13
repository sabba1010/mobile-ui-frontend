// VIP Products Data
export const VIP_PRODUCTS = [
  {
    id: 1,
    name: "VIP 1",
    price: 80,
    dailyIncome: 20,
    totalIncome: 14400,
    days: 720,
    color: "from-blue-500 to-blue-700",
    badge: "Starter",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    name: "VIP 2",
    price: 160,
    dailyIncome: 41,
    totalIncome: 29520,
    days: 720,
    color: "from-indigo-500 to-indigo-700",
    badge: "Popular",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: 3,
    name: "VIP 3",
    price: 320,
    dailyIncome: 85,
    totalIncome: 61200,
    days: 720,
    color: "from-violet-500 to-violet-700",
    badge: "Advanced",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    id: 4,
    name: "VIP 4",
    price: 640,
    dailyIncome: 173,
    totalIncome: 124560,
    days: 720,
    color: "from-purple-500 to-purple-700",
    badge: "Premium",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    id: 5,
    name: "VIP 5",
    price: 1280,
    dailyIncome: 350,
    totalIncome: 252000,
    days: 720,
    color: "from-fuchsia-500 to-fuchsia-700",
    badge: "Elite",
    badgeColor: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    id: 6,
    name: "VIP 6",
    price: 2560,
    dailyIncome: 704,
    totalIncome: 506880,
    days: 720,
    color: "from-rose-500 to-pink-700",
    badge: "Diamond",
    badgeColor: "bg-rose-100 text-rose-700",
  },
];

export const REFERRAL_LEVELS = [
  { level: 1, commission: 20, color: "text-amber-600 bg-amber-50", border: "border-amber-200" },
  { level: 2, commission: 3, color: "text-blue-600 bg-blue-50", border: "border-blue-200" },
  { level: 3, commission: 2, color: "text-emerald-600 bg-emerald-50", border: "border-emerald-200" },
];

export const WITHDRAW_RULES = [
  "The minimum withdrawal amount is GHS 30.",
  "You can only withdraw 3 times per day.",
  "15% tax is deducted from each withdrawal.",
  "Withdrawals usually arrive immediately, but may take up to 24 hours.",
  "Ensure your withdrawal account information is correct.",
  "You must purchase at least one product before you can make a withdrawal — including the GHS 30 login bonus.",
];

export const TRANSACTION_HISTORY = [
  { id: 1, type: "income", label: "Daily Income - VIP 2", amount: 41, date: "2026-06-30", status: "completed" },
  { id: 2, type: "deposit", label: "Deposit - Mobile Money", amount: 500, date: "2026-06-29", status: "completed" },
  { id: 3, type: "withdraw", label: "Withdrawal", amount: -200, date: "2026-06-28", status: "completed" },
  { id: 4, type: "referral", label: "Referral Bonus - Level 1", amount: 16, date: "2026-06-27", status: "completed" },
  { id: 5, type: "purchase", label: "Purchase - VIP 2", amount: -160, date: "2026-06-26", status: "completed" },
  { id: 6, type: "income", label: "Daily Income - VIP 1", amount: 20, date: "2026-06-25", status: "completed" },
];
