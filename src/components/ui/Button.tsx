"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, children, className, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-body font-light tracking-widest uppercase transition-all duration-300 select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50";

    const variants = {
      primary:
        "bg-gold-700 hover:bg-gold-600 text-obsidian-950 border border-gold-600 hover:border-gold-400",
      ghost: "text-gold-400 hover:text-gold-300 bg-transparent border border-transparent hover:border-gold-900",
      outline:
        "bg-transparent border border-obsidian-700 text-obsidian-300 hover:border-gold-700 hover:text-gold-400",
      danger:
        "bg-transparent border border-red-900/50 text-red-400 hover:bg-red-950/30 hover:border-red-700",
    };

    const sizes = {
      sm: "text-[0.5rem] px-4 py-2 rounded-md",
      md: "text-[0.55rem] px-6 py-3 rounded-lg",
      lg: "text-[0.6rem] px-8 py-4 rounded-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
