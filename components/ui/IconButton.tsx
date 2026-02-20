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
    // tailwindcss button
    <button
      className={clsx(
        props.className,
        "flex items-center justify-center w-10 h-10 p-3 rounded-full transition-colors duration-150 bg-[#424242]/50 cursor-pointer hover:bg-[#555555]/50 backdrop-blur-lg backdrop-saturate-150",
        "disabled:cursor-default disabled:bg-[#424242]/30",
      )}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={props.ariaLabel}
    >
      <props.Icon />
    </button>
  );
};
