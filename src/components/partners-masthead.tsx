export function PartnersMasthead() {
  return (
    <header className="border-b border-bg/15">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-5 flex items-center justify-between">
        <a href="/" className="flex items-baseline gap-3">
          <span className="font-display text-xl tracking-tight text-bg">
            Fengshui<span className="text-cinnabar mx-0.5">·</span>AI
          </span>
          <span className="text-[10px] tracking-[0.35em] uppercase text-bg/40 font-mono">
            Partners
          </span>
        </a>
        <nav className="flex items-center gap-6 sm:gap-10 text-sm">
          <a
            href="/"
            className="text-bg/70 hover:text-bg transition-colors hidden sm:inline"
          >
            Overview
          </a>
          <a
            href="/apply"
            className="text-bg/70 hover:text-bg transition-colors"
          >
            Apply
          </a>
          <a
            href="/login"
            className="text-cinnabar hover:opacity-80 transition-opacity tracking-wide"
          >
            Sign in <span aria-hidden>→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
