"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nom requis";
    if (!form.email.trim()) e.email = "Email requis";
    if (form.password.length < 8) e.password = "8 caractères minimum";
    if (!acceptedTerms)
      e.terms = "Vous devez accepter les conditions pour continuer";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      toast.error(data.error || "Erreur");
      if (data.error?.includes("email")) setErrors({ email: data.error });
    } else {
      toast.success("Compte créé — connectez-vous");
      router.push("/login");
    }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="w-full max-w-sm animate-fade-up">
      <div className="text-center mb-10">
        <p className="text-[0.5rem] tracking-[0.4em] uppercase text-gold-700 mb-3 font-body font-light">
          Créer un compte
        </p>
        <h1 className="font-display font-light text-3xl text-white italic">
          Inscription
        </h1>
      </div>

      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Votre nom"
            type="text"
            placeholder="Prénom Nom"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
            required
          />
          <Input
            label="Adresse email"
            type="email"
            placeholder="vous@exemple.com"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="8 caractères minimum"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            required
          />

          {/* CGU checkbox */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked)
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.terms;
                        return n;
                      });
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
                    acceptedTerms
                      ? "bg-gold-700 border-gold-600"
                      : errors.terms
                        ? "border-red-700 bg-obsidian-900"
                        : "border-obsidian-700 bg-obsidian-900 group-hover:border-gold-800"
                  }`}
                >
                  {acceptedTerms && (
                    <svg
                      className="w-2.5 h-2.5 text-obsidian-950"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[0.5rem] tracking-[0.14em] uppercase text-obsidian-400 leading-relaxed font-body font-light group-hover:text-obsidian-300 transition-colors">
                J&apos;ai lu et j&apos;accepte les{" "}
                <Link
                  href="/legal/conditions"
                  target="_blank"
                  className="text-gold-700 hover:text-gold-500 transition-colors underline underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  conditions d&apos;utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  href="/legal/privacy"
                  target="_blank"
                  className="text-gold-700 hover:text-gold-500 transition-colors underline underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  politique de confidentialité
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-[0.5rem] tracking-widest uppercase text-red-400 ml-7">
                {errors.terms}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="mt-2 w-full"
            disabled={!acceptedTerms}
          >
            Créer mon compte
          </Button>
        </form>

        <p className="text-center mt-6 text-[0.5rem] tracking-[0.24em] uppercase text-obsidian-600 font-body font-light">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-gold-700 hover:text-gold-500 transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
