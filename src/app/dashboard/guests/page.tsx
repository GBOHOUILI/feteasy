"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { formatShortDate } from "@/lib/utils";
import type { IEvent, IGuest } from "@/types";

interface GuestWithEvent extends IGuest { eventTitle?: string; eventId: string }

export default function GuestsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [allGuests, setAllGuests] = useState<GuestWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/events").then((r) => r.json()).then(async (d) => {
      if (!d.success) { setLoading(false); return; }
      const evs: IEvent[] = d.data;
      setEvents(evs);

      const guestPromises = evs.map((ev) =>
        fetch(`/api/guests?eventId=${ev._id}`)
          .then((r) => r.json())
          .then((g) =>
            g.success
              ? (g.data as IGuest[]).map((guest) => ({
                  ...guest,
                  eventTitle: ev.title,
                  eventId: ev._id,
                }))
              : []
          )
      );
      const results = await Promise.all(guestPromises);
      setAllGuests(results.flat());
      setLoading(false);
    });
  }, []);

  const filtered = allGuests.filter((g) => {
    const matchStatus = filter === "all" || g.status === filter;
    const matchSearch =
      !search ||
      g.fullName.toLowerCase().includes(search.toLowerCase()) ||
      g.code.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[0.48rem] tracking-[0.36em] uppercase text-gold-700 mb-1 font-body font-light">
          Vue globale
        </p>
        <h1 className="font-display font-light text-3xl text-white italic">Tous les invités</h1>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom ou code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-obsidian-900 border border-obsidian-800 text-obsidian-100 font-body font-light text-sm px-4 py-2.5 rounded-lg outline-none focus:border-gold-800 placeholder:text-obsidian-700 transition-all"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-obsidian-900 border border-obsidian-800 text-obsidian-400 font-body font-light text-[0.5rem] tracking-widest uppercase px-4 py-2.5 rounded-lg outline-none focus:border-gold-800 transition-all"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmés</option>
          <option value="checked_in">Présents</option>
          <option value="declined">Déclinés</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-14 flex flex-col items-center gap-3">
              <Users className="w-8 h-8 text-obsidian-700" />
              <p className="text-obsidian-600 font-body font-light text-xs">Aucun invité trouvé</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-obsidian-800">
                  {["Nom", "Code", "Événement", "Contact", "Statut", "Ajouté le"].map((h) => (
                    <th key={h} className="text-left text-[0.44rem] tracking-[0.28em] uppercase text-obsidian-600 font-body font-light px-5 py-3.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g._id} className="border-b border-obsidian-800/50 hover:bg-obsidian-800/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-display text-obsidian-200 italic text-sm">{g.fullName}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-gold-600 text-xs bg-gold-950/20 border border-gold-900/30 px-2.5 py-1 rounded">
                        {g.code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/dashboard/events/${g.eventId}`}
                        className="flex items-center gap-1.5 text-[0.5rem] tracking-wide text-obsidian-500 hover:text-gold-500 transition-colors font-body font-light"
                      >
                        {g.eventTitle}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-[0.5rem] tracking-wide text-obsidian-600 font-body font-light">
                      {g.phone || g.email || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="px-5 py-3.5 text-[0.46rem] tracking-widest uppercase text-obsidian-700 font-body font-light">
                      {formatShortDate(g.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <p className="mt-4 text-[0.44rem] tracking-widest uppercase text-obsidian-700 font-body font-light text-right">
        {filtered.length} invité{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
