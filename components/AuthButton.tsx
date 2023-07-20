"use client";

import React, { FC } from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IconType;
}

const AuthButton: FC<ButtonProps> = ({ label, onClick, icon: Icon }) => {
  return (
    <button
      className="relative disabled:opacity-70 disabled:cursor-not-allowed font-semibold rounded-lg hover:opacity-80 w-full bg-primary trans text-white py-2 text-sm"
      onClick={onClick}
    >
      {Icon && <Icon size={20} className=" absolute left-4 top-3 text-white" />}{" "}
      {label}
    </button>
  );
};

export default AuthButton;
