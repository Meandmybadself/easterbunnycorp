import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "font-bold tracking-[0.12em] border transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-ink text-cream border-ink hover:bg-ink/80",
    secondary: "bg-cream text-ink border-ink hover:bg-cream-dark",
    danger: "bg-alert text-cream border-alert hover:bg-alert/80",
    ghost: "bg-transparent text-ink border-border hover:border-ink hover:bg-cream-dark",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-2.5 text-[11px]",
    lg: "px-7 py-3.5 text-[12px]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
