"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderLink(props: {
  href: string;
  label: string | React.ReactNode;
  alsoMatch?: string[];
}) {
  const pathname = usePathname();

  const match = () => {
    if (props.href === "/") {
      return props.href === pathname;
    }
    if (props.alsoMatch) {
      const res = props.alsoMatch.some((alsoMatch) =>
        pathname.startsWith(alsoMatch),
      );
      if (res) return true;
    }
    return pathname.startsWith(props.href) || props.href === pathname;
  };

  const isActive = match();

  return (
    <Link
      href={props.href}
      className={clsx(
        "header-link relative overflow-hidden border py-1 px-3 md:px-4 rounded-full",
        "transition-all duration-300 z-0 group",
        "bg-neutral-200/40 dark:bg-neutral-800/40",
        "border-neutral-300/50 dark:border-neutral-700/40",
        "text-neutral-700 dark:text-neutral-300",
        "hover:text-neutral-900 dark:hover:text-white",
        "backdrop-blur-lg",
        isActive && [
          "border-[#f0abfc]/40 dark:border-wisteria-600/40",
          "text-wisteria-900 dark:text-wisteria-100",
        ],
      )}
    >
      <div
        className={clsx(
          "absolute inset-0 rounded-full z-0",
          "bg-gradient-to-br from-[#f0abfc]/95 via-[#c084fc]/15 to-[#a5b4fc]/35",
          "dark:from-[#4a044e] dark:via-[#020617]/45 dark:to-[#1e1b4b]",
          "transition-all duration-700 ease-out",
          isActive ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      />

      <div
        className={clsx(
          "absolute inset-0 rounded-full z-0 transition-opacity duration-500",
          "bg-neutral-200/40 dark:bg-neutral-800/40",
          isActive ? "opacity-0" : "opacity-100",
        )}
      />

      {!isActive && (
        <div className="absolute inset-0 rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-wisteria-100/60 dark:bg-wisteria-900/20" />
      )}

      <span className="z-10 relative transition-colors duration-500">
        {props.label}
      </span>
    </Link>
  );
}
