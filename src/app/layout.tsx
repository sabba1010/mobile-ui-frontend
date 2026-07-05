import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIP Invest - Premium Investment Platform",
  description: "Earn daily passive income with VIP investment plans. Invite friends and grow your wealth.",
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground" suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
