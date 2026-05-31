"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { formatEventDate } from "@/lib/utils";
import type { IEvent } from "@/types";

interface EventWithStats extends IEvent {
  stats?: { total: number; confirmed: number; checkedIn: number };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setEvents(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalGuests = events.reduce((s, e) => s + (e.stats?.total || 0), 0);
  const totalConfirmed = events.reduce(
    (s, e) => s + (e.stats?.confirmed || 0),
    0,
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <p className="text-[0.48rem] tracking-[0.36em] uppercase text-gold-700 mb-2 font-body font-light">
          Tableau de bord
        </p>
        <h1 className="font-display font-light text-2xl sm:text-3xl text-white italic">
          Bonjour, {session?.user.name?.split(" ")[0]}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        <StatCard label="Événements" value={events.length} icon={Calendar} />
        <StatCard label="Invités total" value={totalGuests} icon={Users} />
        <StatCard
          label="Confirmés"
          value={totalConfirmed}
          icon={CheckCircle}
          accent
        />
        <StatCard
          label="Taux confirm."
          value={
            totalGuests
              ? Math.round((totalConfirmed / totalGuests) * 100) + "%"
              : "—"
          }
          icon={Clock}
        />
      </div>

      {/* Events */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <p className="text-[0.48rem] tracking-[0.36em] uppercase text-obsidian-500 font-body font-light">
          ✦ &nbsp; Mes événements
        </p>
        <Link href="/dashboard/events">
          <Button variant="ghost" size="sm">
            Voir tout <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="border border-dashed border-obsidian-800 rounded-2xl p-10 sm:p-16 text-center">
          <p className="text-obsidian-600 font-body font-light text-xs mb-4">
            Aucun événement pour l&apos;instant
          </p>
          <Link href="/dashboard/events">
            <Button size="sm">
              <Plus className="w-3.5 h-3.5" /> Créer mon premier événement
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.slice(0, 5).map((event) => (
            <Link
              key={event._id}
              href={`/dashboard/events/${event._id}`}
              className="group bg-obsidian-900 border border-obsidian-800 hover:border-gold-900/50 rounded-xl px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-6 transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <p className="font-body font-light text-obsidian-200 text-sm truncate group-hover:text-white transition-colors">
                  {event.title}
                </p>
                <p className="text-[0.48rem] tracking-widest uppercase text-obsidian-600 mt-0.5 truncate">
                  {formatEventDate(event.date)} · {event.venue}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 text-right flex-shrink-0">
                <div className="hidden xs:block">
                  <p className="font-display text-xl text-gold-500">
                    {event.stats?.confirmed || 0}
                  </p>
                  <p className="text-[0.42rem] tracking-widest uppercase text-obsidian-700">
                    confirmés
                  </p>
                </div>
                <StatusBadge
                  status={event.isPublished ? "confirmed" : "pending"}
                />
                <ArrowRight className="w-3.5 h-3.5 text-obsidian-700 group-hover:text-gold-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
