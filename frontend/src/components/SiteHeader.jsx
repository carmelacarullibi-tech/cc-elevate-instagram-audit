import { Link } from "react-router-dom";

export const SiteHeader = () => (
  <header
    data-testid="site-header"
    className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl"
  >
    <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-2.5 sm:px-8">
      <Link to="/" data-testid="header-home-link" className="flex items-center">
        <img src="/elevate-logo.png" alt="CC Elevate" className="h-14 w-auto" />
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
