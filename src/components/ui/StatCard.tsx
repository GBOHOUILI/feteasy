import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-obsidian-900 border border-obsidian-800 rounded-xl p-5",
        "transition-all duration-300 hover:border-obsidian-700",
        accent && "border-gold-900/50 bg-gold-950/10",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[0.46rem] tracking-[0.3em] uppercase text-obsidian-500 font-body font-light">
          {label}
        </p>
        {Icon && (
          <Icon
            className={cn("w-3.5 h-3.5", accent ? "text-gold-600" : "text-obsidian-700")}
          />
        )}
      </div>
      <p
        className={cn(
          "font-display text-3xl font-light",
          accent ? "text-gold-400" : "text-obsidian-100"
        )}
      >
        {value}
      </p>
    </div>
  );
}
