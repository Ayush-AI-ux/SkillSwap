"use client";

import { useEffect, useRef, useState } from "react";

type Pose = "walk" | "sit" | "sleep" | "wave";

const INK = "#3b2f0b";

export default function RobotMascot() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [pose, setPose] = useState<Pose>("sit");
  const [flip, setFlip] = useState(false);
  const currentCard = useRef<Element | null>(null);
  const lastX = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let alive = true;
    let timer: ReturnType<typeof setTimeout>;

    // The robot sits on the line where the colored tile meets the card text (tile is 128px tall)
    const place = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.right + window.scrollX - 72, y: r.top + window.scrollY + 128 };
    };

    const cards = () => Array.from(document.querySelectorAll('[data-testid="gig-card"]'));

    const move = () => {
      if (!alive) return;
      const list = cards();
      if (list.length === 0) {
        timer = setTimeout(move, 2000);
        return;
      }
      const options = list.filter((c) => c !== currentCard.current);
      const next = options.length ? options[Math.floor(Math.random() * options.length)] : list[0];
      const p = place(next);

      if (lastX.current !== null) setFlip(p.x < lastX.current);
      lastX.current = p.x;
      currentCard.current = next;

      setPose("walk");
      setPos(p);

      // Arrive, then pick something to do for a while
      timer = setTimeout(() => {
        if (!alive) return;
        const options: Pose[] = ["sit", "sleep", "sleep", "sit", "wave"];
        setPose(options[Math.floor(Math.random() * options.length)]);
        setFlip(false);
        timer = setTimeout(move, 5000 + Math.random() * 4000);
      }, 1800);
    };

    const onResize = () => {
      if (currentCard.current) setPos(place(currentCard.current));
    };

    timer = setTimeout(move, 900);
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!pos) return null;

  const sleeping = pose === "sleep";
  const walking = pose === "walk";
  const legL = walking ? "bot-leg-l" : pose === "sit" || sleeping || pose === "wave" ? "bot-leg-sit-l" : "";
  const legR = walking ? "bot-leg-r" : "bot-leg-sit-r";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 1.7s cubic-bezier(0.45, 0, 0.25, 1)",
      }}
    >
      <div style={{ transform: "translateY(calc(-100% + 8px))" }}>
        <div style={{ transform: flip ? "scaleX(-1)" : "none", transition: "transform 0.2s" }}>
          <div className={walking ? "bot-hop" : ""}>
            <svg width="56" height="66" viewBox="0 0 60 70" fill="none" className="bot-breathe overflow-visible">
              {/* legs */}
              <g className="bot-part">
                <rect x="20" y="56" width="8" height="12" rx="4" fill="#fff" stroke={INK} strokeWidth="2" className={`bot-part ${legL}`} />
                <rect x="32" y="56" width="8" height="12" rx="4" fill="#fff" stroke={INK} strokeWidth="2" className={`bot-part ${legR}`} />
              </g>

              {/* left arm */}
              <rect x="9" y="42" width="8" height="14" rx="4" fill="#fff" stroke={INK} strokeWidth="2" />
              {/* right arm (waves) */}
              <rect
                x="43" y="42" width="8" height="14" rx="4" fill="#fff" stroke={INK} strokeWidth="2"
                className={`bot-part ${pose === "wave" ? "bot-arm-wave" : ""}`}
              />

              {/* body */}
              <rect x="17" y="40" width="26" height="19" rx="8" fill="#f3d36b" stroke={INK} strokeWidth="2" />
              <circle cx="30" cy="49" r="3" fill="#fff" stroke={INK} strokeWidth="1.5" />

              {/* head (tilts when asleep) */}
              <g style={{ transformOrigin: "30px 38px", transform: sleeping ? "rotate(14deg)" : "none", transition: "transform 0.4s" }}>
                <line x1="30" y1="14" x2="30" y2="7" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="5" r="3.2" fill="#f472b6" stroke={INK} strokeWidth="1.5" />
                <rect x="13" y="14" width="34" height="25" rx="10" fill="#fff" stroke={INK} strokeWidth="2" />

                {sleeping ? (
                  <>
                    <path d="M20 27 q3 3 6 0" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M34 27 q3 3 6 0" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <circle cx="23" cy="26" r="3" fill={INK} className="bot-part bot-eye" />
                    <circle cx="37" cy="26" r="3" fill={INK} className="bot-part bot-eye" />
                  </>
                )}
                <circle cx="18" cy="32" r="2.4" fill="#fbcfe8" />
                <circle cx="42" cy="32" r="2.4" fill="#fbcfe8" />
                <path
                  d={sleeping ? "M27 33 q3 1.5 6 0" : "M26 32 q4 4 8 0"}
                  stroke={INK}
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>

              {/* floating Z's while asleep */}
              {sleeping && (
                <g fill={INK} fontFamily="sans-serif" fontWeight="700">
                  <text x="46" y="14" fontSize="10" className="bot-part bot-z">Z</text>
                  <text x="52" y="6" fontSize="7" className="bot-part bot-z" style={{ animationDelay: "0.8s" }}>z</text>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}