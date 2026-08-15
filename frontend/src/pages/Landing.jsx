import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

const steps = [
  { n: "01", t: "Posizionamento", d: "Chi sei, obiettivo, pubblico ideale e cosa ti rende diversa." },
  { n: "02", t: "Profilo & contenuti", d: "Bio, feed, pilastri di contenuto e identità visiva." },
  { n: "03", t: "Engagement & crescita", d: "Follower, interazione reale e cosa hai già provato." },
  { n: "04", t: "Strategia & monetizzazione", d: "Conversione, offerta, funnel e come guadagni." },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 sm:px-8">
        <section className="rise pt-16 pb-14 sm:pt-28 sm:pb-20">
          <p className="mb-6 text-[11px] eyebrow text-[hsl(var(--accent))]">Strumento gratuito · CC Elevate</p>
          <h1 className="serif max-w-3xl text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Quanto è forte il tuo <span className="italic text-[hsl(var(--accent))]">Instagram</span>?
          </h1>
          <p className="mt-7 max-w-xl text-sm text-muted-foreground sm:text-base">
            Raccontaci il tuo profilo — bio, contenuti, obiettivi — e l'intelligenza artificiale di CC Elevate
            genera un audit personalizzato: posizionamento, punti di forza, azioni prioritarie e una roadmap per
            i prossimi 30 giorni.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              to="/audit"
              data-testid="start-audit-button"
              className="group inline-flex items-center gap-3 rounded-full bg-[hsl(var(--primary))] px-7 py-3.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Inizia il tuo Audit
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Circa 5 minuti · nessun costo · report immediato
            </span>
          </div>
        </section>

        <section className="grid gap-px border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="rise border-b border-border py-8 pr-6 sm:border-r"
              style={{ animationDelay: `${120 + i * 90}ms` }}
            >
              <span className="text-[11px] eyebrow text-[hsl(var(--accent))]">{s.n}</span>
              <h2 className="serif mt-3 text-lg">{s.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </section>

        <footer className="py-12 text-xs text-muted-foreground">
          CC Elevate Sagl · Leadership e Personal Branding · Lugano
        </footer>
      </main>
    </div>
  );
}
