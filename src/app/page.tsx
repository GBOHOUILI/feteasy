"use client";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  QrCode,
  Users,
  ArrowRight,
  Calendar,
  CheckCircle,
  Star,
  Menu,
  X,
} from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import Image from "next/image";
import { useState } from "react";

export default function LandingPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-obsidian-950 overflow-x-hidden">
      {/* ─── Navigation ─────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-8 py-4 bg-obsidian-950/80 backdrop-blur-md border-b border-white/[0.04]">
        {/* Gauche : logo + FêtEasy */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewImage("/logo_ZtO.jpeg")}
            className="cursor-pointer"
          >
            <Image
              src="/logo_ZtO.jpeg"
              alt="Zero to One"
              width={48}
              height={48}
              className="rounded-md object-contain hover:scale-105 transition-transform"
            />
          </button>
          <div className="w-px h-5 bg-obsidian-700" />
          <span className="font-display text-lg italic text-gold-400 tracking-wide">
            FêtEasy
          </span>
        </div>

        {/* Centre : liens de navigation (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-[0.5rem] tracking-[0.24em] uppercase text-obsidian-500 hover:text-obsidian-200 transition-colors font-body font-light"
          >
            Fonctionnalités
          </a>
          <a
            href="#how"
            className="text-[0.5rem] tracking-[0.24em] uppercase text-obsidian-500 hover:text-obsidian-200 transition-colors font-body font-light"
          >
            Comment ça marche
          </a>
          <Link
            href="/contact"
            className="text-[0.5rem] tracking-[0.24em] uppercase text-obsidian-500 hover:text-obsidian-200 transition-colors font-body font-light"
          >
            Contact
          </Link>
        </div>

        {/* Droite : connexion + CTA (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[0.52rem] tracking-[0.28em] uppercase text-obsidian-400 hover:text-obsidian-200 transition-colors font-body font-light px-4 py-2"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="text-[0.52rem] tracking-[0.28em] uppercase bg-gold-700 hover:bg-gold-600 text-obsidian-950 border border-gold-600 hover:border-gold-400 transition-all px-5 py-2.5 rounded-lg font-body font-light"
          >
            Commencer
          </Link>
        </div>

        {/* Mobile : hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-obsidian-400 hover:text-obsidian-200 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* ─── Mobile menu overlay ─────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-obsidian-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-[73px] inset-x-0 bg-obsidian-900 border-b border-obsidian-800 flex flex-col px-6 py-6 gap-6">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[0.55rem] tracking-[0.3em] uppercase text-obsidian-300 hover:text-gold-400 transition-colors font-body font-light"
            >
              Fonctionnalités
            </a>
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[0.55rem] tracking-[0.3em] uppercase text-obsidian-300 hover:text-gold-400 transition-colors font-body font-light"
            >
              Comment ça marche
            </a>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[0.55rem] tracking-[0.3em] uppercase text-obsidian-300 hover:text-gold-400 transition-colors font-body font-light"
            >
              Contact
            </Link>
            <div className="h-px bg-obsidian-800" />
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[0.55rem] tracking-[0.3em] uppercase text-obsidian-400 hover:text-obsidian-200 transition-colors font-body font-light"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-[0.55rem] tracking-[0.3em] uppercase bg-gold-700 hover:bg-gold-600 text-obsidian-950 border border-gold-600 transition-all px-5 py-3 rounded-lg font-body font-light"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      )}

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-gold-600/5 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-gold-800/4 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#d4a01714 1px, transparent 1px), linear-gradient(90deg, #d4a01714 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Ornements seulement sur sm+ */}
        <div className="hidden sm:block absolute top-24 left-8 ornament-corner" />
        <div
          className="hidden sm:block absolute top-24 right-8 ornament-corner"
          style={{ transform: "scaleX(-1)" }}
        />
        <div
          className="hidden sm:block absolute bottom-8 left-8 ornament-corner"
          style={{ transform: "scaleY(-1)" }}
        />
        <div
          className="hidden sm:block absolute bottom-8 right-8 ornament-corner"
          style={{ transform: "scale(-1)" }}
        />

        <div className="relative max-w-3xl mx-auto w-full">
          <p className="text-[0.52rem] tracking-[0.5em] uppercase text-gold-600 mb-8 animate-fade-up font-body font-light opacity-80">
            Invitations d&apos;exception
          </p>
          <div
            className="flex items-center justify-center gap-4 mb-8 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-800/50" />
            <div className="w-1.5 h-1.5 rotate-45 bg-gold-600 opacity-60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-800/50" />
          </div>
          <h1
            className="font-display font-light leading-[0.95] mb-6 animate-fade-up text-white"
            style={{
              fontSize: "clamp(2.4rem, 9vw, 6rem)",
              animationDelay: "0.15s",
            }}
          >
            Vos événements,
            <br />
            <em className="text-gold-shimmer">magnifiés</em>
          </h1>
          <p
            className="text-obsidian-400 font-body font-light text-sm sm:text-base leading-relaxed mb-10 max-w-xl mx-auto animate-fade-up px-2"
            style={{ animationDelay: "0.25s" }}
          >
            Créez des invitations numériques de prestige, gérez vos invités en
            temps réel et vérifiez les entrées le jour J avec un scanner QR.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 bg-gold-700 hover:bg-gold-600 text-obsidian-950 border border-gold-600 hover:border-gold-400 transition-all text-[0.55rem] tracking-[0.3em] uppercase font-body font-light px-8 py-4 rounded-xl w-full sm:w-auto justify-center"
            >
              Créer mon compte gratuit
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[0.55rem] tracking-[0.3em] uppercase font-body font-light text-obsidian-400 hover:text-gold-400 transition-colors px-8 py-4 border border-obsidian-800 hover:border-gold-900 rounded-xl w-full sm:w-auto justify-center"
            >
              Se connecter
            </Link>
          </div>
          <p
            className="mt-8 text-[0.48rem] tracking-[0.3em] uppercase text-obsidian-700 animate-fade-up"
            style={{ animationDelay: "0.45s" }}
          >
            ✦ &nbsp; Gratuit &nbsp; · &nbsp; Sans carte bancaire &nbsp; · &nbsp;
            Déploiement immédiat
          </p>
        </div>
      </section>

      {/* ─── Screenshots ──────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-y border-obsidian-900 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[0.5rem] tracking-[0.4em] uppercase text-gold-700 mb-3 font-body font-light">
              Aperçu
            </p>
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-white">
              La plateforme en action
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                label: "Tableau de bord",
                desc: "Vue d'ensemble de vos événements, invités confirmés et taux de réponse.",
                src: "/screenshots/dashboard.png",
                icon: Calendar,
              },
              {
                label: "Invitation personnalisée",
                desc: "Carte d'invitation luxueuse avec code unique et QR ticket téléchargeable.",
                src: "/screenshots/invitation.png",
                icon: Sparkles,
              },
              {
                label: "Scanner d'entrée",
                desc: "Vérifiez les tickets en temps réel le jour J, sans papier ni liste imprimée.",
                src: "/screenshots/scanner.png",
                icon: QrCode,
              },
            ].map(({ label, desc, src, icon: Icon }) => (
              <div key={label} className="group flex flex-col gap-4">
                <div className="relative border border-obsidian-800 rounded-2xl overflow-hidden group-hover:border-gold-900/50 transition-all duration-300 bg-obsidian-900">
                  <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-obsidian-800/60 bg-obsidian-950/60 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-obsidian-700" />
                    <div className="w-2 h-2 rounded-full bg-obsidian-700" />
                    <div className="w-2 h-2 rounded-full bg-obsidian-700" />
                    <div className="flex-1 mx-3 h-3 rounded-full bg-obsidian-800/80" />
                  </div>
                  <div
                    className="relative w-full aspect-[16/10] overflow-hidden cursor-pointer"
                    onClick={() => setPreviewImage(src)}
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt={label}
                        fill
                        className="object-cover object-top hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-obsidian-900 to-obsidian-950">
                        <div className="w-10 h-10 rounded-xl bg-gold-950/40 border border-gold-900/30 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gold-600" />
                        </div>
                        <p className="text-[0.46rem] tracking-[0.28em] uppercase text-obsidian-600 font-body font-light">
                          Capture à venir
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gold-900/0 to-gold-900/0 group-hover:from-gold-900/5 transition-all duration-300 pointer-events-none" />
                </div>
                <div>
                  <p className="font-body font-light text-obsidian-200 text-sm mb-1">
                    {label}
                  </p>
                  <p className="text-obsidian-500 font-body font-light text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-[0.46rem] tracking-[0.28em] uppercase text-obsidian-700 font-body font-light">
            ✦ &nbsp; Captures d&apos;écran réelles disponibles après votre
            inscription gratuite
          </p>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────── */}
      <section
        id="features"
        className="py-16 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto"
      >
        <div className="text-center mb-12 sm:mb-20">
          <p className="text-[0.5rem] tracking-[0.4em] uppercase text-gold-700 mb-3 font-body font-light">
            Fonctionnalités
          </p>
          <h2 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-white">
            Tout ce dont vous avez besoin
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: Sparkles,
              title: "Invitations luxueuses",
              desc: "Cartes d'invitation numériques personnalisées avec votre thème, vos couleurs et les détails de l'événement.",
            },
            {
              icon: Shield,
              title: "Codes uniques sécurisés",
              desc: "Chaque invité reçoit un code personnel. Impossible de falsifier ou partager une invitation.",
            },
            {
              icon: QrCode,
              title: "Ticket QR numérique",
              desc: "À la confirmation, l'invité reçoit un ticket téléchargeable avec QR code à présenter à l'entrée.",
            },
            {
              icon: Users,
              title: "Gestion des invités",
              desc: "Tableau de bord complet : ajoutez, suivez, contactez vos invités. Export CSV en un clic.",
            },
            {
              icon: Calendar,
              title: "Multi-événements",
              desc: "Gérez plusieurs fêtes simultanément. Anniversaires, mariages, galas — tout dans un seul espace.",
            },
            {
              icon: CheckCircle,
              title: "Scanner le jour J",
              desc: "Vérifiez les tickets à l'entrée en scannant le QR ou en tapant le code. Instantané et fiable.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 sm:p-7 hover:border-gold-900/60 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gold-950/40 border border-gold-900/30 flex items-center justify-center mb-5 group-hover:border-gold-800/60 transition-colors">
                <Icon className="w-4 h-4 text-gold-600" />
              </div>
              <h3 className="font-body font-light text-obsidian-100 text-sm mb-2 tracking-wide">
                {title}
              </h3>
              <p className="text-obsidian-500 font-body font-light text-xs leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────── */}
      <section
        id="how"
        className="py-16 sm:py-24 px-4 sm:px-6 border-y border-obsidian-900"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[0.5rem] tracking-[0.4em] uppercase text-gold-700 mb-3 font-body font-light">
              Comment ça marche
            </p>
            <h2 className="font-display font-light text-3xl sm:text-4xl text-white">
              En 3 étapes simples
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-8">
            {[
              {
                n: "01",
                t: "Créez votre événement",
                d: "Renseignez la date, le lieu, le thème. Personnalisez votre invitation en quelques secondes.",
              },
              {
                n: "02",
                t: "Ajoutez vos invités",
                d: "Saisissez les noms et contacts. Chaque invité reçoit un lien et un code personnel unique.",
              },
              {
                n: "03",
                t: "Gérez le jour J",
                d: "Utilisez le scanner intégré pour valider les entrées. Voir en temps réel qui est présent.",
              },
            ].map(({ n, t, d }) => (
              <div key={n} className="text-center flex flex-col items-center">
                <p className="font-display text-5xl sm:text-6xl font-light text-gold-900 mb-4">
                  {n}
                </p>
                <h3 className="font-body font-light text-obsidian-200 text-sm mb-2">
                  {t}
                </h3>
                <p className="text-obsidian-500 font-body font-light text-xs leading-relaxed">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[0.5rem] tracking-[0.4em] uppercase text-gold-700 mb-3 font-body font-light">
            Ce qu&apos;ils en disent
          </p>
          <h2 className="font-display font-light text-3xl sm:text-4xl text-white">
            Ils font confiance à FêtEasy
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              q: "Mon anniversaire semblait issu d'un film. Les invités ont été bluffés par la carte d'invitation.",
              a: "Kokou A.",
              r: "Lomé",
            },
            {
              q: "J'ai géré 120 invités sans stress. Le scanner à l'entrée a évité tous les imposteurs.",
              a: "Aminata D.",
              r: "Dakar",
            },
            {
              q: "Professionnalisme total. Je recommande à tous les organisateurs d'événements.",
              a: "Joël M.",
              r: "Abidjan",
            },
          ].map(({ q, a, r }) => (
            <div
              key={a}
              className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 sm:p-7"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-gold-600 text-gold-600"
                  />
                ))}
              </div>
              <p className="text-obsidian-300 font-body font-light text-sm leading-relaxed mb-5 italic">
                &ldquo;{q}&rdquo;
              </p>
              <div>
                <p className="font-body font-light text-xs text-obsidian-200">
                  {a}
                </p>
                <p className="text-[0.48rem] tracking-widest uppercase text-obsidian-600">
                  {r}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-32 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center border border-gold-900/30 rounded-3xl p-8 sm:p-16 relative overflow-hidden bg-gold-950/10">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(120,80,20,0.10) 0%, transparent 70%)",
            }}
          />
          <p className="text-[0.52rem] tracking-[0.4em] uppercase text-gold-600 mb-4 font-body font-light relative">
            Prêt à commencer ?
          </p>
          <h2 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-white mb-6 relative">
            Créez votre premier
            <br />
            <em className="text-gold-shimmer">événement</em>
          </h2>
          <p className="text-obsidian-500 font-body font-light text-sm mb-8 sm:mb-10 relative px-2">
            Gratuit, sans carte bancaire, sans limite d&apos;invités.
          </p>
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-3 bg-gold-700 hover:bg-gold-600 text-obsidian-950 border border-gold-600 hover:border-gold-400 transition-all text-[0.55rem] tracking-[0.3em] uppercase font-body font-light px-6 sm:px-10 py-4 rounded-xl relative w-full sm:w-auto"
          >
            Créer mon compte maintenant
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        </div>
      </section>

      {/* ─── Image preview modal ─────────────────────────────── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-obsidian-900 border border-obsidian-700 text-white text-xl flex items-center justify-center hover:border-gold-600"
            >
              ×
            </button>
            <Image
              src={previewImage}
              alt="Preview"
              width={1600}
              height={1200}
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <Footer />
    </main>
  );
}
