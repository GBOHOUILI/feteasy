import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "FêtEasy — Gestion d'invitations de prestige",
  description: "Créez des invitations personnalisées, gérez vos invités et vérifiez les entrées le jour J.",
  openGraph: {
    title: "FêtEasy",
    description: "La plateforme d'invitation pour vos événements privés",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-obsidian-950 text-obsidian-100 font-body font-light antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#18181b",
                border: "1px solid #27272a",
                color: "#d4a017",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                borderRadius: "8px",
              },
              success: { iconTheme: { primary: "#d4a017", secondary: "#09090b" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#09090b" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
