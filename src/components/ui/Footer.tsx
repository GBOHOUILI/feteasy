import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-obsidian-900 bg-obsidian-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl italic text-gold-400 tracking-wide block mb-3">
              FêtEasy
            </span>
            <p className="text-obsidian-500 font-body font-light text-xs leading-relaxed max-w-xs">
              La plateforme d&apos;invitations numériques de prestige pour vos
              événements privés.
            </p>
          </div>

          {/* Produit */}
          <div>
            <p className="text-[0.46rem] tracking-[0.34em] uppercase text-gold-800 mb-4 font-body font-light">
              Produit
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Fonctionnalités", href: "/#features" },
                { label: "Comment ça marche", href: "/#how" },
                { label: "Créer un compte", href: "/register" },
                { label: "Se connecter", href: "/login" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[0.5rem] tracking-[0.18em] uppercase text-obsidian-500 hover:text-gold-500 transition-colors font-body font-light"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <p className="text-[0.46rem] tracking-[0.34em] uppercase text-gold-800 mb-4 font-body font-light">
              Légal
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                {
                  label: "Conditions d'utilisation",
                  href: "/legal/conditions",
                },
                {
                  label: "Politique de confidentialité",
                  href: "/legal/privacy",
                },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[0.5rem] tracking-[0.18em] uppercase text-obsidian-500 hover:text-gold-500 transition-colors font-body font-light"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[0.46rem] tracking-[0.34em] uppercase text-gold-800 mb-4 font-body font-light">
              Contact
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Nous contacter", href: "/contact" },
                { label: "Support", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[0.5rem] tracking-[0.18em] uppercase text-obsidian-500 hover:text-gold-500 transition-colors font-body font-light"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-obsidian-800 to-transparent mb-6 sm:mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[0.44rem] tracking-[0.28em] uppercase text-obsidian-700 font-body font-light">
            © {year} FêtEasy · Tous droits réservés
          </p>
          <div className="flex items-center gap-1 text-obsidian-800">
            <span className="text-[0.42rem] tracking-[0.22em] uppercase font-body font-light">
              Fait par Zero to One | Eldo-Moréo GBOHOUILI
            </span>
            <span className="text-gold-800 text-xs">✦</span>
            <span className="text-[0.42rem] tracking-[0.22em] uppercase font-body font-light">
              en Afrique de l&apos;Ouest
            </span>
          </div>
          <div className="flex gap-5">
            <Link
              href="/legal/conditions"
              className="text-[0.44rem] tracking-[0.22em] uppercase text-obsidian-700 hover:text-obsidian-400 transition-colors font-body font-light"
            >
              CGU
            </Link>
            <Link
              href="/legal/privacy"
              className="text-[0.44rem] tracking-[0.22em] uppercase text-obsidian-700 hover:text-obsidian-400 transition-colors font-body font-light"
            >
              Confidentialité
            </Link>
            <Link
              href="/contact"
              className="text-[0.44rem] tracking-[0.22em] uppercase text-obsidian-700 hover:text-obsidian-400 transition-colors font-body font-light"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
