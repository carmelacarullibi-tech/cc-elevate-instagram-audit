import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Admin() {
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState(null);
  const [open, setOpen] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`${API}/admin/leads`, {
        headers: { "X-Admin-Password": password },
      });
      setLeads(data);
    } catch {
      toast.error("Password non valida");
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 pb-20 pt-12 sm:px-8">
        <h1 className="serif text-3xl tracking-tight">Lead raccolti</h1>

        {!leads ? (
          <form onSubmit={login} className="mt-8 flex max-w-sm gap-2" data-testid="admin-login-form">
            <input
              type="password"
              data-testid="admin-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="flex-1 rounded-sm border border-input bg-card px-4 py-3 text-sm outline-none focus:border-[hsl(var(--accent))]"
            />
            <button
              type="submit"
              data-testid="admin-login-button"
              className="rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm text-[hsl(var(--primary-foreground))]"
            >
              Entra
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-3" data-testid="admin-leads-list">
            <p className="text-sm text-muted-foreground">{leads.length} lead</p>
            {leads.map((l) => (
              <div key={l.id} className="border border-border bg-card p-5" data-testid={`lead-${l.id}`}>
                <button
                  onClick={() => setOpen(open === l.id ? null : l.id)}
                  className="flex w-full items-baseline justify-between text-left"
                >
                  <span className="serif text-lg">{l.answers?.nome}</span>
                  <span className="text-xs text-muted-foreground">
                    {l.answers?.email} · {new Date(l.created_at).toLocaleString("it-CH")}
                  </span>
                </button>
                {open === l.id && (
                  <div className="mt-4 border-t border-border pt-4">
                    <pre className="whitespace-pre-wrap font-sans text-xs text-muted-foreground">
                      {JSON.stringify(l.answers, null, 2)}
                    </pre>
                    <pre className="mt-4 whitespace-pre-wrap font-sans text-sm">{l.report}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
