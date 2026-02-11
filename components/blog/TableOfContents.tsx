"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
  hasComments?: boolean;
}

type TOCThumb = [top: number, height: number];

function calc(container: HTMLElement, active: string[]): TOCThumb {
  if (active.length === 0 || container.clientHeight === 0) {
    return [0, 0];
  }

  let upper = Number.MAX_VALUE;
  let lower = 0;

  const allTocItems = Array.from(container.querySelectorAll('a[href^="#"]'));

  for (const item of active) {
    const element = container.querySelector<HTMLElement>(`a[href="#${item}"]`);
    if (!element) continue;

    const itemIndex = allTocItems.indexOf(element);
    if (itemIndex === -1) continue;

    let cumulativeTop = 0;
    for (let i = 0; i < itemIndex; i++) {
      const prevElement = allTocItems[i] as HTMLElement;
      cumulativeTop += prevElement.clientHeight;
    }

    const styles = getComputedStyle(element);
    const paddingTop = parseFloat(styles.paddingTop || "0");
    const paddingBottom = parseFloat(styles.paddingBottom || "0");
    const elementTop = cumulativeTop + paddingTop;
    const elementBottom = cumulativeTop + element.clientHeight - paddingBottom;

    upper = Math.min(upper, elementTop);
    lower = Math.max(lower, elementBottom);
  }
  return [upper, lower - upper];
}

function update(element: HTMLElement, info: TOCThumb): void {
  element.style.setProperty("--fd-top", `${info[0]}px`);
  element.style.setProperty("--fd-height", `${info[1]}px`);
  element.style.top = `${info[0]}px`;
  element.style.height = `${info[1]}px`;
}

function TocThumb({
  containerRef,
  activeItems,
  className = "",
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  activeItems: string[];
  className?: string;
}) {
  const thumbRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !thumbRef.current) return;
    const container = containerRef.current;
    const thumbEl = thumbRef.current;

    const recompute = () => {
      if (!container || !thumbEl) return;
      const result = calc(container, activeItems);
      update(thumbEl, result);
    };

    recompute();

    const ro = new ResizeObserver(recompute);
    try {
      ro.observe(container);
    } catch {}
    const anchors = Array.from(container.querySelectorAll<HTMLElement>('a[href^="#"]'));
    anchors.forEach((a) => {
      try {
        ro.observe(a);
      } catch {}
    });

    window.addEventListener("resize", recompute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [containerRef, activeItems]);

  if (!containerRef.current) return null;

  return (
    <div
      ref={thumbRef}
      className={`absolute -left-1 w-4 bg-wisteria-600 transition-all duration-200 dark:bg-wisteria-400 ${className}`}
      style={{
        top: "var(--fd-top, 0px)",
        height: "var(--fd-height, 0px)",
        minHeight: activeItems.length > 0 ? "2px" : "0px",
      }}
    />
  );
}

function getItemOffset(depth: number): number {
  if (depth <= 2) return 14;
  if (depth === 3) return 26;
  return 36;
}

function getLineOffset(depth: number): number {
  return depth >= 3 ? 10 : 0;
}

function TOCItem({
  item,
  isActive = false,
  onClick,
}: {
  item: TocItem;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative">
      <a
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`relative block py-1.5 text-sm transition-colors hover:text-neutral-900 dark:hover:text-neutral-100 ${
          isActive
            ? "text-wisteria-800 dark:text-wisteria-300"
            : "text-neutral-600 dark:text-neutral-400"
        }`}
        style={{
          paddingLeft: `${getItemOffset(item.level)}px`,
        }}
      >
        {item.text}
      </a>
    </div>
  );
}

export default function TableOfContents({
  className = "",
  hasComments = false,
}: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeItems, setActiveItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [svg, setSvg] = useState<{ path: string; width: number; height: number }>();

  // Keep latest toc in ref for listeners
  const tocRef = useRef<TocItem[]>([]);
  useEffect(() => {
    tocRef.current = toc;
  }, [toc]);

  // Collect headings and observe mutations
  useEffect(() => {
    const collectHeadings = () => {
      const headings = document.querySelectorAll(
        "article h1, article h2, article h3, article h4, article h5, article h6",
      );
      const tocItems: TocItem[] = [];

      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        let id = heading.id;

        if (!id) {
          id =
            heading.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `heading-${index}`;
          heading.id = id;
        }

        tocItems.push({
          id,
          text: heading.textContent || "",
          level,
        });
      });

      if (hasComments) {
        tocItems.push({
          id: "comments",
          text: "Comments",
          level: 2,
        });
      }

      setToc(tocItems);
      // schedule active calculation after headings mount
      requestAnimationFrame(() => {
        calculateActiveItems();
      });
    };

    const article = document.querySelector<HTMLElement>("article");
    const target = article ?? document.body;

    const mo = new MutationObserver(() => {
      requestAnimationFrame(collectHeadings);
    });

    collectHeadings();
    mo.observe(target, { childList: true, subtree: true });
    window.addEventListener("load", collectHeadings);

    return () => {
      mo.disconnect();
      window.removeEventListener("load", collectHeadings);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasComments]);

  // IntersectionObserver to update active items during manual scrolling and with transforms
useEffect(() => {
  if (toc.length === 0) return;

  // find scrollable ancestor of the article (if any), otherwise null (viewport)
  const article = document.querySelector<HTMLElement>("article");
  let root: Element | null = null;
  if (article) {
    let el: HTMLElement | null = article.parentElement;
    while (el && el !== document.documentElement) {
      const style = getComputedStyle(el);
      if (/(auto|scroll)/.test(style.overflowY || "")) {
        root = el;
        break;
      }
      el = el.parentElement;
    }
  }

  const visibleMap = new Map<string, number>();

  const isAtScrollEnd = () => {
    // if we found a scrollable ancestor, use it; otherwise use the window/document
    if (root && root instanceof Element) {
      return root.scrollHeight - (root.scrollTop + (root as HTMLElement).clientHeight) <= 2;
    } else {
      // documentElement rather than body for robustness
      return (
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) <= 2
      );
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id;
        if (!id) continue;
        visibleMap.set(id, entry.intersectionRatio);
      }

      // compute which headings are visible, sorted by element top
      const visibles = Array.from(visibleMap.entries())
        .filter(([, ratio]) => ratio > 0)
        .map(([id, ratio]) => {
          const el = document.getElementById(id);
          const top = el ? el.getBoundingClientRect().top : Infinity;
          return { id, ratio, top };
        })
        .sort((a, b) => a.top - b.top);

      // If we're scrolled to the end, make the last heading active explicitly.
      if (isAtScrollEnd() && toc.length > 0) {
        const lastId = toc[toc.length - 1].id;
        // only set if not already active
        setActiveItems((prev) => (prev.length === 1 && prev[0] === lastId ? prev : [lastId]));
        return;
      }

      if (visibles.length === 0) {
        // fallback to existing calculation if none visible
        requestAnimationFrame(calculateActiveItems);
        return;
      }

      // For large screens, include all visible headings in order; for small screens pick the top-most visible
      const newActive = isLargeScreen ? visibles.map((v) => v.id) : [visibles[0].id];
      setActiveItems(newActive);
    },
    {
      root: root ?? null,
      // slightly more permissive so headings are considered visible before they hit the very top
      rootMargin: "0px 0px -20% 0px",
      threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
    },
  );

  // observe each heading element
  const elements = toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
  elements.forEach((el) => io.observe(el));

  // run an initial "at bottom" check in case page loaded scrolled to bottom
  if (isAtScrollEnd() && toc.length > 0) {
    setActiveItems([toc[toc.length - 1].id]);
  }

  return () => {
    io.disconnect();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [toc, isLargeScreen]);


  // screen size watcher
  useEffect(() => {
    const checkScreenSize = () => setIsLargeScreen(window.innerWidth >= 1500);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // sticky small-screen nav
  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // build svg path for the left decorative line
  useEffect(() => {
    if (!containerRef.current || toc.length === 0) return;
    const container = containerRef.current;

    function onResize(): void {
      if (container.clientHeight === 0) return;
      let w = 0;
      let h = 0;
      const d: string[] = [];
      let cumulativeTop = 0;

      for (let i = 0; i < toc.length; i++) {
        const element: HTMLElement | null = container.querySelector(`a[href="#${toc[i].id}"]`);
        if (!element) continue;

        const styles = getComputedStyle(element);
        const offset = getLineOffset(toc[i].level) + 1;
        const top = cumulativeTop + parseFloat(styles.paddingTop || "0");
        const bottom = cumulativeTop + element.clientHeight - parseFloat(styles.paddingBottom || "0");

        w = Math.max(offset, w);
        h = Math.max(h, bottom);

        d.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
        d.push(`L${offset} ${bottom}`);

        cumulativeTop += element.clientHeight;
      }

      setSvg({
        path: d.join(" "),
        width: w + 1,
        height: h,
      });
    }

    const ro = new ResizeObserver(onResize);
    onResize();
    try {
      ro.observe(container);
    } catch {}
    return () => ro.disconnect();
  }, [toc]);

  // calculate active items - fallback / initial calculation
  const calculateActiveItems = () => {
    const currentToc = tocRef.current;
    if (!currentToc || currentToc.length === 0) {
      setActiveItems([]);
      return;
    }

    const windowHeight = window.innerHeight;
    const activeIds: string[] = [];

    if (!isLargeScreen) {
      for (let i = currentToc.length - 1; i >= 0; i--) {
        const element = document.getElementById(currentToc[i].id);
        if (element && element.getBoundingClientRect().top <= 100) {
          activeIds.push(currentToc[i].id);
          break;
        }
      }
    } else {
      for (const item of currentToc) {
        const element = document.getElementById(item.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
          activeIds.push(item.id);
        }
      }
    }

    if (activeIds.length === 0) {
      for (let i = currentToc.length - 1; i >= 0; i--) {
        const element = document.getElementById(currentToc[i].id);
        if (element && element.getBoundingClientRect().top <= windowHeight * 0.5) {
          activeIds.push(currentToc[i].id);
          break;
        }
      }
    }

    if (activeIds.length === 0 && currentToc.length > 0) {
      activeIds.push(currentToc[0].id);
    }

    setActiveItems(activeIds);
  };

  // wire scroll/resize listeners to recalc active (fallback)
  useEffect(() => {
    window.addEventListener("scroll", calculateActiveItems, { passive: true });
    window.addEventListener("resize", calculateActiveItems);
    calculateActiveItems();
    return () => {
      window.removeEventListener("scroll", calculateActiveItems);
      window.removeEventListener("resize", calculateActiveItems);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLargeScreen]);

  // robust scroll-to behavior for anchor clicks
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    try {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    } catch {
      history.replaceState(null, "", `#${id}`);
      element.scrollIntoView({ behavior: "auto", block: "start" });
    }

    const yOffset = -80;

    setTimeout(() => {
      try {
        const rect = element.getBoundingClientRect();
        const desiredY = rect.top + window.pageYOffset + yOffset;
        window.scrollTo({ top: desiredY, behavior: "smooth" });
      } catch {}
      setTimeout(() => {
        calculateActiveItems();
        if (containerRef.current) {
          window.dispatchEvent(new Event("resize"));
        }
      }, 250);
    }, 300);
  };

  if (toc.length === 0) {
    return null;
  }

  if (!isLargeScreen) {
    const currentItem = activeItems.length > 0 ? toc.find((item) => item.id === activeItems[0]) : toc[0];

    return (
      <nav
        className={`fixed top-0 right-0 left-0 z-40 border-b border-neutral-200 bg-pink-100/90 backdrop-blur-sm transition-transform duration-300 dark:border-neutral-700 dark:bg-neutral-900/90 ${
          showSticky ? "translate-y-0" : "-translate-y-full"
        } ${className}`}
      >
        <div className="mx-auto max-w-prose">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex w-full items-center justify-between p-3 text-left hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
            >
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {currentItem?.text || "Table of Contents"}
                </span>
              </div>
              <svg
                className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="fixed top-0 right-0 left-0 max-h-screen overflow-y-auto border-b border-neutral-200 bg-pink-100 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                {toc.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToHeading(item.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                      activeItems.includes(item.id)
                        ? "bg-wisteria-100 text-wisteria-700 dark:bg-wisteria-900/20 dark:text-wisteria-400"
                        : "text-neutral-700 dark:text-neutral-300"
                    }`}
                    style={{ paddingLeft: `${12 + (item.level - 1) * 16}px` }}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`table-of-contents ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">On this page</h4>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded p-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
        >
          <svg className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? "rotate-0" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="relative">
        {svg && (
          <div
            className="absolute top-0 left-0"
            style={{
              width: svg.width,
              height: svg.height,
              maskImage: `url("data:image/svg+xml,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="3" fill="none" /></svg>`,
              )}")`,
            }}
          >
            <div className="h-full bg-neutral-300 dark:bg-neutral-600" />

            <TocThumb containerRef={containerRef} activeItems={activeItems} className="bg-wisteria-500 dark:bg-wisteria-400" />
          </div>
        )}

        <div ref={containerRef} data-toc-container className={`flex flex-col overflow-y-auto transition-all duration-200 ${isCollapsed ? "max-h-0 lg:block lg:max-h-none" : "max-h-96"}`}>
          {toc.map((item) => (
            <TOCItem key={item.id} item={item} isActive={activeItems.includes(item.id)} onClick={() => { scrollToHeading(item.id); setIsCollapsed(true); }} />
          ))}
        </div>
      </div>
    </nav>
  );
}
