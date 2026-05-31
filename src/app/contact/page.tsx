"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Clock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/ui/Footer";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }
    setLoading(true);
    // Simulation envoi — remplacer par un vrai appel API
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success("Message envoyé ✓");
  }

  return (
    <div className="min-h-screen bg-obsidian-950">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-8 py-5 bg-obsidian-950/90 backdrop-blur-md border-b border-white/[0.04]">
        <Link
          href="/"
          className="font-display text-lg italic text-gold-400 tracking-wide"
        >
          FêtEasy
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[0.5rem] tracking-[0.24em] uppercase text-obsidian-400 hover:text-obsidian-200 transition-colors font-body font-light"
        >
          <ArrowLeft className="w-3 h-3" /> Retour
        </Link>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[0.5rem] tracking-[0.4em] uppercase text-gold-700 mb-4 font-body font-light">
              Support
            </p>
            <h1 className="font-display font-light text-4xl md:text-5xl text-white mb-4">
              Nous <em className="text-gold-400">contacter</em>
            </h1>
            <p className="text-obsidian-500 font-body font-light text-sm max-w-md mx-auto leading-relaxed">
              Une question, un problème ou une suggestion ? Nous vous répondons
              sous 24h.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-10">
            {/* Infos contact */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: "eldomoreogbohouili@gmail.com",
                  sub: "Réponse sous 24h",
                },
                {
                  icon: MessageSquare,
                  title: "Support",
                  value: "eldomoreo@gmail.com",
                  sub: "Questions techniques",
                },
                {
                  icon: Clock,
                  title: "Disponibilité",
                  value: "Lun – Ven",
                  sub: "8h – 18h (GMT+1)",
                },
              ].map(({ icon: Icon, title, value, sub }) => (
                <div
                  key={title}
                  className="bg-obsidian-900 border border-obsidian-800 rounded-xl p-5 flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-gold-950/40 border border-gold-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-[0.46rem] tracking-[0.3em] uppercase text-gold-800 mb-1 font-body font-light">
                      {title}
                    </p>
                    <p className="text-obsidian-200 font-body font-light text-sm">
                      {value}
                    </p>
                    <p className="text-obsidian-600 font-body font-light text-xs mt-0.5">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}

              {/* FAQ rapide */}
              <div className="bg-obsidian-900/50 border border-obsidian-800 rounded-xl p-5 mt-2">
                <p className="text-[0.46rem] tracking-[0.3em] uppercase text-gold-800 mb-4 font-body font-light">
                  Questions fréquentes
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "Comment créer mon premier événement ?",
                    "Comment envoyer les invitations ?",
                    "Comment fonctionne le scanner QR ?",
                  ].map((q) => (
                    <p
                      key={q}
                      className="text-obsidian-400 font-body font-light text-xs leading-relaxed cursor-pointer hover:text-gold-500 transition-colors"
                    >
                      ✦ {q}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="md:col-span-3">
              {sent ? (
                <div className="bg-obsidian-900 border border-gold-900/30 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-gold-950/40 border border-gold-900/30 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h2 className="font-display font-light text-2xl italic text-white mb-2">
                      Message envoyé
                    </h2>
                    <p className="text-obsidian-400 font-body font-light text-sm">
                      Nous vous répondrons à{" "}
                      <span className="text-gold-500">{form.email}</span>
                      <br />
                      dans les 24 heures.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="text-[0.5rem] tracking-[0.24em] uppercase text-obsidian-500 hover:text-obsidian-300 font-body font-light transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold-900/40 to-transparent" />

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Votre nom *"
                        type="text"
                        placeholder="Prénom Nom"
                        value={form.name}
                        onChange={set("name")}
                        required
                      />
                      <Input
                        label="Adresse email *"
                        type="email"
                        placeholder="vous@exemple.com"
                        value={form.email}
                        onChange={set("email")}
                        required
                      />
                    </div>

                    <Input
                      label="Sujet"
                      type="text"
                      placeholder="De quoi s'agit-il ?"
                      value={form.subject}
                      onChange={set("subject")}
                    />

                    <div className="w-full">
                      <label className="block text-[0.48rem] tracking-[0.28em] uppercase text-obsidian-400 mb-2">
                        Message *
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Décrivez votre demande en détail…"
                        value={form.message}
                        onChange={set("message")}
                        required
                        className="w-full bg-obsidian-900/50 border border-obsidian-800 text-obsidian-100 font-body font-light placeholder:text-obsidian-600 placeholder:text-sm px-4 py-3 rounded-lg outline-none transition-all duration-200 focus:border-gold-800 focus:ring-1 focus:ring-gold-700/50 text-sm resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      loading={loading}
                      size="lg"
                      className="w-full mt-1"
                    >
                      Envoyer le message
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
