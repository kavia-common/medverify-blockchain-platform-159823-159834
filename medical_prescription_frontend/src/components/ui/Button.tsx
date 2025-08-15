"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent" | "ghost";
};

// PUBLIC_INTERFACE
export function Button({ className = "", variant = "primary", ...props }: Props) {
  /** Reusable button component with variants. */
  const variantClass =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
      ? "btn-secondary"
      : variant === "accent"
      ? "btn-accent"
      : "bg-transparent text-[var(--color-primary)] hover:bg-gray-50";
  return <button className={`btn ${variantClass} ${className}`} {...props} />;
}
