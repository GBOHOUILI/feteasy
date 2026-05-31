import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "Conditions Générales d'Utilisation — FêtEasy",
  description: "Conditions générales d'utilisation de la plateforme FêtEasy.",
};

export default function ConditionsPage() {
  const updated = "31 Mai 2026";

  const sections = [
    {
      title: "1. Présentation du service",
      content: `FêtEasy est une plateforme numérique permettant aux organisateurs d'événements de créer des invitations personnalisées, de gérer leur liste d'invités et de vérifier les entrées le jour de l'événement via un système de codes QR uniques. Le service sera bientôt accessible via le site web feteasy.app et ses sous-domaines.`,
    },
    {
      title: "2. Acceptation des conditions",
      content: `En créant un compte ou en utilisant la plateforme FêtEasy, vous acceptez sans réserve les présentes Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service. Ces conditions peuvent être modifiées à tout moment ; la version en vigueur est celle publiée sur cette page.`,
    },
    {
      title: "3. Création de compte",
      content: `Pour utiliser FêtEasy en tant qu'organisateur, vous devez créer un compte en fournissant un nom, une adresse e-mail valide et un mot de passe sécurisé. Vous êtes responsable de la confidentialité de vos identifiants et de toute activité effectuée depuis votre compte. En cas d'utilisation non autorisée, vous devez nous en informer immédiatement via la page de contact.`,
    },
    {
      title: "4. Utilisation du service",
      content: `Vous vous engagez à utiliser FêtEasy exclusivement à des fins légitimes et licites. Il est notamment interdit de : créer de faux événements à des fins frauduleuses ; collecter des données personnelles d'invités sans leur consentement ; tenter de compromettre la sécurité de la plateforme ; utiliser le service pour envoyer des communications non sollicitées (spam) ; revendre ou exploiter commercialement les fonctionnalités sans autorisation écrite.`,
    },
    {
      title: "5. Données des invités",
      content: `En tant qu'organisateur, vous collectez et traitez les données personnelles de vos invités (nom, numéro de téléphone, statut de confirmation). Vous êtes seul responsable de cette collecte et devez vous assurer d'avoir les autorisations nécessaires. FêtEasy agit en qualité de sous-traitant et ne peut être tenu responsable d'un usage inapproprié de ces données par l'organisateur.`,
    },
    {
      title: "6. Propriété intellectuelle",
      content: `L'ensemble des éléments constituant la plateforme FêtEasy (code source, design, marques, logos, textes) est protégé par le droit de la propriété intellectuelle et reste la propriété exclusive de FêtEasy. Toute reproduction, représentation ou exploitation non autorisée est strictement interdite.`,
    },
    {
      title: "7. Disponibilité et modifications",
      content: `FêtEasy s'efforce de maintenir le service disponible en permanence mais ne garantit pas une disponibilité ininterrompue. Des interruptions pour maintenance, mises à jour ou incidents techniques peuvent survenir. FêtEasy se réserve le droit de modifier, suspendre ou interrompre tout ou partie du service sans préavis ni indemnité.`,
    },
    {
      title: "8. Limitation de responsabilité",
      content: `FêtEasy ne saurait être tenu responsable des dommages indirects, pertes de données, pertes de bénéfices ou préjudices résultant de l'utilisation ou de l'impossibilité d'utiliser le service. En aucun cas, la responsabilité de FêtEasy ne pourra excéder les sommes versées par l'utilisateur au titre du service au cours des trois derniers mois.`,
    },
    {
      title: "9. Résiliation",
      content: `Vous pouvez supprimer votre compte à tout moment depuis les paramètres. FêtEasy se réserve le droit de suspendre ou supprimer un compte en cas de violation des présentes CGU, sans préavis ni remboursement. À la résiliation, vos données sont conservées pendant 30 jours avant suppression définitive, sauf obligation légale contraire.`,
    },
    {
      title: "10. Droit applicable",
      content: `Les présentes CGU sont régies par le droit applicable en République du Bénin. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut d'accord, les tribunaux compétents du Bénin seront seuls compétents.`,
    },
    {
      title: "11. Contact",
      content: `Pour toute question relative aux présentes CGU, vous pouvez nous contacter via notre page de contact ou par e-mail à l'adresse indiquée sur le site.`,
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
            Conditions générales
            <br />
            <em className="text-gold-400">d&apos;utilisation</em>
          </h1>
          <p className="text-obsidian-500 font-body font-light text-xs tracking-widest uppercase">
            Dernière mise à jour : {updated}
          </p>
        </div>

        {/* Intro */}
        <div className="bg-obsidian-900/50 border border-gold-900/20 rounded-2xl p-6 mb-12">
          <p className="text-obsidian-300 font-body font-light text-sm leading-relaxed">
            Ces conditions régissent l&apos;utilisation de la plateforme
            FêtEasy. Veuillez les lire attentivement avant de créer un compte.
            En vous inscrivant, vous confirmez avoir lu, compris et accepté
            l&apos;intégralité des présentes conditions.
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
            href="/legal/privacy"
            className="text-[0.5rem] tracking-[0.24em] uppercase text-gold-700 hover:text-gold-500 transition-colors font-body font-light"
          >
            Politique de confidentialité →
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
