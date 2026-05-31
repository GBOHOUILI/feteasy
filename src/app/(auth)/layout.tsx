import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col">
      {/* Corner ornaments */}
      <div className="fixed top-5 left-5 w-6 h-6 opacity-20 pointer-events-none">
        <div className="absolute w-px h-full bg-gold-600 left-0 top-0" />
        <div className="absolute w-full h-px bg-gold-600 left-0 top-0" />
      </div>
      <div className="fixed top-5 right-5 w-6 h-6 opacity-20 pointer-events-none">
        <div className="absolute w-px h-full bg-gold-600 right-0 top-0" />
        <div className="absolute w-full h-px bg-gold-600 right-0 top-0" />
      </div>
      <div className="fixed bottom-5 left-5 w-6 h-6 opacity-20 pointer-events-none">
        <div className="absolute w-px h-full bg-gold-600 left-0 bottom-0" />
        <div className="absolute w-full h-px bg-gold-600 left-0 bottom-0" />
      </div>
      <div className="fixed bottom-5 right-5 w-6 h-6 opacity-20 pointer-events-none">
        <div className="absolute w-px h-full bg-gold-600 right-0 bottom-0" />
        <div className="absolute w-full h-px bg-gold-600 right-0 bottom-0" />
      </div>

      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gold-700/5 blur-[100px]" />
      </div>

      <nav className="flex items-center justify-center py-8">
        <Link href="/" className="font-display text-xl italic text-gold-500 tracking-wide">
          FêtEasy
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  );
}
