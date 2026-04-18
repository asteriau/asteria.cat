import clsx from "clsx";
import { HTMLAttributes } from "react";
import RefractiveLensNav from "./RefractiveLensNav";
import { IconButton } from "@/components/ui/IconButton";
import { LuCommand } from "react-icons/lu";

export default function Header(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "md:col-span-8 transition-all duration-500",
        props.className,
      )}
      {...props}
    >
      <div className="flex flex-row justify-between items-center">
        <RefractiveLensNav />
        <div className="flex gap-2">
          <IconButton
            Icon={LuCommand}
            className="hidden text-gray-500 bg-neutral-700"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
