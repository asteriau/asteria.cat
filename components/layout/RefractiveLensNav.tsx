"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { registerCard, unregisterCard } from "@/components/ui/glassStore";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog", alsoMatch: ["/posts"] },
  { href: "/projects", label: "Projects", mobileLabel: "🏗" },
  { href: "/uses", label: "/uses", mobileLabel: "💻" },
];

export default function RefractiveLensNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [lensReady, setLensReady] = useState(false);

  function isLinkActive(link: (typeof NAV_LINKS)[0]) {
    if (link.href === "/") return link.href === pathname;
    if ((link as any).alsoMatch?.some((m: string) => pathname.startsWith(m))) return true;
    return pathname.startsWith(link.href);
  }

  const positionLens = useCallback(() => {
    const nav = navRef.current;
    const lens = lensRef.current;
    if (!nav || !lens) return;
    const activeIdx = NAV_LINKS.findIndex((l) => {
      if (l.href === "/") return l.href === pathname;
      if ((l as any).alsoMatch?.some((m: string) => pathname.startsWith(m))) return true;
      return pathname.startsWith(l.href);
    });
    const activeLink = linkRefs.current[activeIdx >= 0 ? activeIdx : 0];
    if (!activeLink) return;
    const navRect = nav.getBoundingClientRect();
    const aRect = activeLink.getBoundingClientRect();
    lens.style.width = aRect.width + "px";
    lens.style.transform = `translateX(${aRect.left - navRect.left}px)`;
    setLensReady(true);
  }, [pathname]);

  useEffect(() => {
    requestAnimationFrame(positionLens);
  }, [positionLens]);

  useEffect(() => {
    window.addEventListener("resize", positionLens);
    return () => window.removeEventListener("resize", positionLens);
  }, [positionLens]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    registerCard(el);
    const ro = new ResizeObserver(() => { unregisterCard(el); registerCard(el); });
    ro.observe(el);
    return () => { ro.disconnect(); unregisterCard(el); };
  }, []);

  return (
    <nav ref={navRef} className="refract-lens-nav liquid-glass">
      <span
        ref={lensRef}
        className="refract-lens"
        style={{ opacity: lensReady ? 1 : 0 }}
        aria-hidden
      />
      {NAV_LINKS.map((link, i) => (
        <Link
          key={link.href}
          href={link.href}
          ref={(el) => { linkRefs.current[i] = el; }}
          className={`refract-lens-link${isLinkActive(link) ? " active" : ""}`}
        >
          {(link as any).mobileLabel ? (
            <>
              <span className="hidden md:inline">{link.label}</span>
              <span className="md:hidden">{(link as any).mobileLabel}</span>
            </>
          ) : (
            link.label
          )}
        </Link>
      ))}
    </nav>
  );
}
