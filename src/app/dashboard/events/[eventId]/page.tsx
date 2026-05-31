"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Download,
  MessageCircle,
  ChevronLeft,
  Copy,
  Trash2,
  Users,
  CheckCircle,
  Clock,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { formatEventDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { IGuest, IEvent } from "@/types";

interface EventWithStats extends IEvent {
  stats?: { total: number; confirmed: number; checkedIn: number };
}

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventWithStats | null>(null);
  const [guests, setGuests] = useState<IGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [filter, setFilter] = useState<string>("all");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  async function fetchAll() {
    const [evRes, gRes] = await Promise.all([
      fetch(`/api/events/${eventId}`),
      fetch(`/api/guests?eventId=${eventId}`),
    ]);
    const [evData, gData] = await Promise.all([evRes.json(), gRes.json()]);
    if (evData.success) setEvent(evData.data);
    if (gData.success) setGuests(gData.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
  }, [eventId]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, eventId }),
    });
    const data = await res.json();
    setSaving(false);
    if (!data.success) return toast.error(data.error || "Erreur");
    toast.success(`${data.data.fullName} ajouté · Code : ${data.data.code}`);
    setAddOpen(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "" });
    fetchAll();
  }

  async function deleteGuest(id: string) {
    if (!confirm("Supprimer cet invité ?")) return;
    const res = await fetch(`/api/guests/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Supprimé");
      fetchAll();
    } else toast.error(data.error);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success("Code copié");
  }

  function copyInviteMsg(guest: IGuest) {
    const inviteUrl = `${appUrl}/invite/${event?.slug}`;
    const msg = `🎉 ${guest.fullName}, vous êtes invité(e) à *${event?.title}* !\n\nAccédez à votre invitation : ${inviteUrl}\nVotre code personnel : *${guest.code}*\n\nEntrez votre code pour confirmer votre présence et recevoir votre ticket.\n— Invitation personnelle, ne pas partager.`;
    navigator.clipboard.writeText(msg);
    toast.success("Message WhatsApp copié");
  }

  function exportCSV() {
    if (!guests.length) return toast.error("Aucun invité");
    const rows = ["Nom,Code,Email,Téléphone,Statut"].concat(
      guests.map(
        (g) =>
          `"${g.fullName}","${g.code}","${g.email || ""}","${g.phone || ""}","${g.status}"`,
      ),
    );
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `invites-${event?.slug || eventId}.csv`;
    a.click();
  }

  const filtered =
    filter === "all" ? guests : guests.filter((g) => g.status === filter);
  const pending = guests.filter((g) => g.status === "pending").length;
  const confirmed = guests.filter(
    (g) => g.status === "confirmed" || g.status === "checked_in",
  ).length;
  const checkedIn = guests.filter((g) => g.status === "checked_in").length;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-64 p-8">
        <div className="w-6 h-6 border border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/dashboard/events"
            className="flex items-center gap-1.5 text-[0.48rem] tracking-[0.28em] uppercase text-obsidian-600 hover:text-gold-600 transition-colors mb-3 font-body font-light"
          >
            <ChevronLeft className="w-3 h-3" /> Événements
          </Link>
          <h1 className="font-display font-light text-3xl text-white italic">
            {event?.title}
          </h1>
          <p className="text-[0.48rem] tracking-widest uppercase text-obsidian-600 mt-1 font-body font-light">
            {event && formatEventDate(event.date)} · {event?.time} ·{" "}
            {event?.venue}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
          <Link href="/dashboard/scanner">
            <Button variant="outline" size="sm">
              <QrCode className="w-3.5 h-3.5" /> Scanner
            </Button>
          </Link>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Ajouter un invité
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total invités" value={guests.length} icon={Users} />
        <StatCard
          label="Confirmés"
          value={confirmed}
          icon={CheckCircle}
          accent
        />
        <StatCard label="En attente" value={pending} icon={Clock} />
        <StatCard label="Présents (J)" value={checkedIn} icon={QrCode} />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {[
            { k: "all", l: "Tous" },
            { k: "pending", l: "En attente" },
            { k: "confirmed", l: "Confirmés" },
            { k: "checked_in", l: "Présents" },
          ].map(({ k, l }) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`text-[0.46rem] tracking-[0.2em] uppercase px-3 py-1.5 rounded border font-body font-light transition-all ${filter === k ? "border-gold-700/50 text-gold-400 bg-gold-950/20" : "border-obsidian-800 text-obsidian-600 hover:border-obsidian-700 hover:text-obsidian-400"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="text-[0.44rem] tracking-widest uppercase text-obsidian-700 font-body font-light">
          {filtered.length} invité{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Guest table */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-obsidian-600 font-body font-light text-xs">
            Aucun invité dans cette catégorie
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-obsidian-800">
                {["#", "Nom", "Code", "Contact", "Statut", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-[0.44rem] tracking-[0.28em] uppercase text-obsidian-600 font-body font-light px-5 py-3.5"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr
                  key={g._id}
                  className="border-b border-obsidian-800/50 hover:bg-obsidian-800/20 transition-colors"
                >
                  <td className="px-5 py-3.5 text-[0.52rem] text-obsidian-700 font-body font-light">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-display text-obsidian-200 italic text-sm">
                      {g.fullName}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gold-600 text-xs bg-gold-950/20 border border-gold-900/30 px-2.5 py-1 rounded">
                        {g.code}
                      </span>
                      <button
                        onClick={() => copyCode(g.code)}
                        className="text-obsidian-700 hover:text-obsidian-400 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[0.5rem] tracking-wide text-obsidian-600 font-body font-light">
                    <div>{g.email || "—"}</div>
                    <div>{g.phone || ""}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={g.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyInviteMsg(g)}
                        className="flex items-center gap-1.5 text-[0.44rem] tracking-[0.18em] uppercase text-obsidian-600 hover:text-gold-500 border border-obsidian-800 hover:border-gold-900/50 px-2.5 py-1.5 rounded transition-all font-body font-light"
                        title="Copier message WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" /> WA
                      </button>
                      <button
                        onClick={() => deleteGuest(g._id)}
                        className="p-1.5 text-obsidian-700 hover:text-red-400 transition-colors border border-obsidian-800 hover:border-red-900/40 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Guest Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Ajouter un invité"
      >
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prénom"
              placeholder="Sofia"
              value={form.firstName}
              onChange={set("firstName")}
              required
            />
            <Input
              label="Nom"
              placeholder="Martin"
              value={form.lastName}
              onChange={set("lastName")}
              required
            />
          </div>
          <Input
            label="WhatsApp / Téléphone"
            type="tel"
            placeholder="+229 00 00 00 00"
            value={form.phone}
            onChange={set("phone")}
          />
          <Input
            label="Email (optionnel)"
            type="email"
            placeholder="sofia@exemple.com"
            value={form.email}
            onChange={set("email")}
          />
          <div className="flex gap-3 mt-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setAddOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" loading={saving}>
              Ajouter l&apos;invité
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
