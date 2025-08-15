"use client";

import React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
};

// PUBLIC_INTERFACE
export function Select({ label, hint, className = "", children, ...props }: Props) {
  /** Select input with label and optional hint. */
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <select className={`input ${className}`} {...props}>
        {children}
      </select>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
