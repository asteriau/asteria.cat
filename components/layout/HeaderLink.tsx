"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { registerCard, unregisterCard } from "@/components/ui/glassStore";

export default function HeaderLink(props: {
  href: string;
  label: string | React.ReactNode;
  alsoMatch?: string[];
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLAnchorElement>(null);

  const match = () => {
    if (props.href === "/") return props.href === pathname;
    if (props.alsoMatch?.some((m) => pathname.startsWith(m))) return true;
    return pathname.startsWith(props.href) || props.href === pathname;
  };

  const isActive = match();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerCard(el);
    const ro = new ResizeObserver(() => { unregisterCard(el); registerCard(el); });
    ro.observe(el);
    return () => { ro.disconnect(); unregisterCard(el); };
  }, []);

  return (
    <Link
      ref={ref}
      href={props.href}
      className={clsx(
        "liquid-glass relative overflow-hidden rounded-full py-1 px-3 md:px-4",
        "transition-all duration-300 text-sm font-medium",
        isActive
          ? "glass-active bg-paradise-300/[0.10] text-paradise-100"
          : "bg-white/[0.05] text-neutral-300 hover:bg-white/[0.09] hover:text-white",
      )}
    >
      <span className="relative z-10">{props.label}</span>
    </Link>
  );
}
