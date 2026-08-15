import { Link } from "react-router-dom";

export const SiteHeader = () => (
  <header
    data-testid="site-header"
    className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl"
  >
    <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-8">
      <Link to="/" data-testid="header-home-link" className="flex items-center gap-3">
        <img src="/elevate-logo.png" alt="CC Elevate" className="h-9 w-auto" />
        <span className="hidden text-[10px] eyebrow text-muted-foreground sm:inline">Sagl · Lugano</span>
      </Link>
      <a
        data-testid="header-website-link"
        href="https://www.cc-elevate.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs eyebrow text-muted-foreground transition-colors hover:text-[hsl(var(--accent))]"
      >
        www.cc-elevate.com
      </a>
    </div>
  </header>
);
