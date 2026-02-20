import clsx from "clsx";
import React from "react";

const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={clsx(
        className,
        "flex flex-col rounded-xl shadow-lg overflow-hidden border",
        "border-[#424242]/50 bg-[#1E1E1E]/55 p-4 transition-[box-shadow] duration-300 hover:shadow-2xl backdrop-blur-lg backdrop-saturate-150",
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
