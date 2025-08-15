"use client";

import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

// PUBLIC_INTERFACE
export function Input({ label, hint, className = "", ...props }: Props) {
  /** Text input with label and optional hint. */
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input className={`input ${className}`} {...props} />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
