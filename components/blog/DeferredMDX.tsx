"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { getMDXComponent } from "next-contentlayer2/hooks";
import { mdxComponents } from "@/components/blog/Mdx";
import ScrollReveal from "@/components/common/ScrollReveal";

const SKELETON_LINES = 8;

function MDXSkeleton() {
  return (
    <div className="prose prose-invert animate-pulse space-y-3">
      {Array.from({ length: SKELETON_LINES }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-neutral-700/50"
          style={{ width: i === SKELETON_LINES - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

interface DeferredMDXProps {
  code: string;
  fallback?: ReactNode;
}

/**
 * Defers evaluation of compiled MDX code (getMDXComponent) until after paint,
 * so the post shell and fallback show immediately. The evaluation runs in
 * requestIdleCallback to avoid blocking the main thread.
 */
export default function DeferredMDX({
  code,
  fallback = <MDXSkeleton />,
}: DeferredMDXProps) {
  const [MDXContent, setMDXContent] = useState<React.ComponentType<object> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const run = () => {
      if (!mounted.current) return;
      try {
        const Component = getMDXComponent(code);
        if (mounted.current) setMDXContent(() => Component);
      } catch (_) {
        if (mounted.current) setMDXContent(() => () => null);
      }
    };
    const id =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(run, { timeout: 100 })
        : setTimeout(run, 0);
    return () => {
      mounted.current = false;
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(id as number);
      } else {
        clearTimeout(id as number);
      }
    };
  }, [code]);

  if (MDXContent === null) {
    return <>{fallback}</>;
  }

  return (
    <ScrollReveal rootMargin="0px 0px -60px 0px" threshold={0}>
      <div className="prose prose-invert">
        <MDXContent {...({ components: mdxComponents } as object)} />
      </div>
    </ScrollReveal>
  );
}
