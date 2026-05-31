"use client";
import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const sizes = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-2xl" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm" />
      <div
        className={cn(
          "relative w-full bg-obsidian-900 border border-obsidian-800",
          "rounded-2xl shadow-2xl animate-fade-up",
          "max-h-[90vh] flex flex-col",
          sizes[size],
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-800 flex-shrink-0">
            <h3 className="font-body text-sm font-light tracking-widest uppercase text-obsidian-300">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-obsidian-600 hover:text-obsidian-300 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
