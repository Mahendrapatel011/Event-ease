// src/app/layout.tsx

import type { Metadata } from "next";
// --- THIS IS THE CORRECT WAY TO IMPORT GEIST ---
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
// --- END OF FIX ---
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "EventEase",
  description: "The easiest way to manage your events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        // Use the CSS variables provided by the Geist font package
        className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased bg-background aurora-bg`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}