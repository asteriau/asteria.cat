import clsx from "clsx";
import { IconType } from "react-icons/lib";
interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  Icon: IconType;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export const IconButton = (props: IconButtonProps) => {
  return (
    <button
      className={clsx(
        props.className,
        "liquid-glass",
        "flex items-center justify-center w-10 h-10 p-3 rounded-full",
        "border border-white/[0.10] bg-white/[0.04]",
        "backdrop-blur-xl backdrop-saturate-[180%]",
        "transition-all duration-150 cursor-pointer",
        "hover:bg-white/[0.08] hover:border-white/[0.15]",
        "disabled:cursor-default disabled:opacity-40",
      )}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={props.ariaLabel}
    >
      <props.Icon />
    </button>
  );
};
