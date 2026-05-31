# FêtEasy 🎉

Plateforme de gestion d'invitations d'exception — Next.js 14 + MongoDB Atlas.

## Stack

| Couche | Technologie |
|--------|------------|
| Framework | Next.js 14 App Router + TypeScript |
| Base de données | MongoDB Atlas (Mongoose) |
| Auth | NextAuth.js v4 (JWT) |
| Styles | Tailwind CSS (design luxe obsidian/or) |
| QR Code | qrcode |
| Fonts | Cormorant Garamond + DM Sans |

## Installation

### 1. Cloner et installer

```bash
cd feteasy
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Puis remplissez `.env.local` :

```env
# MongoDB Atlas — créez un cluster gratuit sur mongodb.com/atlas
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/feteasy?retryWrites=true&w=majority

# NextAuth — générez un secret fort
NEXTAUTH_SECRET=votre_secret_super_fort_32_caracteres_min
NEXTAUTH_URL=http://localhost:3000

# URL publique (pour les liens d'invitation)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Super admin initial
SUPER_ADMIN_EMAIL=admin@feteasy.app
SUPER_ADMIN_PASSWORD=MotDePasseSecurise123!
```

### 3. Créer le super admin

```bash
npx tsx src/scripts/seed-admin.ts
```

### 4. Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Déploiement sur Vercel

```bash
npm i -g vercel
vercel
```

Ajoutez les variables d'environnement dans le dashboard Vercel.
Remplacez `NEXTAUTH_URL` et `NEXT_PUBLIC_APP_URL` par votre URL de production.

## Structure du projet

```
src/
├── app/
│   ├── page.tsx                  # Landing page luxueuse
│   ├── (auth)/
│   │   ├── login/                # Connexion
│   │   └── register/             # Inscription
│   ├── dashboard/
│   │   ├── page.tsx              # Tableau de bord
│   │   ├── events/               # Gestion événements
│   │   ├── guests/               # Vue globale invités
│   │   └── scanner/              # Scanner QR jour J
│   ├── admin/                    # Panel super admin
│   ├── invite/[code]/            # Page publique invitation
│   └── api/
│       ├── auth/                 # NextAuth + register
│       ├── events/               # CRUD événements
│       ├── guests/               # CRUD invités
│       ├── invite/               # Validation code public
│       ├── scan/                 # Check-in jour J
│       └── admin/                # Gestion utilisateurs
├── components/
│   ├── ui/                       # Button, Input, Modal, Badge…
│   ├── dashboard/
│   ├── invite/
│   └── scanner/
├── lib/
│   ├── mongodb.ts                # Connexion DB
│   ├── auth.ts                   # NextAuth config
│   ├── utils.ts                  # Helpers (generateCode, slug…)
│   └── qr.ts                     # Génération QR
├── models/
│   ├── User.ts                   # Modèle utilisateur
│   ├── Event.ts                  # Modèle événement
│   └── Guest.ts                  # Modèle invité
├── types/                        # Types TypeScript
└── scripts/
    └── seed-admin.ts             # Création super admin
```

## Flux d'invitation

1. **Organisateur** crée un événement → ajoute ses invités
2. **Chaque invité** reçoit un lien + code unique via WhatsApp
3. **Invité** visite `/invite/[slug-de-levenement]` → entre son code
4. **Ticket numérique** généré avec QR code → téléchargeable
5. **Jour J** → l'organisateur ouvre `/dashboard/scanner` → scan ou saisie manuelle du code → accès validé ✓

## Sécurité

- Mots de passe hashés bcrypt (12 rounds)
- JWT signé (NextAuth)
- Middleware Next.js protège `/dashboard` et `/admin`
- Routes API vérifient la session à chaque requête
- Propriété d'événement vérifiée avant toute modification
- `.env.local` jamais commité (`.gitignore`)
