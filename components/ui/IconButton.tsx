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
        "flex items-center justify-center w-10 h-10 p-3 rounded-full transition-colors duration-150 bg-gray-200/50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-300/50 dark:hover:bg-gray-700/50 backdrop-blur-lg backdrop-saturate-150",
        "disabled:cursor-default disabled:bg-gray-200/50 disabled:dark:bg-gray-800/50",
      )}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={props.ariaLabel}
    >
      <props.Icon />
    </button>
  );
};
