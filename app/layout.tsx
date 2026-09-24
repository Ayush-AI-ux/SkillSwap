import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Outfit } from "next/font/google";
import { Zap, Heart, ShieldCheck, Sparkles } from "lucide-react";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "SkillSwap — The Creator Marketplace for Young Talent",
  description: "Monetize skills with transparent queues, zero platform commission, and fair algorithmic discovery. Track 2 Hackathon Finalist.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans min-h-screen antialiased selection:bg-violet-500 selection:text-white`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">{children}</main>

        <footer className="relative mt-20 overflow-hidden border-t border-gray-100 bg-white/90 backdrop-blur-xl">
          {/* Radiant top gradient border */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-violet-600 via-amber-400 to-indigo-600" />

          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-gray-100">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 text-white shadow-md shadow-violet-200">
                    <Zap size={18} fill="currentColor" />
                  </span>
                  <div>
                    <p className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
                      Skill<span className="text-violet-600">Swap</span>
                    </p>
                    <p className="text-xs text-gray-400">The marketplace for young and student creators</p>
                  </div>
                </div>
                <p className="max-w-sm text-xs text-gray-500 leading-relaxed">
                  Built for Track 2 (Real-World AI Products). Hackathon ID: <strong className="text-gray-700 font-semibold">AZIS-4MWXBG</strong>.
                </p>
              </div>

              {/* Navigation Grid */}
              <div className="flex flex-wrap gap-8 text-xs font-semibold text-gray-600">
                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Marketplace</p>
                  <ul className="space-y-2">
                    <li><Link href="/" className="hover:text-violet-600 transition">Browse Gigs</Link></li>
                    <li><Link href="/gigs/new" className="hover:text-violet-600 transition">Post a Gig</Link></li>
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Dashboards</p>
                  <ul className="space-y-2">
                    <li><Link href="/dashboard" className="hover:text-violet-600 transition">Creator Dashboard</Link></li>
                    <li><Link href="/my-bookings" className="hover:text-violet-600 transition">My Bookings</Link></li>
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Decision Points</p>
                  <ul className="space-y-2">
                    <li><span className="text-gray-500">DP1: Rejection Handling</span></li>
                    <li><span className="text-gray-500">DP2: Transparent Queue</span></li>
                    <li><span className="text-gray-500">DP3: Fair Discovery Boost</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span>All Systems Operational · PostgreSQL on Neon</span>
              </div>
              <p className="flex items-center gap-1">
                Crafted with <Heart size={13} className="text-rose-500 fill-rose-500" /> for young creators
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}