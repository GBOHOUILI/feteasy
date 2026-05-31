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
  Pencil,
  Send,
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

const DEFAULT_MSG = (
  name: string,
  eventTitle: string,
  url: string,
  code: string,
) =>
  `🎉 ${name}, vous êtes invité(e) à *${eventTitle}* !\n\nAccédez à votre invitation : ${url}\nVotre code personnel : *${code}*\n\nEntrez votre code pour confirmer votre présence et recevoir votre ticket.\n— Invitation personnelle, ne pas partager.`;

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventWithStats | null>(null);
  const [guests, setGuests] = useState<IGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editGuest, setEditGuest] = useState<IGuest | null>(null);
  const [msgOpen, setMsgOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<IGuest | null>(null);
  const [customMsg, setCustomMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [guestForm, setGuestForm] = useState({
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

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setGuestForm((f) => ({ ...f, [k]: e.target.value }));

  // Open add guest
  function openAdd() {
    setEditGuest(null);
    setGuestForm({ firstName: "", lastName: "", email: "", phone: "" });
    setAddOpen(true);
  }

  // Open edit guest
  function openEditGuest(g: IGuest) {
    setEditGuest(g);
    setGuestForm({
      firstName: g.firstName,
      lastName: g.lastName,
      email: g.email || "",
      phone: g.phone || "",
    });
    setAddOpen(true);
  }

  async function handleSaveGuest(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editGuest) {
      const res = await fetch(`/api/guests/${editGuest._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestForm),
      });
      const data = await res.json();
      setSaving(false);
      if (!data.success) return toast.error(data.error || "Erreur");
      toast.success("Invité mis à jour");
    } else {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...guestForm, eventId }),
      });
      const data = await res.json();
      setSaving(false);
      if (!data.success) return toast.error(data.error || "Erreur");
      toast.success(`${data.data.fullName} ajouté · Code : ${data.data.code}`);
    }

    setAddOpen(false);
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

  // Open message modal with default message pre-filled
  function openMsg(g: IGuest) {
    const inviteUrl = `${appUrl}/invite/${event?.slug}`;
    setSelectedGuest(g);
    setCustomMsg(
      DEFAULT_MSG(g.fullName, event?.title || "", inviteUrl, g.code),
    );
    setMsgOpen(true);
  }

  // Send via WhatsApp (opens wa.me with message pre-filled)
  function sendWhatsApp() {
    if (!selectedGuest || !customMsg) return;
    const phone = selectedGuest.phone?.replace(/\D/g, "") || "";
    const encoded = encodeURIComponent(customMsg);
    const url = phone
      ? `https://wa.me/${phone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
    setMsgOpen(false);
  }

  function copyMsg() {
    navigator.clipboard.writeText(customMsg);
    toast.success("Message copié");
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
    <div className="p-4 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/events"
          className="flex items-center gap-1.5 text-[0.48rem] tracking-[0.28em] uppercase text-obsidian-600 hover:text-gold-600 transition-colors mb-3 font-body font-light"
        >
          <ChevronLeft className="w-3 h-3" /> Événements
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-light text-2xl md:text-3xl text-white italic">
              {event?.title}
            </h1>
            <p className="text-[0.48rem] tracking-widest uppercase text-obsidian-600 mt-1 font-body font-light">
              {event && formatEventDate(event.date)} · {event?.time} ·{" "}
              {event?.venue}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Link href="/dashboard/scanner">
              <Button variant="outline" size="sm">
                <QrCode className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Scanner</span>
              </Button>
            </Link>
            <Button size="sm" onClick={openAdd}>
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ajouter un invité</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
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

      {/* Guest list — cards on mobile, table on desktop */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-obsidian-600 font-body font-light text-xs">
            Aucun invité dans cette catégorie
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-obsidian-800/50">
              {filtered.map((g) => (
                <div key={g._id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-display text-obsidian-200 italic text-sm">
                        {g.fullName}
                      </p>
                      <p className="text-[0.46rem] tracking-wide text-obsidian-600 font-body font-light mt-0.5">
                        {g.phone || g.email || "—"}
                      </p>
                    </div>
                    <StatusBadge status={g.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-gold-600 text-xs bg-gold-950/20 border border-gold-900/30 px-2.5 py-1 rounded">
                      {g.code}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openMsg(g)}
                        className="flex items-center gap-1 text-[0.44rem] tracking-wide uppercase text-obsidian-600 hover:text-gold-500 border border-obsidian-800 hover:border-gold-900/50 px-2.5 py-1.5 rounded transition-all font-body font-light"
                      >
                        <MessageCircle className="w-3 h-3" /> WA
                      </button>
                      <button
                        onClick={() => openEditGuest(g)}
                        className="p-1.5 text-obsidian-700 hover:text-gold-400 border border-obsidian-800 hover:border-gold-900/40 rounded transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteGuest(g._id)}
                        className="p-1.5 text-obsidian-700 hover:text-red-400 border border-obsidian-800 hover:border-red-900/40 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <table className="hidden md:table w-full">
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
                          onClick={() => openMsg(g)}
                          className="flex items-center gap-1.5 text-[0.44rem] tracking-[0.18em] uppercase text-obsidian-600 hover:text-gold-500 border border-obsidian-800 hover:border-gold-900/50 px-2.5 py-1.5 rounded transition-all font-body font-light"
                          title="Envoyer via WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3" /> WA
                        </button>
                        <button
                          onClick={() => openEditGuest(g)}
                          className="p-1.5 text-obsidian-700 hover:text-gold-400 transition-colors border border-obsidian-800 hover:border-gold-900/40 rounded"
                          title="Modifier"
                        >
                          <Pencil className="w-3 h-3" />
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
          </>
        )}
      </div>

      {/* Add / Edit Guest Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={editGuest ? "Modifier l'invité" : "Ajouter un invité"}
      >
        <form onSubmit={handleSaveGuest} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prénom"
              placeholder="Sofia"
              value={guestForm.firstName}
              onChange={setField("firstName")}
              required
            />
            <Input
              label="Nom"
              placeholder="Martin"
              value={guestForm.lastName}
              onChange={setField("lastName")}
              required
            />
          </div>
          <Input
            label="WhatsApp / Téléphone"
            type="tel"
            placeholder="+229 00 00 00 00"
            value={guestForm.phone}
            onChange={setField("phone")}
          />
          <Input
            label="Email (optionnel)"
            type="email"
            placeholder="sofia@exemple.com"
            value={guestForm.email}
            onChange={setField("email")}
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
              {editGuest ? "Enregistrer" : "Ajouter l'invité"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* WhatsApp Message Modal */}
      <Modal
        open={msgOpen}
        onClose={() => setMsgOpen(false)}
        title={`Message pour ${selectedGuest?.fullName}`}
        size="md"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[0.48rem] tracking-[0.24em] uppercase text-obsidian-500 font-body font-light">
            Personnalisez le message avant envoi
          </p>
          <textarea
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            rows={8}
            className="w-full bg-obsidian-900/50 border border-obsidian-800 text-obsidian-100 font-body font-light text-xs leading-relaxed px-4 py-3 rounded-lg outline-none focus:border-gold-800 focus:ring-1 focus:ring-gold-700/50 transition-all resize-none"
          />
          <div className="flex gap-2 justify-end flex-wrap">
            <Button variant="ghost" size="sm" onClick={copyMsg}>
              <Copy className="w-3.5 h-3.5" /> Copier
            </Button>
            <Button size="sm" onClick={sendWhatsApp}>
              <Send className="w-3.5 h-3.5" />
              {selectedGuest?.phone
                ? "Ouvrir WhatsApp"
                : "WhatsApp (sans numéro)"}
            </Button>
          </div>
          {!selectedGuest?.phone && (
            <p className="text-[0.46rem] tracking-wide text-obsidian-600 font-body font-light">
              Aucun numéro enregistré — WhatsApp s&apos;ouvrira sans
              destinataire. Ajoutez un numéro à l&apos;invité pour l&apos;envoi
              direct.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
