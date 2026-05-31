"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  LogOut,
  Shield,
  ChevronRight,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/dashboard/events", label: "Événements", icon: Calendar },
  { href: "/dashboard/guests", label: "Invités", icon: Users },
  { href: "/dashboard/scanner", label: "Scanner", icon: QrCode },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
        <div className="w-6 h-6 border border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-obsidian-800 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="font-display text-xl italic text-gold-500"
            onClick={() => setSidebarOpen(false)}
          >
            FêtEasy
          </Link>
          <p className="text-[0.44rem] tracking-[0.28em] uppercase text-obsidian-600 mt-0.5 font-body font-light">
            Organisateur
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-obsidian-600 hover:text-obsidian-300 p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                    active
                      ? "bg-gold-950/40 border border-gold-900/40 text-gold-400"
                      : "text-obsidian-500 hover:text-obsidian-300 hover:bg-obsidian-800/50 border border-transparent",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      active
                        ? "text-gold-500"
                        : "text-obsidian-600 group-hover:text-obsidian-400",
                    )}
                  />
                  <span className="text-[0.52rem] tracking-[0.2em] uppercase font-body font-light">
                    {item.label}
                  </span>
                  {active && (
                    <ChevronRight className="w-3 h-3 ml-auto text-gold-700" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {session?.user.role === "super_admin" && (
          <div className="mt-6 pt-4 border-t border-obsidian-800">
            <p className="text-[0.42rem] tracking-[0.32em] uppercase text-obsidian-700 px-3 mb-2 font-body font-light">
              Administration
            </p>
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                pathname.startsWith("/admin")
                  ? "bg-gold-950/40 border border-gold-900/40 text-gold-400"
                  : "text-obsidian-500 hover:text-obsidian-300 hover:bg-obsidian-800/50 border border-transparent",
              )}
            >
              <Shield className="w-4 h-4 text-obsidian-600" />
              <span className="text-[0.52rem] tracking-[0.2em] uppercase font-body font-light">
                Admin
              </span>
            </Link>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-obsidian-800">
        <Link
          href="/dashboard/profile"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-obsidian-800/30 mb-2 hover:bg-obsidian-800/60 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gold-950/60 border border-gold-900/40 flex items-center justify-center flex-shrink-0">
            <span className="text-[0.5rem] text-gold-500 font-body font-light uppercase">
              {session?.user.name?.charAt(0)}
            </span>
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-[0.52rem] tracking-wide text-obsidian-300 truncate font-body font-light">
              {session?.user.name}
            </p>
            <p className="text-[0.42rem] tracking-widest uppercase text-obsidian-600 truncate">
              {session?.user.email}
            </p>
          </div>
          <UserCircle className="w-3.5 h-3.5 text-obsidian-700 flex-shrink-0" />
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-obsidian-600 hover:text-red-400 hover:bg-red-950/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="text-[0.48rem] tracking-[0.2em] uppercase font-body font-light">
            Déconnexion
          </span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-obsidian-950 flex">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 bg-obsidian-900 border-r border-obsidian-800 flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-obsidian-950/80"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-72 bg-obsidian-900 border-r border-obsidian-800 flex flex-col h-full">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-obsidian-900 border-b border-obsidian-800 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-obsidian-500 hover:text-obsidian-300 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link
            href="/dashboard"
            className="font-display text-lg italic text-gold-500"
          >
            FêtEasy
          </Link>
          <Link
            href="/dashboard/profile"
            className="p-2 text-obsidian-500 hover:text-obsidian-300 transition-colors"
          >
            <UserCircle className="w-5 h-5" />
          </Link>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
