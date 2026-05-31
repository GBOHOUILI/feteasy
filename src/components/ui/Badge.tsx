import { cn } from "@/lib/utils";
import type { GuestStatus } from "@/types";

const statusConfig: Record<GuestStatus, { label: string; classes: string }> = {
  pending:    { label: "En attente",  classes: "border-obsidian-700 text-obsidian-400 bg-obsidian-900/40" },
  confirmed:  { label: "Confirmé",    classes: "border-emerald-800/60 text-emerald-400 bg-emerald-950/30" },
  declined:   { label: "Décliné",     classes: "border-red-900/60 text-red-400 bg-red-950/30" },
  checked_in: { label: "✓ Présent",   classes: "border-gold-700/60 text-gold-400 bg-gold-950/30" },
};

export function StatusBadge({ status }: { status: GuestStatus }) {
  const { label, classes } = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-block text-[0.46rem] tracking-[0.22em] uppercase px-2.5 py-1",
        "border rounded font-body font-light whitespace-nowrap",
        classes
      )}
    >
      {label}
    </span>
  );
}

export function RoleBadge({ role }: { role: "organizer" | "super_admin" }) {
  return (
    <span
      className={cn(
        "inline-block text-[0.46rem] tracking-[0.22em] uppercase px-2.5 py-1 border rounded font-body font-light",
        role === "super_admin"
          ? "border-gold-700/60 text-gold-400 bg-gold-950/20"
          : "border-obsidian-700 text-obsidian-400"
      )}
    >
      {role === "super_admin" ? "Super Admin" : "Organisateur"}
    </span>
  );
}
