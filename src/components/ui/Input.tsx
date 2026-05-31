"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[0.48rem] tracking-[0.28em] uppercase text-obsidian-400 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-obsidian-900/50 border text-obsidian-100 font-body font-light",
            "placeholder:text-obsidian-600 placeholder:text-sm",
            "px-4 py-3 rounded-lg outline-none transition-all duration-200",
            "focus:ring-1 focus:ring-gold-700/50 text-sm",
            error
              ? "border-red-800/60 focus:border-red-700"
              : "border-obsidian-800 focus:border-gold-800",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-[0.5rem] tracking-widest uppercase text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-[0.5rem] tracking-widest uppercase text-obsidian-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
