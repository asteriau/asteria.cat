"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { Children, cloneElement, isValidElement } from "react";

const REVEAL_CLASS = "prose-reveal-item";
const REVEALED_CLASS = "prose-reveal-item--revealed";

interface ScrollRevealProps {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Wraps a single child (the prose container). Observes each direct child of
 * that container and adds a "revealed" class when they enter the viewport,
 * enabling staggered blur/slide-in animation via CSS.
 */
export default function ScrollReveal({
  children,
  rootMargin = "0px 0px -40px 0px",
  threshold = 0,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const directChildren = Array.from(container.children) as HTMLElement[];
    directChildren.forEach((el) => el.classList.add(REVEAL_CLASS));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(REVEALED_CLASS);
          }
        });
      },
      { rootMargin, threshold }
    );

    directChildren.forEach((el) => observer.observe(el));

    return () => {
      directChildren.forEach((el) => {
        observer.unobserve(el);
        el.classList.remove(REVEAL_CLASS, REVEALED_CLASS);
      });
    };
  }, [rootMargin, threshold]);

  const child = Children.only(children);
  if (!isValidElement(child)) return <>{children}</>;

  return cloneElement(child as React.ReactElement<{ ref?: (node: HTMLElement | null) => void }>, {
    ref: setRef,
  });
}
