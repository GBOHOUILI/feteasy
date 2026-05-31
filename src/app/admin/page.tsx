"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Shield, Users, Calendar, Crown } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { RoleBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface UserWithStats {
  _id: string;
  name: string;
  email: string;
  role: "organizer" | "super_admin";
  eventCount: number;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.role !== "super_admin") redirect("/dashboard");
      fetchUsers();
    }
  }, [status, session]);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.success) setUsers(data.data);
    setLoading(false);
  }

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "super_admin" ? "organizer" : "super_admin";
    if (!confirm(`Changer le rôle vers "${newRole}" ?`)) return;

    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Rôle mis à jour");
      fetchUsers();
    } else {
      toast.error(data.error);
    }
  }

  const totalOrganizers = users.filter((u) => u.role === "organizer").length;
  const totalAdmins = users.filter((u) => u.role === "super_admin").length;
  const totalEvents = users.reduce((s, u) => s + u.eventCount, 0);

  if (loading) return (
    <div className="flex justify-center items-center min-h-64 p-8">
      <div className="w-6 h-6 border border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[0.48rem] tracking-[0.36em] uppercase text-gold-700 mb-1 font-body font-light">
          Espace super administrateur
        </p>
        <h1 className="font-display font-light text-3xl text-white italic flex items-center gap-3">
          <Shield className="w-7 h-7 text-gold-600" />
          Administration
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Organisateurs" value={totalOrganizers} icon={Users} />
        <StatCard label="Super admins" value={totalAdmins} icon={Crown} accent />
        <StatCard label="Événements total" value={totalEvents} icon={Calendar} />
      </div>

      {/* Users table */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[0.48rem] tracking-[0.36em] uppercase text-obsidian-500 font-body font-light">
          ✦ &nbsp; Tous les utilisateurs
        </p>
      </div>

      <div className="bg-obsidian-900 border border-obsidian-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-obsidian-800">
              {["Nom", "Email", "Rôle", "Événements", "Inscrit le", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[0.44rem] tracking-[0.28em] uppercase text-obsidian-600 font-body font-light px-5 py-3.5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-obsidian-800/50 hover:bg-obsidian-800/20 transition-colors"
              >
                <td className="px-5 py-4">
                  <span className="font-display text-obsidian-200 italic text-sm">
                    {user.name}
                  </span>
                  {user._id === session?.user.id && (
                    <span className="ml-2 text-[0.4rem] tracking-widest uppercase text-gold-700 font-body font-light">
                      (vous)
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-[0.52rem] tracking-wide text-obsidian-500 font-body font-light">
                  {user.email}
                </td>
                <td className="px-5 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-5 py-4">
                  <span className="font-display text-lg text-gold-600">{user.eventCount}</span>
                </td>
                <td className="px-5 py-4 text-[0.48rem] tracking-widest uppercase text-obsidian-700 font-body font-light">
                  {formatShortDate(user.createdAt)}
                </td>
                <td className="px-5 py-4">
                  {user._id !== session?.user.id && (
                    <Button
                      variant={user.role === "super_admin" ? "danger" : "outline"}
                      size="sm"
                      onClick={() => toggleRole(user._id, user.role)}
                    >
                      {user.role === "super_admin" ? "Rétrograder" : "Promouvoir admin"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-obsidian-600 font-body font-light text-xs">
                  Aucun utilisateur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
