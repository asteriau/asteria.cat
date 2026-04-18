"use client";

import clsx from "clsx";
import { useId, useRef, useLayoutEffect } from "react";
import { registerCard, unregisterCard } from "./glassStore";

const Card = ({ children, className = "", ...props }) => {
  const id  = useId();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerCard(el);

    const ro = new ResizeObserver(() => {
      unregisterCard(el);
      registerCard(el);
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      unregisterCard(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-glass-id={id}
      className={clsx(
        className,
        "liquid-glass",
        "flex flex-col rounded-xl overflow-clip",
        "border border-white/[0.12]",
        "bg-white/[0.04] p-4",
        "backdrop-blur-xl backdrop-saturate-[180%]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.12)]",
        "transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]",
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
