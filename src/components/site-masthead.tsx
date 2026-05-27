import Link from "next/link";

export function SiteMasthead() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3 group">
          <span className="font-display text-xl tracking-tight">
            Fengshui<span className="text-cinnabar mx-0.5">·</span>AI
          </span>
          <span className="hidden sm:inline text-[10px] tracking-[0.3em] uppercase text-muted">
            Singapore
          </span>
        </Link>
        <nav className="flex items-center gap-6 sm:gap-10 text-sm">
          <Link href="/map" className="hover:text-cinnabar transition-colors">
            Map
          </Link>
          <Link href="/method" className="hover:text-cinnabar transition-colors">
            Method
          </Link>
          <Link
            href="/period-9"
            className="hidden sm:inline hover:text-cinnabar transition-colors"
          >
            Period 9
          </Link>
        </nav>
      </div>
    </header>
  );
}
