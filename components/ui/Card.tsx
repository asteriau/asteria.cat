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
        "flex flex-col rounded-2xl overflow-clip",
        "bg-white/[0.07] p-4",
        "shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.22),0_16px_48px_rgba(0,0,0,0.18)]",
        "transition-shadow duration-300",
        "hover:shadow-[0_2px_4px_rgba(0,0,0,0.14),0_8px_24px_rgba(0,0,0,0.28),0_24px_60px_rgba(0,0,0,0.22)]",
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
