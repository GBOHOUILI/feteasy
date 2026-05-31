"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Trash2,
  Eye,
  EyeOff,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatShortDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { IEvent } from "@/types";

const THEMES = ["luxury", "tropical", "minimal", "retro", "neon"] as const;
const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  time: "20:00",
  doorsOpen: "",
  venue: "",
  address: "",
  city: "",
  theme: "luxury",
  maxGuests: "",
};

export default function EventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  async function fetchEvents() {
    const res = await fetch("/api/events");
    const data = await res.json();
    if (data.success) setEvents(data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const set =
    (k: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  function openCreate() {
    setEditingEvent(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  }

  function openEdit(ev: IEvent) {
    setEditingEvent(ev);
    setForm({
      title: ev.title,
      description: ev.description || "",
      date: new Date(ev.date).toISOString().split("T")[0],
      time: ev.time,
      doorsOpen: ev.doorsOpen || "",
      venue: ev.venue,
      address: ev.address,
      city: ev.city,
      theme: ev.theme,
      maxGuests: ev.maxGuests ? String(ev.maxGuests) : "",
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      maxGuests: form.maxGuests ? Number(form.maxGuests) : undefined,
    };

    if (editingEvent) {
      const res = await fetch(`/api/events/${editingEvent._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSaving(false);
      if (!data.success) return toast.error(data.error || "Erreur");
      toast.success("Événement mis à jour");
    } else {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSaving(false);
      if (!data.success) return toast.error(data.error || "Erreur");
      toast.success("Événement créé !");
    }

    setModalOpen(false);
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
    if (data.success) {
      toast.success("Supprimé");
      fetchEvents();
    } else toast.error(data.error);
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div>
          <p className="text-[0.48rem] tracking-[0.36em] uppercase text-gold-700 mb-1 font-body font-light">
            Gestion
          </p>
          <h1 className="font-display font-light text-2xl md:text-3xl text-white italic">
            Mes événements
          </h1>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nouvel événement</span>
          <span className="sm:hidden">Nouveau</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="border border-dashed border-obsidian-800 rounded-2xl p-12 text-center">
          <Calendar className="w-8 h-8 text-obsidian-700 mx-auto mb-4" />
          <p className="text-obsidian-600 font-body font-light text-xs mb-4">
            Aucun événement
          </p>
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-3.5 h-3.5" /> Créer un événement
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-obsidian-900 border border-obsidian-800 rounded-xl p-4 md:p-5"
            >
              {/* Infos de l'événement */}
              <div className="flex-1 min-w-0 mb-3">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-body font-light text-obsidian-100 text-sm">
                    {ev.title}
                  </h3>
                  <span
                    className={`text-[0.42rem] tracking-[0.22em] uppercase px-2 py-0.5 rounded border font-body font-light ${ev.isPublished ? "border-emerald-800/50 text-emerald-500 bg-emerald-950/20" : "border-obsidian-700 text-obsidian-600"}`}
                  >
                    {ev.isPublished ? "Publié" : "Brouillon"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.46rem] tracking-widest uppercase text-obsidian-600 font-body font-light">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatShortDate(ev.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      {ev.venue}, {ev.city}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {ev.maxGuests ? `Max ${ev.maxGuests}` : "Illimité"}
                  </span>
                </div>
              </div>

              {/* Actions — ligne unique sur desktop, 2 lignes sur mobile */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Bouton principal toujours visible */}
                <Link
                  href={`/dashboard/events/${ev._id}`}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Gérer
                  </Button>
                </Link>

                {/* Séparateur visuel sur mobile */}
                <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                  <button
                    onClick={() => openEdit(ev)}
                    className="p-2 text-obsidian-600 hover:text-gold-400 transition-colors border border-obsidian-800 rounded-lg hover:border-gold-900/50"
                    title="Modifier"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => togglePublish(ev)}
                    className="p-2 text-obsidian-600 hover:text-obsidian-300 transition-colors border border-obsidian-800 rounded-lg hover:border-obsidian-700"
                    title={ev.isPublished ? "Dépublier" : "Publier"}
                  >
                    {ev.isPublished ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={async () => {
                      const res = await fetch(`/api/events/${ev._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          brandingEnabled: !(
                            ev as IEvent & { brandingEnabled?: boolean }
                          ).brandingEnabled,
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        toast.success(
                          data.data.brandingEnabled
                            ? "Branding activé"
                            : "Branding désactivé",
                        );
                        fetchEvents();
                      }
                    }}
                    className={`p-2 transition-colors border rounded-lg text-[0.42rem] tracking-widest uppercase font-body font-light px-2.5 ${(ev as IEvent & { brandingEnabled?: boolean }).brandingEnabled !== false ? "text-gold-700 border-gold-900/40 hover:border-gold-700" : "text-obsidian-700 border-obsidian-800 hover:border-obsidian-700"}`}
                    title="Activer/désactiver le branding FêtEasy sur le ticket"
                  >
                    pub
                  </button>
                  <button
                    onClick={() => handleDelete(ev._id)}
                    className="p-2 text-obsidian-700 hover:text-red-400 transition-colors border border-obsidian-800 rounded-lg hover:border-red-900/50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal — scrollable */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? "Modifier l'événement" : "Nouvel événement"}
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1"
        >
          <Input
            label="Nom de l'événement"
            placeholder="Anniversaire de Sofia"
            value={form.title}
            onChange={set("title")}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={set("date")}
              required
            />
            <Input
              label="Heure de début"
              type="time"
              value={form.time}
              onChange={set("time")}
              required
            />
          </div>
          <Input
            label="Ouverture des portes (optionnel)"
            type="time"
            value={form.doorsOpen}
            onChange={set("doorsOpen")}
          />
          <Input
            label="Nom du lieu"
            placeholder="Villa Cotonou"
            value={form.venue}
            onChange={set("venue")}
            required
          />
          <Input
            label="Adresse"
            placeholder="123 Boulevard de la Marina"
            value={form.address}
            onChange={set("address")}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Ville"
              placeholder="Cotonou"
              value={form.city}
              onChange={set("city")}
              required
            />
            <div>
              <label className="block text-[0.48rem] tracking-[0.28em] uppercase text-obsidian-400 mb-2">
                Thème
              </label>
              <select
                value={form.theme}
                onChange={set("theme")}
                className="w-full bg-obsidian-900/50 border border-obsidian-800 text-obsidian-100 font-body font-light text-sm px-4 py-3 rounded-lg outline-none focus:border-gold-800 focus:ring-1 focus:ring-gold-700/50 transition-all"
              >
                {THEMES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="Nombre max d'invités (optionnel)"
            type="number"
            placeholder="50"
            value={form.maxGuests}
            onChange={set("maxGuests")}
          />
          <div className="flex gap-3 mt-2 justify-end pb-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" loading={saving}>
              {editingEvent ? "Enregistrer" : "Créer l'événement"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
