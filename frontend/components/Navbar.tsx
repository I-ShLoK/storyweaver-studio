import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/40" />
          <span className="text-sm font-semibold tracking-[0.18em] text-text/80 uppercase">
            StoryWeaver Studio
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-xs text-text/70">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

