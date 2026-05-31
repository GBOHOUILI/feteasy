"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email ou mot de passe incorrect");
      toast.error("Identifiants invalides");
    } else {
      toast.success("Connexion réussie");
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full max-w-sm animate-fade-up">
      <div className="text-center mb-10">
        <p className="text-[0.5rem] tracking-[0.4em] uppercase text-gold-700 mb-3 font-body font-light">
          Accès organisateur
        </p>
        <h1 className="font-display font-light text-3xl text-white italic">
          Connexion
        </h1>
      </div>

      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Adresse email"
            type="email"
            placeholder="vous@exemple.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="current-password"
            error={error}
          />
          <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
            Se connecter
          </Button>
        </form>

        <p className="text-center mt-6 text-[0.5rem] tracking-[0.24em] uppercase text-obsidian-600 font-body font-light">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-gold-700 hover:text-gold-500 transition-colors">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
