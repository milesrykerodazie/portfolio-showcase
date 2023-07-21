import Image from "next/image";
import { MouseEventHandler } from "react";
import type { IconType } from "react-icons";

type Props = {
  title: string;
  IconLeft?: IconType | null;
  IconRight?: IconType | null;
  handleClick?: MouseEventHandler;
  submitting?: boolean | false;
  type?: "button" | "submit";
  bgColor?: string;
  textColor?: string;
};

const Button = ({
  title,
  IconLeft,
  IconRight,
  handleClick,
  submitting,
  type,
  bgColor,
  textColor,
}: Props) => (
  <button
    type={type || "button"}
    disabled={submitting || false}
    className={`flexCenter gap-3 p-2 lg:px-4 lg:py-3 text-xs lg:text-sm 
        ${textColor ? textColor : "text-white"} 
        ${
          submitting ? "bg-black/50" : bgColor ? bgColor : "bg-primary"
        } rounded-xl text-sm font-medium max-md:w-full`}
    onClick={handleClick}
  >
    {IconLeft && <IconLeft />}
    {title}
    {IconRight && <IconRight />}
  </button>
);

export default Button;
