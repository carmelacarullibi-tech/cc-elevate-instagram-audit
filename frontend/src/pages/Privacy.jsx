import { SiteHeader } from "@/components/SiteHeader";

const Section = ({ title, children }) => (
  <section className="mt-8">
    <h2 className="serif text-xl tracking-tight text-foreground sm:text-2xl">{title}</h2>
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
      {children}
    </div>
  </section>
);

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <a
          href="/audit"
          className="text-xs eyebrow text-muted-foreground transition-colors hover:text-[hsl(var(--accent))]"
        >
          &larr; Torna all'audit
        </a>

        <p className="mt-8 text-[11px] eyebrow text-[hsl(var(--accent))]">CC Elevate</p>
        <h1 className="serif mt-3 text-3xl tracking-tight text-foreground sm:text-4xl">
          Informativa sulla Privacy
        </h1>
        <p className="mt-3 text-xs text-muted-foreground">Ultimo aggiornamento: agosto 2026</p>

        <Section title="1. Titolare del trattamento">
          <p>
            Il Titolare del trattamento è <strong className="text-foreground">CC Elevate Sagl</strong>, Piazza
            Cioccaro 4, 6900 Lugano (Svizzera), n. registro d'impresa CHE-138.758.005. Email di contatto per la
            privacy:{" "}
            <a href="mailto:admin@cc-elevate.com" className="text-[hsl(var(--accent))] underline underline-offset-2">
              admin@cc-elevate.com
            </a>
            .
          </p>
        </Section>

        <Section title="2. Dati raccolti">
          <p>
            Attraverso questo strumento raccogliamo i dati che ci fornisci volontariamente compilando il
            questionario, ossia: nome, indirizzo email, il tuo handle Instagram (@), i dati del tuo profilo che
            inserisci (bio, contenuti e temi, numero di follower, link in bio) e le risposte fornite al
            questionario di autovalutazione sul tuo profilo Instagram. Raccogliamo inoltre dati tecnici minimi
            necessari al funzionamento del servizio (es. log di sistema del provider di hosting).
          </p>
        </Section>

        <Section title="3. Finalità e base giuridica">
          <p>
            Trattiamo i tuoi dati per: (a) generare e inviarti il mini-audit personalizzato del tuo profilo
            Instagram; (b) previo tuo consenso separato e facoltativo, inviarti la newsletter e comunicazioni
            informative o promozionali di CC Elevate.
          </p>
          <p>
            La base giuridica è il tuo <strong className="text-foreground">consenso esplicito</strong>, prestato
            spuntando le apposite caselle nel form (art. 6.1.a GDPR; art. 6 nLPD). Ogni consenso è revocabile in
            qualsiasi momento scrivendo all'indirizzo di contatto indicato al punto 1, senza pregiudicare la
            liceità del trattamento effettuato prima della revoca.
          </p>
        </Section>

        <Section title="4. Destinatari e responsabili esterni">
          <p>
            Per erogare il servizio ci avvaliamo di fornitori che agiscono come responsabili del trattamento:{" "}
            <strong className="text-foreground">Anthropic</strong> (elaborazione tramite intelligenza artificiale
            per generare il report), <strong className="text-foreground">Resend</strong> (invio email),{" "}
            <strong className="text-foreground">MongoDB Atlas</strong> (archiviazione dei dati),{" "}
            <strong className="text-foreground">Render</strong> e <strong className="text-foreground">Netlify</strong>{" "}
            (hosting dell'applicazione). Non vendiamo né cediamo i tuoi dati a terzi per finalità di marketing di
            terzi.
          </p>
        </Section>

        <Section title="5. Trasferimenti internazionali">
          <p>
            Alcuni fornitori possono trattare i dati al di fuori della Svizzera e dell'UE (es. Stati Uniti). Tali
            trasferimenti avvengono in presenza di garanzie adeguate (clausole contrattuali standard e/o
            meccanismi di adeguatezza riconosciuti).
          </p>
        </Section>

        <Section title="6. Conservazione">
          <p>
            Conserviamo i dati per il tempo necessario alle finalità indicate e comunque non oltre 24 mesi
            dall'ultimo contatto utile, salvo revoca anticipata del consenso o richiesta di cancellazione.
          </p>
        </Section>

        <Section title="7. Diritti dell'interessato">
          <p>
            Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione. Per
            esercitarli scrivi a{" "}
            <a href="mailto:admin@cc-elevate.com" className="text-[hsl(var(--accent))] underline underline-offset-2">
              admin@cc-elevate.com
            </a>
            .
          </p>
          <p>
            Puoi inoltre proporre reclamo all'autorità competente: in Svizzera, l'Incaricato federale della
            protezione dei dati e della trasparenza (IFPDT); nell'UE, l'autorità di controllo del tuo Stato di
            residenza (in Italia, il Garante per la protezione dei dati personali).
          </p>
        </Section>

        <Section title="8. Consenso">
          <p>
            Spuntando la casella di accettazione nel form dichiari di aver letto la presente informativa e
            acconsenti al trattamento dei tuoi dati per le finalità indicate. Il consenso alla newsletter è
            separato e facoltativo.
          </p>
        </Section>

        <p className="mt-12 text-[10px] eyebrow text-muted-foreground">
          CC Elevate Sagl, Lugano &middot; &copy; 2026 CC Elevate
        </p>
      </main>
    </div>
  );
}
