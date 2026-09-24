"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, X, MessageSquare, Compass, Play, Pause, Bot, ArrowRight } from "lucide-react";

export default function FloatingRobot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPatrolling, setIsPatrolling] = useState(false);
  const [posX, setPosX] = useState(0); // offset from base position
  const [direction, setDirection] = useState(1);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [speechText, setSpeechText] = useState("Hi! I'm SwapBot 🤖 Need help finding a creator?");
  const [isWaving, setIsWaving] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const robotRef = useRef<HTMLDivElement>(null);

  // Mouse eye tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!robotRef.current) return;
      const rect = robotRef.current.getBoundingClientRect();
      const robotCenterX = rect.left + rect.width / 2;
      const robotCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - robotCenterX;
      const deltaY = e.clientY - robotCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(4, Math.hypot(deltaX, deltaY) / 50);

      setEyeOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Patrol / Wander animation across screen
  useEffect(() => {
    if (!isPatrolling) {
      setPosX(0);
      return;
    }

    const interval = setInterval(() => {
      setPosX((prev) => {
        const screenLimit = Math.min(window.innerWidth - 180, 500);
        let next = prev + direction * 2.5;

        if (next > 0) {
          setDirection(-1);
          next = 0;
        } else if (next < -screenLimit) {
          setDirection(1);
          next = -screenLimit;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPatrolling, direction]);

  const triggerWave = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1200);
  };

  const tips = [
    "Tip: New creators get boosted on Browse by our DP3 algorithm! ⭐",
    "Did you know? In SkillSwap, 100% of the gig rate goes directly to the creator! 💸",
    "You can test the queue system right now by booking any gig! 🚀",
    "Check out Sam's bookings to see Pending, Accepted, & Declined states! 📋",
  ];

  const cycleTip = () => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setSpeechText(randomTip);
    triggerWave();
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-violet-200 bg-white/95 px-4 py-2 text-xs font-bold text-violet-700 shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:bg-violet-50"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        <Bot size={16} />
        <span>Wake SwapBot 🤖</span>
      </button>
    );
  }

  return (
    <div
      ref={robotRef}
      style={{
        transform: `translateX(${posX}px)`,
        transition: isPatrolling ? "none" : "transform 0.5s ease-out",
      }}
      className="fixed bottom-5 right-6 z-50 select-none"
    >
      {/* Speech / Assistant Dialogue Bubble */}
      {isOpen && (
        <div className="absolute bottom-28 right-0 w-72 sm:w-80 rounded-3xl border border-violet-100 bg-white/95 p-4 shadow-2xl backdrop-blur-xl animate-fade-in text-xs text-gray-700 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5 font-bold text-violet-900">
              <Bot size={15} className="text-violet-600" />
              <span>SwapBot AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>

          <p className="leading-relaxed text-gray-700 bg-violet-50/70 p-3 rounded-2xl border border-violet-100/60 font-medium">
            {speechText}
          </p>

          {/* Quick Action Buttons */}
          <div className="space-y-1.5 pt-1">
            <button
              onClick={cycleTip}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-semibold text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={13} className="text-amber-500" />
                <span>Tell me a feature tip</span>
              </span>
              <ArrowRight size={13} />
            </button>

            <Link
              href="/#browse"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-semibold text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition"
            >
              <span className="flex items-center gap-2">
                <Compass size={13} className="text-violet-500" />
                <span>Explore Trending Gigs</span>
              </span>
              <ArrowRight size={13} />
            </Link>

            <Link
              href="/my-bookings?email=sam%40example.com"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-semibold text-amber-800 bg-amber-50/60 hover:bg-amber-100/70 transition"
            >
              <span className="flex items-center gap-2">
                <span>👤 Test Client Sam (Demo)</span>
              </span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Patrol / Walk toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
            <button
              onClick={() => setIsPatrolling(!isPatrolling)}
              className="flex items-center gap-1.5 font-bold text-violet-600 hover:underline"
            >
              {isPatrolling ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPatrolling ? "Stop Patrol" : "Patrol Screen"}</span>
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              Minimize
            </button>
          </div>
        </div>
      )}

      {/* Floating Robot Body & Animations */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          triggerWave();
        }}
        className="group relative cursor-pointer"
        title="Click to interact with SwapBot!"
      >
        {/* Glow halo underneath robot */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-cyan-500/20 blur-lg transition-all group-hover:blur-xl" />

        {/* Hovering Robot Avatar SVG */}
        <div
          className={`relative flex flex-col items-center transition-transform duration-300 hover:scale-110 ${
            isPatrolling ? "animate-bounce" : "float"
          }`}
        >
          {/* Antenna */}
          <div className="flex flex-col items-center">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-md shadow-amber-300 animate-pulse" />
            <span className="h-2.5 w-0.5 bg-gray-400" />
          </div>

          {/* Head & Visor */}
          <div className="relative flex h-14 w-16 items-center justify-center rounded-2xl border-2 border-white/90 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 shadow-xl shadow-violet-500/30">
            {/* Screen Visor */}
            <div className="relative flex h-8 w-11 items-center justify-center rounded-xl bg-gray-950 p-1 shadow-inner border border-violet-400/40">
              {/* Eyes with Parallax cursor tracking */}
              <div
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                }}
                className="flex items-center gap-2 transition-transform duration-75"
              >
                {/* Left eye */}
                <span className="h-3 w-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300 animate-pulse" />
                {/* Right eye */}
                <span className="h-3 w-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300 animate-pulse" />
              </div>

              {/* Visor Glare */}
              <div className="pointer-events-none absolute left-1 top-1 h-2 w-3 rounded-full bg-white/20" />
            </div>

            {/* Left Arm / Wave Arm */}
            <div
              style={{
                transform: isWaving
                  ? "rotate(-40deg) translateY(-4px)"
                  : direction < 0
                  ? "rotate(-20deg)"
                  : "rotate(0deg)",
                transformOrigin: "top right",
              }}
              className="absolute -left-2 top-4 h-6 w-2 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600 shadow-xs transition-transform duration-200"
            />

            {/* Right Arm */}
            <div
              style={{
                transform: isWaving
                  ? "rotate(45deg) translateY(-6px)"
                  : direction > 0
                  ? "rotate(20deg)"
                  : "rotate(0deg)",
                transformOrigin: "top left",
              }}
              className="absolute -right-2 top-4 h-6 w-2 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600 shadow-xs transition-transform duration-200"
            />
          </div>

          {/* Jetpack Propulsion Thruster Exhaust */}
          <div className="mt-0.5 flex flex-col items-center">
            <span className="h-2 w-5 rounded-full bg-indigo-900/60" />
            <span className="h-3 w-2.5 rounded-b-full bg-gradient-to-b from-cyan-400 via-amber-400 to-transparent blur-[1px] animate-pulse" />
          </div>
        </div>

        {/* Status Bubble Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white shadow-md animate-bounce">
            <Sparkles size={11} fill="currentColor" />
          </span>
        )}
      </div>
    </div>
  );
}
