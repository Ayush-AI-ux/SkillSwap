"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Zap, Menu, X, Sparkles, UserCheck, ShieldCheck, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const links = [
  { href: "/", label: "Browse Gigs" },
  { href: "/dashboard", label: "Creator Dashboard" },
  { href: "/my-bookings", label: "My Bookings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setOpen(false);
    setDemoOpen(false);
  }, [pathname]);

  // Close demo dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (demoRef.current && !demoRef.current.contains(event.target as Node)) {
        setDemoOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav className="slide-down sticky top-0 z-40 border-b border-gray-100/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Logo & Live Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-gray-900"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/skillswap-logo.png"
                alt="SkillSwap Logo"
                width={40}
                height={40}
                priority
                className="h-10 w-10 object-contain drop-shadow-md drop-shadow-violet-500/25"
              />
            </div>
            <span>Skill<span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Swap</span></span>
          </Link>
          
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200/60 lg:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live Marketplace
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-1.5 text-sm font-medium md:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 transition-all duration-200 ${
                  active
                    ? "bg-violet-50 text-violet-700 font-semibold shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Judge / Demo Fast-Track Dropdown */}
          <div className="relative ml-1" ref={demoRef}>
            <button
              onClick={() => setDemoOpen(!demoOpen)}
              className="flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-xs transition hover:border-amber-300 hover:shadow-sm"
              title="Quick demo access for judges"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Judge Quick-Demo</span>
              <ChevronDown size={13} className={`text-amber-600 transition-transform ${demoOpen ? "rotate-180" : ""}`} />
            </button>

            {demoOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl ring-1 ring-black/5 animate-fade-in z-50">
                <div className="mb-2 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Instant Test Personas
                </div>
                <div className="space-y-1">
                  <Link
                    href="/my-bookings?email=sam%40example.com"
                    className="flex items-center gap-2.5 rounded-xl p-2 text-xs transition hover:bg-violet-50"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700 font-bold">S</span>
                    <div>
                      <p className="font-bold text-gray-900">Demo Buyer: Sam</p>
                      <p className="text-[11px] text-gray-500">Has Pending, Accepted, & Declined</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard?creator=Aarav"
                    className="flex items-center gap-2.5 rounded-xl p-2 text-xs transition hover:bg-indigo-50"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold">A</span>
                    <div>
                      <p className="font-bold text-gray-900">Demo Creator: Aarav</p>
                      <p className="text-[11px] text-gray-500">Video Editor Dashboard</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard?creator=Kabir"
                    className="flex items-center gap-2.5 rounded-xl p-2 text-xs transition hover:bg-pink-50"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 text-pink-700 font-bold">K</span>
                    <div>
                      <p className="font-bold text-gray-900">Demo Creator: Kabir</p>
                      <p className="text-[11px] text-gray-500">Logo Designer Dashboard</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/gigs/new"
            className="btn-press ml-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 px-5 py-2 font-semibold text-white shadow-md shadow-violet-200 transition hover:shadow-lg hover:shadow-violet-300"
          >
            Post a Gig
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
          <div className="menu-slide-in fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white p-6 shadow-2xl md:hidden">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold" style={{ fontFamily: "var(--font-outfit)" }}>Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {links.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`rounded-xl px-4 py-3 text-base font-medium transition ${
                      active
                        ? "bg-violet-50 text-violet-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Judge Quick demo section */}
            <div className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Sparkles size={14} className="text-amber-500" /> Fast-Track Judge Demo
              </p>
              <div className="mt-2 space-y-1">
                <Link
                  href="/my-bookings?email=sam%40example.com"
                  className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-white"
                >
                  👤 Buyer Sam (All 3 Statuses)
                </Link>
                <Link
                  href="/dashboard?creator=Aarav"
                  className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-white"
                >
                  🎬 Creator Aarav Dashboard
                </Link>
              </div>
            </div>

            <Link
              href="/gigs/new"
              className="btn-press mt-6 flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-200"
            >
              Post a Gig
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}