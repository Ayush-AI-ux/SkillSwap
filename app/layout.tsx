import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Zap } from "lucide-react";
import "./globals.css";
import Navbar from "@/components/Navbar";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSwap: hire young creators",
  description: "A creator gig marketplace where young creators monetize their skills.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${font.className} min-h-screen antialiased`}>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mt-10 border-t border-gray-100 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-gray-500">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Zap size={14} fill="currentColor" />
              </span>
              SkillSwap
            </div>
            <div className="flex gap-5">
              <Link href="/" className="hover:text-gray-900">Browse</Link>
              <Link href="/gigs/new" className="hover:text-gray-900">Post a gig</Link>
              <Link href="/dashboard" className="hover:text-gray-900">Creator dashboard</Link>
              <Link href="/my-bookings" className="hover:text-gray-900">My bookings</Link>
            </div>
            <p>A marketplace for young creators</p>
          </div>
        </footer>
      </body>
    </html>
  );
}