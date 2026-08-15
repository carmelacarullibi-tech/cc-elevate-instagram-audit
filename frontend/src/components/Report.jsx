import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

const clean = (line) => line.replace(/[*#_`]/g, "").trim();

const isHeading = (line) => {
  const c = clean(line);
  return c.length > 3 && c === c.toUpperCase() && /[A-Z]/.test(c);
};

const isImpact = (line) => /^impatto atteso/i.test(clean(line));

const isSeparator = (line) => {
  const c = clean(line);
  return c === "" || /^[-–—]+$/.test(c);
};

export const Report = ({ data, nome }) => {
  const lines = (data.report || "").split("\n").filter((l) => l.trim() && !isSeparator(l));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16" data-testid="report-view">
        <p className="text-[11px] eyebrow text-[hsl(var(--accent))]">Il tuo Instagram Audit</p>
        <h1 className="serif mt-3 text-3xl tracking-tight sm:text-4xl">
          {nome ? `Ciao ${nome}` : "Instagram Audit"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground" data-testid="report-email-status">
          {data.email_sent ? "Una copia è stata inviata alla tua email." : ""}
        </p>

        <article className="mt-10 space-y-4 border-t border-border pt-8">
          {lines.map((line, i) => {
            if (isHeading(line))
              return (
                <h2
                  key={i}
                  className="serif pt-6 text-xl tracking-tight text-foreground first:pt-0"
                  data-testid={`report-heading-${i}`}
                >
                  {clean(line)}
                </h2>
              );
            if (isImpact(line))
              return (
                <div
                  key={i}
                  data-testid={`report-impact-${i}`}
                  className="my-5 border-l-2 border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/[0.06] px-5 py-4"
                >
                  <span className="flex items-center gap-2 text-[10px] eyebrow text-[hsl(var(--accent))]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Impatto atteso
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {clean(line).replace(/^impatto atteso:?\s*/i, "")}
                  </p>
                </div>
              );
            return (
              <p key={i} className="text-sm leading-relaxed text-foreground/85 sm:text-base">
                {clean(line)}
              </p>
            );
          })}
        </article>

        <div className="mt-14 border border-border bg-card p-7">
          <h3 className="serif text-xl">La strategia Instagram completa</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Dal mini-audit a un piano editoriale e una strategia di crescita e conversione costruiti sui tuoi
            dati, insieme al team CC Elevate.
          </p>
          <Link
            data-testid="deep-audit-cta"
            to="/deep-audit"
            className="mt-6 inline-flex rounded-full bg-[hsl(var(--accent))] px-6 py-3 text-sm font-medium text-black transition-transform duration-300 hover:-translate-y-0.5"
          >
            Prenota una consulenza
          </Link>
        </div>

        <Link
          to="/"
          data-testid="report-home-link"
          className="mt-10 inline-block text-xs eyebrow text-muted-foreground hover:text-foreground"
        >
          Torna alla home
        </Link>
      </main>
    </div>
  );
};
