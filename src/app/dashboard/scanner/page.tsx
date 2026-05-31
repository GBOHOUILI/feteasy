"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  QrCode,
  Keyboard,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { IEvent } from "@/types";

type ScanResult = {
  type: "success" | "error" | "warning";
  title: string;
  subtitle?: string;
};

export default function ScannerPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [mode, setMode] = useState<"camera" | "manual">("manual");
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [checking, setChecking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setEvents(d.data);
      });
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setScanning(true);
      scanIntervalRef.current = setInterval(scanFrame, 500);
    } catch {
      setResult({
        type: "error",
        title: "Caméra inaccessible",
        subtitle: "Vérifiez les permissions",
      });
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    setScanning(false);
  }

  function scanFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA)
      return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  async function checkCode(code: string) {
    if (!code.trim() || !selectedEventId) return;
    setChecking(true);
    setResult(null);

    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code.trim().toUpperCase(),
        eventId: selectedEventId,
      }),
    });
    const data = await res.json();
    setChecking(false);

    if (data.success) {
      setResult({
        type: "success",
        title: `✓ Bienvenue, ${data.data.fullName}`,
        subtitle: "Entrée autorisée · Ticket valide",
      });
      setManualCode("");
    } else if (data.result === "already_checked_in") {
      setResult({
        type: "warning",
        title: `Déjà enregistré · ${data.data?.fullName || ""}`,
        subtitle: "Ce ticket a déjà été utilisé",
      });
    } else {
      setResult({
        type: "error",
        title: "Ticket invalide",
        subtitle: data.error || "Code non reconnu",
      });
    }
  }

  function handleModeSwitch(newMode: "camera" | "manual") {
    if (mode === "camera") stopCamera();
    setMode(newMode);
    setResult(null);
    setManualCode("");
  }

  const selectedEvent = events.find((e) => e._id === selectedEventId);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <p className="text-[0.48rem] tracking-[0.36em] uppercase text-gold-700 mb-1 font-body font-light">
          Contrôle d&apos;entrée
        </p>
        <h1 className="font-display font-light text-2xl sm:text-3xl text-white italic">
          Scanner QR
        </h1>
      </div>

      {/* Event selector */}
      <div className="mb-6">
        <label className="block text-[0.48rem] tracking-[0.28em] uppercase text-obsidian-400 mb-2 font-body font-light">
          Événement
        </label>
        <select
          value={selectedEventId}
          onChange={(e) => {
            setSelectedEventId(e.target.value);
            setResult(null);
          }}
          className="w-full bg-obsidian-900 border border-obsidian-800 text-obsidian-100 font-body font-light text-sm px-4 py-3 rounded-lg outline-none focus:border-gold-800 transition-all"
        >
          <option value="">— Sélectionner un événement —</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.title}
            </option>
          ))}
        </select>
      </div>

      {selectedEventId && (
        <>
          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            {[
              { k: "camera", label: "Caméra QR", icon: QrCode },
              { k: "manual", label: "Code Manuel", icon: Keyboard },
            ].map(({ k, label, icon: Icon }) => (
              <button
                key={k}
                onClick={() => handleModeSwitch(k as "camera" | "manual")}
                className={`flex items-center gap-2 flex-1 justify-center py-3 rounded-xl border transition-all text-[0.5rem] tracking-[0.2em] uppercase font-body font-light ${mode === k ? "border-gold-700/50 bg-gold-950/20 text-gold-400" : "border-obsidian-800 text-obsidian-600 hover:border-obsidian-700"}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden xs:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Camera mode */}
          {mode === "camera" && (
            <div className="mb-6">
              <div className="relative bg-obsidian-900 border border-obsidian-800 rounded-2xl overflow-hidden aspect-square max-w-xs sm:max-w-sm mx-auto">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                {!scanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-obsidian-950/80">
                    <QrCode className="w-12 h-12 text-obsidian-700" />
                    <Button onClick={startCamera} size="sm">
                      Activer la caméra
                    </Button>
                  </div>
                )}
                {scanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-8 border-2 border-gold-500/40 rounded-lg">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold-400 rounded-tl" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold-400 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold-400 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold-400 rounded-br" />
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-400/50 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
              {scanning && (
                <div className="flex justify-center mt-3">
                  <Button variant="ghost" size="sm" onClick={stopCamera}>
                    <RefreshCw className="w-3 h-3" /> Arrêter la caméra
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Manual mode */}
          {mode === "manual" && (
            <div className="mb-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  checkCode(manualCode);
                }}
                className="flex gap-3"
              >
                <Input
                  placeholder="ALEX4729"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  className="font-mono tracking-[0.3em] text-center text-gold-300"
                  autoFocus
                />
                <Button
                  type="submit"
                  loading={checking}
                  disabled={!manualCode.trim()}
                  className="flex-shrink-0"
                >
                  Vérifier
                </Button>
              </form>
            </div>
          )}

          {/* Result */}
          {result && (
            <div
              className={`rounded-2xl p-5 sm:p-6 border flex items-start gap-4 animate-fade-up ${
                result.type === "success"
                  ? "bg-emerald-950/30 border-emerald-800/50"
                  : result.type === "warning"
                    ? "bg-yellow-950/30 border-yellow-800/40"
                    : "bg-red-950/30 border-red-800/50"
              }`}
            >
              {result.type === "success" && (
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 flex-shrink-0 mt-0.5" />
              )}
              {result.type === "warning" && (
                <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400 flex-shrink-0 mt-0.5" />
              )}
              {result.type === "error" && (
                <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`font-body font-light text-sm ${
                    result.type === "success"
                      ? "text-emerald-300"
                      : result.type === "warning"
                        ? "text-yellow-300"
                        : "text-red-300"
                  }`}
                >
                  {result.title}
                </p>
                {result.subtitle && (
                  <p className="text-[0.48rem] tracking-widest uppercase mt-1 text-obsidian-500 font-body font-light">
                    {result.subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {!selectedEventId && (
        <div className="border border-dashed border-obsidian-800 rounded-2xl p-12 sm:p-16 text-center">
          <QrCode className="w-8 h-8 text-obsidian-700 mx-auto mb-4" />
          <p className="text-obsidian-600 font-body font-light text-xs">
            Sélectionnez un événement pour commencer
          </p>
        </div>
      )}
    </div>
  );
}
