import clsx from "clsx";
import React from "react";

const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={clsx(
        className,
        "flex flex-col rounded-xl shadow-lg overflow-hidden border",
        "dark:border-neutral-700/75 border-neutral-200/25 bg-neutral-200/50 dark:bg-neutral-900/55 p-4 transition-[box-shadow] duration-300 hover:shadow-2xl backdrop-blur-lg backdrop-saturate-150",
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
