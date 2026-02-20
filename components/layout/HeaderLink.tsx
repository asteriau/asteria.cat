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
        "bg-neutral-800/40",
        "border-[#252525]",
        "text-neutral-300",
        "hover:text-white",
        "backdrop-blur-lg",
        isActive && [
          "border-paradise-300/25",
          "text-paradise-100",
        ],
      )}
    >
      <div
        className={clsx(
          "absolute inset-0 rounded-full z-0",
          "bg-gradient-to-br from-[#8DA3B9]/20 via-[#151515]/45 to-[#A988B0]/15",
          "transition-all duration-700 ease-out",
          isActive ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      />

      <div
        className={clsx(
          "absolute inset-0 rounded-full z-0 transition-opacity duration-500",
          "bg-neutral-800/40",
          isActive ? "opacity-0" : "opacity-100",
        )}
      />

      {!isActive && (
        <div className="absolute inset-0 rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-paradise-900/20" />
      )}

      <span className="z-10 relative transition-colors duration-500">
        {props.label}
      </span>
    </Link>
  );
}
