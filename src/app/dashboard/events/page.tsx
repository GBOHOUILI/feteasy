"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Calendar, MapPin, Users, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatEventDate, formatShortDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { IEvent } from "@/types";

const THEMES = ["luxury", "tropical", "minimal", "retro", "neon"] as const;

export default function EventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "20:00", doorsOpen: "",
    venue: "", address: "", city: "", theme: "luxury", maxGuests: "",
  });

  async function fetchEvents() {
    const res = await fetch("/api/events");
    const data = await res.json();
    if (data.success) setEvents(data.data);
    setLoading(false);
  }

  useEffect(() => { fetchEvents(); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, maxGuests: form.maxGuests ? Number(form.maxGuests) : undefined }),
    });
    const data = await res.json();
    setSaving(false);
    if (!data.success) return toast.error(data.error || "Erreur");
    toast.success("Événement créé !");
    setModalOpen(false);
    setForm({ title: "", description: "", date: "", time: "20:00", doorsOpen: "", venue: "", address: "", city: "", theme: "luxury", maxGuests: "" });
    fetchEvents();
  }

  async function togglePublish(event: IEvent) {
    const res = await fetch(`/api/events/${event._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !event.isPublished }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(data.data.isPublished ? "Événement publié" : "Dépublié");
      fetchEvents();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet événement et tous ses invités ?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast.success("Supprimé"); fetchEvents(); }
    else toast.error(data.error);
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[0.48rem] tracking-[0.36em] uppercase text-gold-700 mb-1 font-body font-light">
            Gestion
          </p>
          <h1 className="font-display font-light text-3xl text-white italic">Mes événements</h1>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Nouvel événement
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="border border-dashed border-obsidian-800 rounded-2xl p-16 text-center">
          <Calendar className="w-8 h-8 text-obsidian-700 mx-auto mb-4" />
          <p className="text-obsidian-600 font-body font-light text-xs mb-4">Aucun événement</p>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Créer un événement
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((ev) => (
            <div key={ev._id} className="bg-obsidian-900 border border-obsidian-800 rounded-xl p-6 flex items-center gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-body font-light text-obsidian-100 text-sm">{ev.title}</h3>
                  <span className={`text-[0.42rem] tracking-[0.22em] uppercase px-2 py-0.5 rounded border font-body font-light ${ev.isPublished ? "border-emerald-800/50 text-emerald-500 bg-emerald-950/20" : "border-obsidian-700 text-obsidian-600"}`}>
                    {ev.isPublished ? "Publié" : "Brouillon"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[0.46rem] tracking-widest uppercase text-obsidian-600 font-body font-light">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatShortDate(ev.date)}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.venue}, {ev.city}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ev.maxGuests ? `Max ${ev.maxGuests}` : "Illimité"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/dashboard/events/${ev._id}`}>
                  <Button variant="outline" size="sm">Gérer</Button>
                </Link>
                <button
                  onClick={() => togglePublish(ev)}
                  className="p-2 text-obsidian-600 hover:text-obsidian-300 transition-colors border border-obsidian-800 rounded-lg hover:border-obsidian-700"
                  title={ev.isPublished ? "Dépublier" : "Publier"}
                >
                  {ev.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(ev._id)}
                  className="p-2 text-obsidian-700 hover:text-red-400 transition-colors border border-obsidian-800 rounded-lg hover:border-red-900/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvel événement" size="lg">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input label="Nom de l'événement" placeholder="Anniversaire de Sofia" value={form.title} onChange={set("title")} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date" type="date" value={form.date} onChange={set("date")} required />
            <Input label="Heure de début" type="time" value={form.time} onChange={set("time")} required />
          </div>
          <Input label="Ouverture des portes (optionnel)" type="time" value={form.doorsOpen} onChange={set("doorsOpen")} />
          <Input label="Nom du lieu" placeholder="Villa Cotonou" value={form.venue} onChange={set("venue")} required />
          <Input label="Adresse" placeholder="123 Boulevard de la Marina" value={form.address} onChange={set("address")} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Ville" placeholder="Cotonou" value={form.city} onChange={set("city")} required />
            <div>
              <label className="block text-[0.48rem] tracking-[0.28em] uppercase text-obsidian-400 mb-2">Thème</label>
              <select value={form.theme} onChange={set("theme")} className="w-full bg-obsidian-900/50 border border-obsidian-800 text-obsidian-100 font-body font-light text-sm px-4 py-3 rounded-lg outline-none focus:border-gold-800 focus:ring-1 focus:ring-gold-700/50 transition-all">
                {THEMES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <Input label="Nombre max d'invités (optionnel)" type="number" placeholder="50" value={form.maxGuests} onChange={set("maxGuests")} />
          <div className="flex gap-3 mt-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" loading={saving}>Créer l&apos;événement</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
