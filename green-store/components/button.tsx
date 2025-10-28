"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Button({ variant = "primary", size = "md", className = "", children, ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
  const variants: Record<string, string> = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-300",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-50",
  };
  const sizes: Record<string, string> = {
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
