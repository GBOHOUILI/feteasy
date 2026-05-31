import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "Politique de confidentialité — FêtEasy",
  description:
    "Comment FêtEasy collecte, utilise et protège vos données personnelles.",
};

export default function PrivacyPage() {
  const updated = "31 Mai 2026";

  const sections = [
    {
      title: "1. Responsable du traitement",
      content: `FêtEasy est responsable du traitement de vos données personnelles collectées via la plateforme. Pour toute question relative à la protection de vos données, vous pouvez nous contacter via notre page de contact.`,
    },
    {
      title: "2. Données collectées",
      content: `Nous collectons les données suivantes : (a) Données de compte : nom, adresse e-mail, mot de passe chiffré, date de création du compte. (b) Données d'événement : titre, date, lieu, thème, adresse de l'événement. (c) Données d'invités : nom complet, numéro de téléphone (facultatif), code d'invitation, statut de confirmation. (d) Données techniques : adresse IP, type de navigateur, pages consultées, pour des fins de sécurité et d'amélioration du service.`,
    },
    {
      title: "3. Finalités du traitement",
      content: `Vos données sont utilisées pour : fournir et améliorer le service FêtEasy ; gérer votre compte et authentifier vos connexions ; vous envoyer des notifications liées à votre compte (confirmation d'inscription, réinitialisation de mot de passe) ; assurer la sécurité et prévenir les fraudes ; respecter nos obligations légales. Nous n'utilisons pas vos données à des fins publicitaires et ne les vendons jamais à des tiers.`,
    },
    {
      title: "4. Base légale du traitement",
      content: `Le traitement de vos données repose sur : l'exécution du contrat (fourniture du service) pour vos données de compte et d'événement ; votre consentement pour les communications marketing éventuelles ; notre intérêt légitime pour assurer la sécurité et améliorer le service ; le respect d'obligations légales le cas échéant.`,
    },
    {
      title: "5. Conservation des données",
      content: `Vos données de compte sont conservées pendant toute la durée de votre utilisation du service, puis 30 jours après la suppression de votre compte avant effacement définitif. Les données d'événements et d'invités sont supprimées avec votre compte. Certaines données techniques peuvent être conservées jusqu'à 12 mois à des fins de sécurité.`,
    },
    {
      title: "6. Partage des données",
      content: `Nous ne partageons pas vos données personnelles avec des tiers commerciaux. Vos données peuvent être transmises à des prestataires techniques (hébergement, base de données) dans le cadre strict de la fourniture du service, sous contrat de confidentialité. Nous pouvons être amenés à divulguer des données en réponse à une obligation légale ou une décision judiciaire.`,
    },
    {
      title: "7. Sécurité",
      content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des mots de passe (bcrypt), connexions HTTPS, authentification sécurisée, accès restreint aux données. Toutefois, aucun système n'est infaillible et nous ne pouvons garantir une sécurité absolue.`,
    },
    {
      title: "8. Vos droits",
      content: `Conformément à la réglementation applicable, vous disposez des droits suivants sur vos données : droit d'accès (obtenir une copie de vos données) ; droit de rectification (corriger des données inexactes) ; droit à l'effacement (supprimer votre compte et vos données) ; droit à la portabilité (recevoir vos données dans un format structuré) ; droit d'opposition (vous opposer à certains traitements). Pour exercer ces droits, contactez-nous via la page de contact.`,
    },
    {
      title: "9. Cookies",
      content: `FêtEasy utilise des cookies strictement nécessaires au fonctionnement du service (session d'authentification). Nous n'utilisons pas de cookies publicitaires ou de traçage tiers. Vous pouvez configurer votre navigateur pour refuser les cookies, ce qui peut affecter certaines fonctionnalités du service.`,
    },
    {
      title: "10. Modifications",
      content: `Cette politique peut être mise à jour. En cas de modification substantielle, nous vous en informerons par e-mail ou par notification dans l'application. La date de dernière mise à jour est indiquée en haut de cette page.`,
    },
  ];

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

      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-[0.5rem] tracking-[0.4em] uppercase text-gold-700 mb-4 font-body font-light">
            Légal
          </p>
          <h1 className="font-display font-light text-4xl md:text-5xl text-white mb-4">
            Politique de
            <br />
            <em className="text-gold-400">confidentialité</em>
          </h1>
          <p className="text-obsidian-500 font-body font-light text-xs tracking-widest uppercase">
            Dernière mise à jour : {updated}
          </p>
        </div>

        {/* Intro */}
        <div className="bg-obsidian-900/50 border border-gold-900/20 rounded-2xl p-6 mb-12">
          <p className="text-obsidian-300 font-body font-light text-sm leading-relaxed">
            La protection de vos données personnelles est une priorité pour
            FêtEasy. Cette politique explique quelles données nous collectons,
            pourquoi, et comment nous les protégeons.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-10">
          {sections.map(({ title, content }) => (
            <section key={title}>
              <h2 className="font-body font-light text-obsidian-100 text-sm mb-3 tracking-wide">
                {title}
              </h2>
              <div className="h-px bg-gradient-to-r from-gold-900/30 to-transparent mb-4" />
              <p className="text-obsidian-400 font-body font-light text-sm leading-relaxed">
                {content}
              </p>
            </section>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-16 pt-10 border-t border-obsidian-900 flex flex-wrap gap-6">
          <Link
            href="/legal/conditions"
            className="text-[0.5rem] tracking-[0.24em] uppercase text-gold-700 hover:text-gold-500 transition-colors font-body font-light"
          >
            Conditions d&apos;utilisation →
          </Link>
          <Link
            href="/contact"
            className="text-[0.5rem] tracking-[0.24em] uppercase text-obsidian-500 hover:text-obsidian-300 transition-colors font-body font-light"
          >
            Nous contacter →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
