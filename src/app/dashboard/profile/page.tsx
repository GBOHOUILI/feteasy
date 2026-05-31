"use client";
import { useState, FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import { UserCircle, Lock, Trash2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [infoForm, setInfoForm] = useState({
    name: session?.user.name || "",
    email: session?.user.email || "",
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [infoErrors, setInfoErrors] = useState<Record<string, string>>({});
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  // Sync form when session loads
  useState(() => {
    if (session?.user) {
      setInfoForm({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  });

  async function handleSaveInfo(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!infoForm.name.trim()) errs.name = "Nom requis";
    if (!infoForm.email.trim()) errs.email = "Email requis";
    setInfoErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingInfo(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: infoForm.name, email: infoForm.email }),
    });
    const data = await res.json();
    setSavingInfo(false);

    if (!data.success) {
      toast.error(data.error);
      if (data.error?.includes("email")) setInfoErrors({ email: data.error });
    } else {
      await update({ name: data.data.name, email: data.data.email });
      toast.success("Profil mis à jour");
    }
  }

  async function handleSavePw(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!pwForm.currentPassword) errs.currentPassword = "Requis";
    if (pwForm.newPassword.length < 8)
      errs.newPassword = "8 caractères minimum";
    if (pwForm.newPassword !== pwForm.confirmPassword)
      errs.confirmPassword = "Les mots de passe ne correspondent pas";
    setPwErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingPw(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      }),
    });
    const data = await res.json();
    setSavingPw(false);

    if (!data.success) {
      toast.error(data.error);
      if (data.error?.includes("actuel"))
        setPwErrors({ currentPassword: data.error });
    } else {
      toast.success("Mot de passe modifié");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  }

  async function handleDelete() {
    if (!deletePassword) {
      toast.error("Entrez votre mot de passe");
      return;
    }
    setDeleting(true);
    const res = await fetch("/api/profile", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: deletePassword }),
    });
    const data = await res.json();
    setDeleting(false);

    if (!data.success) {
      toast.error(data.error);
    } else {
      toast.success("Compte supprimé");
      await signOut({ callbackUrl: "/" });
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-[0.48rem] tracking-[0.28em] uppercase text-obsidian-600 hover:text-gold-600 transition-colors mb-3 font-body font-light"
        >
          <ChevronLeft className="w-3 h-3" /> Dashboard
        </Link>
        <h1 className="font-display font-light text-3xl text-white italic">
          Mon profil
        </h1>
      </div>

      {/* ── Info section ── */}
      <section className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gold-950/60 border border-gold-900/40 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-gold-600" />
          </div>
          <div>
            <p className="text-[0.5rem] tracking-[0.3em] uppercase text-gold-700 font-body font-light">
              Informations
            </p>
            <p className="text-obsidian-200 font-body font-light text-sm">
              Nom et adresse email
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveInfo} className="flex flex-col gap-4">
          <Input
            label="Nom complet"
            value={infoForm.name}
            onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
            error={infoErrors.name}
            required
          />
          <Input
            label="Adresse email"
            type="email"
            value={infoForm.email}
            onChange={(e) =>
              setInfoForm({ ...infoForm, email: e.target.value })
            }
            error={infoErrors.email}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" loading={savingInfo} size="sm">
              Enregistrer
            </Button>
          </div>
        </form>
      </section>

      {/* ── Password section ── */}
      <section className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-obsidian-800 border border-obsidian-700 flex items-center justify-center">
            <Lock className="w-5 h-5 text-obsidian-400" />
          </div>
          <div>
            <p className="text-[0.5rem] tracking-[0.3em] uppercase text-gold-700 font-body font-light">
              Sécurité
            </p>
            <p className="text-obsidian-200 font-body font-light text-sm">
              Changer le mot de passe
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePw} className="flex flex-col gap-4">
          <Input
            label="Mot de passe actuel"
            type="password"
            value={pwForm.currentPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, currentPassword: e.target.value })
            }
            error={pwErrors.currentPassword}
            required
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            placeholder="8 caractères minimum"
            value={pwForm.newPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, newPassword: e.target.value })
            }
            error={pwErrors.newPassword}
            required
          />
          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            value={pwForm.confirmPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, confirmPassword: e.target.value })
            }
            error={pwErrors.confirmPassword}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" loading={savingPw} size="sm">
              Modifier le mot de passe
            </Button>
          </div>
        </form>
      </section>

      {/* ── Danger zone ── */}
      <section className="bg-red-950/10 border border-red-900/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-950/40 border border-red-900/40 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-[0.5rem] tracking-[0.3em] uppercase text-red-600 font-body font-light">
              Zone dangereuse
            </p>
            <p className="text-obsidian-300 font-body font-light text-sm">
              Supprimer mon compte
            </p>
          </div>
        </div>
        <p className="text-obsidian-500 font-body font-light text-xs mb-4 leading-relaxed">
          Cette action est irréversible. Tous vos événements et invités seront
          définitivement supprimés.
        </p>
        <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
          Supprimer mon compte
        </Button>
      </section>

      {/* Delete confirm modal */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-obsidian-400 font-body font-light text-sm">
            Entrez votre mot de passe pour confirmer la suppression définitive
            de votre compte.
          </p>
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={handleDelete}
            >
              Supprimer définitivement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
