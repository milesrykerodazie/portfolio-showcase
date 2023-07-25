"use client";

import { useState } from "react";

type Props = {
  type?: string;
  title: string;
  state: string;
  placeholder: string;
  isTextArea?: boolean;
  require?: boolean;
  bio?: boolean;
  count?: number;
  setState: (value: string) => void;
};

const FormField = ({
  type,
  title,
  state,
  placeholder,
  isTextArea,
  setState,
  require,
  bio,
  count,
}: Props) => {
  //text area count

  const maxText = bio ? 750 : 1050;
  return (
    <div className="flexStart flex-col w-full gap-4">
      <label className="w-full text-primary text-sm lg:text-base">
        {title}
      </label>

      {isTextArea ? (
        <div className="w-full">
          <textarea
            placeholder={placeholder}
            value={state}
            className={`form_field-input ${
              bio
                ? count! >= 700 && count! <= 729
                  ? "border border-yellow-500 transition duration-500 ease-in"
                  : count! >= 730 && count! <= 749
                  ? "border border-red-600 transition duration-500 ease-in"
                  : ""
                : count! >= 1000 && count! <= 1029
                ? "border border-yellow-500 transition duration-500 ease-in"
                : count! >= 1030 && count! <= 1049
                ? "border border-red-600 transition duration-500 ease-in"
                : ""
            }`}
            minLength={5}
            maxLength={maxText}
            onChange={(e) => setState(e.target.value)}
          />
          <div className="flex justify-end items-center text-xs text-primary">
            {" "}
            {count}/{maxText}
          </div>
        </div>
      ) : (
        <input
          type={type || "text"}
          placeholder={placeholder}
          required={require}
          value={state}
          className="form_field-input"
          onChange={(e) => setState(e.target.value)}
        />
      )}
    </div>
  );
};

export default FormField;
