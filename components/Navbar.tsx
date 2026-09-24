"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";

const links = [
  { href: "/", label: "Browse" },
  { href: "/dashboard", label: "Creator dashboard" },
  { href: "/my-bookings", label: "My bookings" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-gray-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200">
            <Zap size={18} fill="currentColor" />
          </span>
          SkillSwap
        </Link>

        <div className="flex flex-wrap items-center gap-1 text-sm font-medium">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 transition ${
                  active ? "bg-violet-50 text-violet-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/gigs/new"
            className="ml-2 rounded-full bg-violet-600 px-5 py-2 font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
          >
            Post a gig
          </Link>
        </div>
      </div>
    </nav>
  );
}