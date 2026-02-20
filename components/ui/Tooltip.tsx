import { ReactNode } from "react";

type TooltipProps = {
  tip: string;
  children: ReactNode;
};

export default function Tooltip({ tip, children }: TooltipProps) {
  if (!tip) return <>{children}</>;

  return (
    <span className="relative inline-flex group">
      <span
        className="
          pointer-events-none absolute left-1/2 bottom-full z-50
          -translate-x-1/2 -translate-y-2.5
          whitespace-nowrap rounded-lg
          bg-paradise-800
          px-2.5 py-1
          text-xs font-medium
          text-paradise-fg
          opacity-0 group-hover:opacity-100
          scale-95 group-hover:scale-100
          transition-all duration-150 ease-out
          border border-paradise-700/30
          shadow
          tracking-tight
        "
      >
        {tip}

        <span
          className="
            absolute left-1/2 top-full
            -translate-x-1/2 -mt-px
            border-x-[5px] border-x-transparent
            border-t-[5px] border-t-paradise-800
          "
        />
      </span>

      {children}
    </span>
  );
}
