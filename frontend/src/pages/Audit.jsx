import { useState } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { Report } from "@/components/Report";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STEPS = [
  {
    title: "Posizionamento e obiettivo",
    fields: [
      { k: "handle", l: "Il tuo @handle Instagram", t: "text" },
      { k: "presentazione", l: "In una frase, chi sei e cosa offri?", t: "area" },
      { k: "obiettivo", l: "Qual è il tuo obiettivo principale su Instagram? (vendere, autorevolezza, community, lead…)", t: "area" },
      { k: "pubblico", l: "Chi è il tuo pubblico ideale? Descrivilo.", t: "area" },
      { k: "differenza", l: "Cosa ti rende diversa da profili simili al tuo?", t: "area" },
      { k: "percezione", l: "Che percezione vuoi dare — e quale vuoi assolutamente evitare?", t: "area" },
      { k: "fase", l: "In che fase sei: stai partendo, cresci, o vuoi convertire di più?", t: "text" },
    ],
  },
  {
    title: "Profilo & bio",
    fields: [
      { k: "nome_profilo", l: "Nome profilo e categoria (come appari nella ricerca)", t: "text" },
      { k: "bio", l: "Incolla la tua bio attuale", t: "area" },
      { k: "link_bio", l: "Cosa c'è nel tuo link in bio?", t: "area" },
      { k: "foto_storie", l: "Foto profilo e storie in evidenza: cosa comunicano oggi?", t: "area" },
    ],
  },
  {
    title: "Contenuti & feed",
    fields: [
      { k: "formati", l: "Che tipo di contenuti pubblichi di solito? (reel, caroselli, foto, storie)", t: "area" },
      { k: "pilastri", l: "I 3 pilastri/temi su cui ruotano (o dovrebbero ruotare) i tuoi contenuti", t: "area" },
      { k: "ultimi_post", l: "Descrivi i tuoi ultimi post o il tema ricorrente", t: "area" },
      { k: "identita_visiva", l: "Il tuo feed ha un'identità visiva riconoscibile? Descrivila.", t: "area" },
      { k: "tono", l: "Il tuo tono di voce", t: "text" },
      { k: "frequenza", l: "Con quale frequenza pubblichi?", t: "choice", o: ["Mai", "Raramente", "1x settimana", "2-3x settimana", "Quasi ogni giorno"] },
    ],
  },
  {
    title: "Engagement & crescita",
    fields: [
      { k: "follower", l: "Numero di follower attuale", t: "number" },
      { k: "engagement", l: "Com'è l'engagement reale (commenti, salvataggi, condivisioni)?", t: "area" },
      { k: "provato", l: "Cosa hai già provato per crescere e cosa non ha funzionato?", t: "area" },
      { k: "reel_collab", l: "Usi reel, collaborazioni, hashtag in modo strategico?", t: "area" },
      { k: "community", l: "Come interagisci con la tua community (commenti, DM)?", t: "area" },
    ],
  },
  {
    title: "Strategia & conversione",
    fields: [
      { k: "conversione", l: "Come trasformi oggi i follower in contatti o clienti?", t: "area" },
      { k: "offerta_cta", l: "Cosa proponi/vendi tramite Instagram e con quale call-to-action?", t: "area" },
      { k: "ostacolo", l: "Qual è l'ostacolo principale tra il tuo profilo e i risultati che vuoi?", t: "area" },
      { k: "funnel", l: "Instagram è collegato a un funnel (sito, newsletter, WhatsApp)?", t: "area" },
    ],
  },
  {
    title: "Mercato & monetizzazione",
    fields: [
      { k: "riferimenti", l: "1-2 profili di riferimento che ammiri (e perché)", t: "area" },
      { k: "monetizzazione", l: "Come guadagni o vuoi guadagnare da Instagram?", t: "area" },
      { k: "offerta_principale", l: "La tua offerta principale, quella che vorresti spingere", t: "area" },
    ],
  },
  {
    title: "Ricevi il tuo audit",
    fields: [
      { k: "nome", l: "Nome", t: "text", req: true },
      { k: "email", l: "Email (per ricevere l'audit completo)", t: "email", req: true },
    ],
  },
];

const inputCls =
  "w-full rounded-sm border border-input bg-card px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-[hsl(var(--accent))]";

export default function Audit() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const current = STEPS[step];

  const submit = async () => {
    if (!form.nome?.trim() || !form.email?.trim()) {
      toast.error("Nome ed email sono obbligatori");
      return;
    }
    if (!form.privacy_accepted) {
      toast.error("Devi accettare la Privacy Policy per continuare");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/audit`, form);
      setReport(data);
      window.scrollTo(0, 0);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Errore durante la generazione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (step === STEPS.length - 1) submit();
    else {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  if (report) return <Report data={report} nome={form.nome} />;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <div className="mb-10 flex items-center gap-2" data-testid="wizard-progress">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className={`h-[3px] flex-1 transition-colors duration-500 ${
                i <= step ? "bg-[hsl(var(--accent))]" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div key={step} className="rise">
          <p className="text-[11px] eyebrow text-[hsl(var(--accent))]">
            Passo {step + 1} di {STEPS.length}
          </p>
          <h1 className="serif mt-3 text-3xl tracking-tight sm:text-4xl">{current.title}</h1>

          <div className="mt-10 space-y-8">
            {current.fields.map((f) => (
              <div key={f.k}>
                <label className="mb-3 block text-sm text-foreground/90" htmlFor={f.k}>
                  {f.l}
                  {f.req && <span className="text-[hsl(var(--accent))]"> *</span>}
                </label>
                {f.t === "area" && (
                  <textarea
                    id={f.k}
                    data-testid={`field-${f.k}`}
                    rows={3}
                    value={form[f.k] || ""}
                    onChange={(e) => set(f.k, e.target.value)}
                    className={inputCls + " resize-y"}
                  />
                )}
                {f.t === "choice" && (
                  <div className="flex flex-wrap gap-2">
                    {f.o.map((o) => (
                      <button
                        key={o}
                        type="button"
                        data-testid={`option-${f.k}-${o.replace(/\s+/g, "-").toLowerCase()}`}
                        onClick={() => set(f.k, o)}
                        className={`rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                          form[f.k] === o
                            ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-black"
                            : "border-input bg-card hover:border-[hsl(var(--accent))]"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                )}
                {["text", "email", "number"].includes(f.t) && (
                  <input
                    id={f.k}
                    data-testid={`field-${f.k}`}
                    type={f.t}
                    value={form[f.k] || ""}
                    onChange={(e) => set(f.k, e.target.value)}
                    className={inputCls}
                  />
                )}
              </div>
            ))}
          </div>

          {step === STEPS.length - 1 && (
            <div className="mt-8 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="checkbox-privacy"
                  checked={!!form.privacy_accepted}
                  onChange={(e) => set("privacy_accepted", e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[hsl(var(--accent))]"
                />
                <span className="text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                  Ho letto e accetto la{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[hsl(var(--accent))] underline underline-offset-2"
                  >
                    Privacy Policy
                  </a>
                  . <span className="text-[hsl(var(--accent))]">*</span>
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="checkbox-marketing"
                  checked={!!form.marketing_accepted}
                  onChange={(e) => set("marketing_accepted", e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[hsl(var(--accent))]"
                />
                <span className="text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                  Acconsento a ricevere la newsletter e comunicazioni informative e promozionali di CC Elevate via
                  email. <span className="opacity-60">(facoltativo)</span>
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <button
            type="button"
            data-testid="wizard-back-button"
            disabled={step === 0 || loading}
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Indietro
          </button>
          <button
            type="button"
            data-testid="wizard-next-button"
            disabled={loading}
            onClick={next}
            className="group inline-flex items-center gap-3 rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generazione in corso
              </>
            ) : (
              <>
                {step === STEPS.length - 1 ? "Genera il mio audit" : "Continua"}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
