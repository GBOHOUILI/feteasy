"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Download,
  CheckCircle,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatEventDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface TicketData {
  guest: { id: string; fullName: string; code: string; status: string };
  event: {
    title: string;
    date: string;
    time: string;
    doorsOpen?: string;
    venue: string;
    address: string;
    city: string;
    theme: string;
    brandingEnabled: boolean;
  };
}

export default function InvitePage() {
  const { code: slugOrCode } = useParams<{ code: string }>();
  const [guestCode, setGuestCode] = useState("");
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventError, setEventError] = useState("");
  const [eventLoading, setEventLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [error, setError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slug = slugOrCode;
    if (!slug) {
      setEventLoading(false);
      return;
    }
    fetch(`/api/events/by-slug/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setEventId(d.data._id);
          setEventTitle(d.data.title);
        } else setEventError("Lien d'invitation invalide ou expiré.");
      })
      .catch(() => setEventError("Erreur de connexion. Réessayez."))
      .finally(() => setEventLoading(false));
  }, [slugOrCode]);

  useEffect(() => {
    if (!ticket) return;
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(ticket.guest.code, { width: 200, margin: 2 })
        .then(setQrDataUrl)
        .catch(console.error);
    });
  }, [ticket]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guestCode.trim() || !eventId) {
      toast.error("Événement introuvable, vérifiez votre lien.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: guestCode.trim().toUpperCase(), eventId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) {
      setError(data.error || "Code invalide");
      toast.error(data.error || "Code invalide");
    } else setTicket(data.data);
  }

  async function downloadTicket() {
    if (!ticket || !ticketRef.current) return;
    toast("Génération du PDF…", { icon: "⏳" });
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#09090b",
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      const imgW = pageW * 0.78;
      const imgH = imgW * ratio;
      pdf.addImage(
        imgData,
        "PNG",
        (pageW - imgW) / 2,
        (pageH - imgH) / 2,
        imgW,
        imgH,
      );
      pdf.save(
        `ticket-${ticket.event.title.replace(/\s+/g, "-").toLowerCase()}-${ticket.guest.code}.pdf`,
      );
      toast.success("PDF téléchargé ✓");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération du PDF");
    }
  }

  return (
    <main className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gold-700/5 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#d4a01720 1px, transparent 1px), linear-gradient(90deg, #d4a01720 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {["tl", "tr", "bl", "br"].map((pos) => (
        <div
          key={pos}
          className="fixed w-6 h-6 opacity-20 pointer-events-none"
          style={{
            top: pos.startsWith("t") ? "1.25rem" : "auto",
            bottom: pos.startsWith("b") ? "1.25rem" : "auto",
            left: pos.endsWith("l") ? "1.25rem" : "auto",
            right: pos.endsWith("r") ? "1.25rem" : "auto",
          }}
        >
          <div
            className="absolute w-px h-full bg-gold-500"
            style={{
              left: pos.endsWith("r") ? "auto" : 0,
              right: pos.endsWith("r") ? 0 : "auto",
            }}
          />
          <div
            className="absolute w-full h-px bg-gold-500"
            style={{
              top: pos.startsWith("b") ? "auto" : 0,
              bottom: pos.startsWith("b") ? 0 : "auto",
            }}
          />
        </div>
      ))}

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {eventLoading && (
          <div className="flex flex-col items-center gap-4 py-20">
            <Loader2 className="w-6 h-6 text-gold-600 animate-spin" />
            <p className="text-[0.5rem] tracking-[0.3em] uppercase text-obsidian-600 font-body font-light">
              Chargement…
            </p>
          </div>
        )}

        {!eventLoading && eventError && (
          <div className="text-center">
            <AlertCircle className="w-10 h-10 text-red-500/60 mx-auto mb-4" />
            <p className="font-display italic text-xl text-obsidian-300 mb-2">
              Lien invalide
            </p>
            <p className="text-obsidian-600 font-body font-light text-xs">
              {eventError}
            </p>
          </div>
        )}

        {!eventLoading && !eventError && !ticket && (
          <div>
            <div className="text-center mb-10">
              <p className="text-[0.5rem] tracking-[0.5em] uppercase text-gold-700 mb-4 font-body font-light opacity-80">
                Invitation personnelle &amp; confidentielle
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-800/50" />
                <div className="w-1.5 h-1.5 rotate-45 bg-gold-600 opacity-60" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-800/50" />
              </div>
              <h1
                className="font-display font-light text-white italic leading-tight"
                style={{ fontSize: "clamp(2rem, 7vw, 2.8rem)" }}
              >
                {eventTitle || "Vous êtes invité(e)"}
              </h1>
              <p className="text-[0.52rem] tracking-[0.3em] uppercase text-obsidian-600 mt-2 font-body font-light">
                Cercle privé · Accès restreint
              </p>
            </div>
            <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold-700/40 to-transparent" />
              <p className="text-[0.5rem] tracking-[0.3em] uppercase text-obsidian-500 mb-4 text-center font-body font-light">
                Entrez votre code d&apos;invitation
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  value={guestCode}
                  onChange={(e) => setGuestCode(e.target.value.toUpperCase())}
                  placeholder="VOTRE CODE"
                  className="text-center font-mono tracking-[0.4em] text-gold-300 text-base uppercase"
                  maxLength={12}
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                  error={error}
                />
                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  Confirmer ma présence
                </Button>
              </form>
            </div>
            <p className="text-center mt-6 text-[0.44rem] tracking-[0.28em] uppercase text-obsidian-800 font-body font-light">
              Invitation strictement personnelle · Ne pas diffuser
            </p>
          </div>
        )}

        {ticket && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-[0.52rem] tracking-[0.3em] uppercase text-emerald-500 font-body font-light">
                Présence confirmée
              </p>
            </div>

            <div
              ref={ticketRef}
              className="bg-obsidian-900 border border-gold-800/30 rounded-2xl p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              <p className="text-[0.48rem] tracking-[0.4em] uppercase text-gold-600 text-center mb-1 font-body font-light opacity-80">
                ✦ &nbsp; Ticket numérique &nbsp; ✦
              </p>
              <h2 className="font-display font-light text-2xl italic text-white text-center mb-1">
                Bienvenue,
              </h2>
              <p className="font-display font-light text-3xl italic text-gold-400 text-center mb-6">
                {ticket.guest.fullName}
              </p>
              <div className="w-8 h-px bg-gold-800/50 mx-auto mb-6" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
                {[
                  { k: "Événement", v: ticket.event.title },
                  { k: "Date", v: formatEventDate(ticket.event.date) },
                  {
                    k: "Heure",
                    v: ticket.event.time,
                    sub: ticket.event.doorsOpen
                      ? `Portes : ${ticket.event.doorsOpen}`
                      : undefined,
                  },
                  { k: "Lieu", v: ticket.event.venue, sub: ticket.event.city },
                ].map(({ k, v, sub }) => (
                  <div key={k}>
                    <p className="text-[0.44rem] tracking-[0.32em] uppercase text-gold-800 mb-1 font-body font-light">
                      {k}
                    </p>
                    <p className="font-display font-light text-obsidian-100 text-sm italic">
                      {v}
                    </p>
                    {sub && (
                      <p className="text-[0.46rem] tracking-wide text-obsidian-600 mt-0.5 font-body font-light">
                        {sub}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-obsidian-950/60 border border-obsidian-800 rounded-lg px-4 py-3 text-center mb-5">
                <p className="text-[0.44rem] tracking-[0.3em] uppercase text-obsidian-600 mb-1 font-body font-light">
                  Code d&apos;accès
                </p>
                <p className="font-mono tracking-[0.4em] text-gold-400 text-lg">
                  {ticket.guest.code}
                </p>
              </div>
              {qrDataUrl && (
                <div className="flex justify-center mb-5">
                  <div className="bg-white p-3 rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      width={160}
                      height={160}
                    />
                  </div>
                </div>
              )}
              <p className="text-center text-[0.44rem] tracking-[0.28em] uppercase text-obsidian-700 font-body font-light">
                ✦ &nbsp; Ticket personnel · Ne pas partager
              </p>

              {/* Branding — shown only if brandingEnabled */}
              {ticket.event.brandingEnabled && (
                <div className="mt-5 pt-4 border-t border-obsidian-800/50 text-center">
                  <p className="text-[0.42rem] tracking-[0.32em] uppercase text-obsidian-700 font-body font-light">
                    Créé avec{" "}
                    <a
                      href="https://feteasy.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-800 hover:text-gold-600 transition-colors"
                    >
                      FêtEasy
                    </a>{" "}
                    · La plateforme d&apos;invitations de prestige
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={downloadTicket}
              variant="outline"
              size="lg"
              className="w-full mt-4"
            >
              <FileText className="w-4 h-4" /> Télécharger en PDF
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
