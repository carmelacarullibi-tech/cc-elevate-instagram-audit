import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const CALENDLY_URL =
  "https://calendly.com/carmen-carulli13/catch-up-meeting?utm_source=instagram-audit&utm_medium=tool&utm_campaign=instagram-audit";

const includes = [
  "Una strategia Instagram completa costruita sul tuo posizionamento e sui tuoi obiettivi reali",
  "Analisi approfondita di profilo, contenuti e funnel di conversione — non solo la fotografia iniziale",
  "Un piano editoriale e una to-do list prioritizzata, costruiti sui tuoi dati, non su template",
  "Una call con me per rivedere insieme i risultati e i prossimi passi concreti",
];

export default function DeepAudit() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
    return () => {
      document.body.removeChild(s);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16" data-testid="deep-audit-page">
        <div className="rise">
          <p className="text-[11px] eyebrow text-[hsl(var(--accent))]">Consulenza CC Elevate</p>
          <h1 className="serif mt-4 text-4xl font-normal leading-[1.08] tracking-tight sm:text-5xl">
            Dal mini-audit alla strategia completa
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Grazie per il tuo interesse — questo è il passo successivo all'audit che hai appena completato.
          </p>
        </div>

        <section className="mt-14 border-t border-border pt-10">
          <p className="max-w-2xl text-sm leading-relaxed text-foreground/85 sm:text-base">
            Un percorso guidato 1:1, non un altro questionario da compilare da sola. Include:
          </p>
          <ul className="mt-8 space-y-5">
            {includes.map((item, i) => (
              <li
                key={i}
                className="rise flex gap-4 border-b border-border/70 pb-5"
                style={{ animationDelay: `${120 + i * 90}ms` }}
                data-testid={`deep-audit-include-${i}`}
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                <span className="text-sm leading-relaxed text-foreground/85 sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 border border-border bg-card p-7" data-testid="deep-audit-bio">
          <p className="text-[11px] eyebrow text-[hsl(var(--accent))]">Carmen Carulli</p>
          <p className="serif mt-3 text-lg leading-relaxed sm:text-xl">
            25+ anni di esperienza C-level in multinazionali, TEDx Speaker, Coach certificata ICF ACC.
          </p>
        </section>

        <section className="mt-16" data-testid="calendly-section">
          <h2 className="serif text-2xl tracking-tight">Scegli il tuo momento</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Prenota la call direttamente qui sotto.
          </p>
          <div
            className="calendly-inline-widget mt-8 border border-border bg-card"
            data-url={CALENDLY_URL}
            style={{ minWidth: "280px", height: "760px" }}
            data-testid="calendly-widget"
          />
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="calendly-fallback-link"
            className="mt-4 inline-block text-xs eyebrow text-muted-foreground hover:text-foreground"
          >
            Apri il calendario in una nuova finestra
          </a>
        </section>

        <Link
          to="/"
          data-testid="deep-audit-home-link"
          className="mt-14 inline-block text-xs eyebrow text-muted-foreground hover:text-foreground"
        >
          Torna alla home
        </Link>
      </main>
    </div>
  );
}
