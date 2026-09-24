"use client";

import React, { useEffect, useRef, useState } from "react";

interface SmoothScrollSidebarProps {
  children: React.ReactNode;
  className?: string;
  topOffset?: number; // Distance in pixels from top of viewport (e.g. 96px for navbar)
}

export default function SmoothScrollSidebar({
  children,
  className = "",
  topOffset = 96,
}: SmoothScrollSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      if (!containerRef.current) {
        ticking = false;
        return;
      }

      // Only enable smooth floating offset on desktop screens (>= 1024px)
      if (window.innerWidth < 1024) {
        setOffsetY(0);
        ticking = false;
        return;
      }

      const container = containerRef.current;
      const parent = container.parentElement;
      if (!parent) {
        ticking = false;
        return;
      }

      const parentRect = parent.getBoundingClientRect();
      const parentTop = parentRect.top + window.scrollY;
      const parentHeight = parent.offsetHeight;
      const sidebarHeight = container.offsetHeight;

      const currentScrollY = window.scrollY;
      const targetY = currentScrollY + topOffset - parentTop;
      const maxAllowedY = Math.max(0, parentHeight - sidebarHeight - 32);

      const clampedY = Math.max(0, Math.min(maxAllowedY, targetY));

      setOffsetY(Math.round(clampedY));
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // Initial check
    updatePosition();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [topOffset]);

  return (
    <div
      ref={containerRef}
      className={`will-change-transform ${className}`}
      style={{
        transform: `translate3d(0, ${offsetY}px, 0)`,
        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}
