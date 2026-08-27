from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import json
import urllib.request
import urllib.error
import uuid
import html as html_lib
import re
from pathlib import Path
from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr, Field
import resend
from anthropic import AsyncAnthropic

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ANTHROPIC_API_KEY = os.environ['ANTHROPIC_API_KEY']
resend.api_key = os.environ['RESEND_API_KEY']
SENDER_EMAIL = os.environ['SENDER_EMAIL']
NOTIFY_EMAIL = os.environ['NOTIFY_EMAIL']
ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']
PUBLIC_APP_URL = os.environ['PUBLIC_APP_URL']

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- HubSpot: sincronizza i lead con consenso newsletter ----------
HUBSPOT_TOKEN = os.environ.get('HUBSPOT_TOKEN', '')


def _hubspot_upsert_sync(email: str, properties: dict) -> None:
    body = json.dumps({
        "inputs": [{"idProperty": "email", "id": email, "properties": properties}]
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {HUBSPOT_TOKEN}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        logger.error(f"HubSpot upsert HTTPError {e.code}: {e.read().decode('utf-8', 'ignore')}")
    except Exception as e:
        logger.error(f"HubSpot upsert failed: {e}")


async def hubspot_sync_lead(email: str, source: str, extra: Optional[dict] = None) -> None:
    if not HUBSPOT_TOKEN:
        return
    properties = {"email": email, "assessment_source": source}
    if extra:
        properties.update({k: v for k, v in extra.items() if v})
    try:
        await asyncio.to_thread(_hubspot_upsert_sync, email, properties)
    except Exception as e:
        logger.error(f"HubSpot sync error: {e}")


class AuditRequest(BaseModel):
    nome: str
    email: EmailStr
    handle: str = ""
    presentazione: str = ""
    obiettivo: str = ""
    pubblico: str = ""
    differenza: str = ""
    percezione: str = ""
    fase: str = ""
    nome_profilo: str = ""
    bio: str = ""
    link_bio: str = ""
    foto_storie: str = ""
    formati: str = ""
    pilastri: str = ""
    ultimi_post: str = ""
    identita_visiva: str = ""
    tono: str = ""
    frequenza: str = ""
    follower: Optional[str] = ""
    engagement: str = ""
    provato: str = ""
    reel_collab: str = ""
    community: str = ""
    conversione: str = ""
    offerta_cta: str = ""
    ostacolo: str = ""
    funnel: str = ""
    riferimenti: str = ""
    monetizzazione: str = ""
    offerta_principale: str = ""
    privacy_accepted: bool = False
    marketing_accepted: bool = False


class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    answers: dict
    report: str
    emails_sent: bool = False


LABELS = [
    ("handle", "Handle Instagram"),
    ("presentazione", "Chi è e cosa offre"),
    ("obiettivo", "Obiettivo principale su Instagram"),
    ("pubblico", "Pubblico ideale"),
    ("differenza", "Cosa la rende diversa"),
    ("percezione", "Percezione da dare / da evitare"),
    ("fase", "Fase attuale"),
    ("nome_profilo", "Nome profilo e categoria"),
    ("bio", "Bio attuale"),
    ("link_bio", "Link in bio"),
    ("foto_storie", "Foto profilo e storie in evidenza"),
    ("formati", "Formati di contenuto"),
    ("pilastri", "Pilastri/temi dei contenuti"),
    ("ultimi_post", "Ultimi post / tema ricorrente"),
    ("identita_visiva", "Identità visiva del feed"),
    ("tono", "Tono di voce"),
    ("frequenza", "Frequenza di pubblicazione"),
    ("follower", "Numero di follower"),
    ("engagement", "Engagement reale"),
    ("provato", "Cosa ha provato per crescere"),
    ("reel_collab", "Uso di reel/collaborazioni/hashtag"),
    ("community", "Interazione con la community"),
    ("conversione", "Come converte i follower in clienti"),
    ("offerta_cta", "Offerta e call-to-action"),
    ("ostacolo", "Ostacolo principale ai risultati"),
    ("funnel", "Collegamento a un funnel"),
    ("riferimenti", "Profili di riferimento"),
    ("monetizzazione", "Come guadagna/vuole guadagnare"),
    ("offerta_principale", "Offerta principale da spingere"),
]

SYSTEM_TEMPLATE = (
    "Sei un consulente senior di personal branding e strategia Instagram per CC Elevate Sagl, "
    "società svizzera di Leadership & Transformation Advisory. Il tuo compito è produrre un mini-audit "
    "Instagram professionale e personalizzato per {nome}, a partire dalle risposte a un questionario "
    "sul suo profilo.\n\n"
    "PRINCIPI\n"
    "- Scrivi in italiano, con tono da advisor autorevole ma caldo, concreto e mai giudicante.\n"
    "- Sii SPECIFICO sulle risposte di {nome}: cita elementi concreti che ha dato (la sua bio, i suoi "
    "temi, l'obiettivo, il pubblico). Vietato il generico e i consigli validi per chiunque. Se "
    "un'informazione manca, fai un'ipotesi ragionata dichiarandola, senza inventare dati.\n"
    "- Ragiona da esperto: collega ciò che dice a ciò che serve per il suo obiettivo dichiarato. Ogni "
    "osservazione ha un 'perché'.\n"
    "- Niente emoji, niente toni da vendita aggressiva.\n"
    "- Non usare formattazione markdown (niente #, *, trattini di separazione ---): scrivi in testo semplice; i titoli delle sezioni vanno in MAIUSCOLO.\n\n"
    "STRUTTURA (usa questi titoli in MAIUSCOLO come intestazioni)\n"
    "1. SINTESI DEL POSIZIONAMENTO — 3-4 righe: chi è {nome}, chi vuole attrarre, l'obiettivo su "
    "Instagram, e dove si colloca oggi.\n"
    "2. DOVE SEI ORA — lettura di maturità del profilo (fase: da attivare / in crescita / strategico) "
    "con motivazione.\n"
    "3. ANALISI PER AREA — un paragrafo per ciascuna: Profilo & bio, Contenuti & feed, Engagement & "
    "crescita, Strategia & conversione, Monetizzazione. Per ognuna: cosa funziona e cosa manca rispetto "
    "all'obiettivo.\n"
    "4. I TUOI PUNTI DI FORZA — 2-3 leve distintive già presenti su cui costruire.\n"
    "5. COSA TI STA FRENANDO — i 2-3 nodi o occasioni mancate più costosi rispetto all'obiettivo.\n"
    "6. AZIONI PRIORITARIE — 5 azioni ordinate per impatto. Per ciascuna: prima l'azione (specifica, "
    "applicabile subito), poi su una riga separata che inizia esattamente con 'Impatto atteso:' il "
    "risultato concreto attendibile e cosa si rischia di perdere non agendo.\n"
    "7. I PROSSIMI 30 GIORNI — mini-roadmap operativa: settimana 1, poi settimane 2-4.\n"
    "8. IL PASSO SUCCESSIVO — invita {nome}, senza pressione, a un percorso con CC Elevate per la "
    "strategia Instagram completa e la sua execution.\n\n"
    "Paragrafi brevi, frasi dirette. Estensione: 600-900 parole."
)


def build_user_text(data: AuditRequest) -> str:
    d = data.model_dump()
    lines = [f"{label}: {d.get(key) or 'non indicato'}" for key, label in LABELS]
    return "Risposte al questionario:\n" + "\n".join(lines)


def _email_line(p: str) -> str:
    raw = re.sub(r'^\s*#+\s*', '', p.replace("**", "").replace("`", "")).strip()
    if re.fullmatch(r'[-–—\s]*', raw):
        return ""
    text = html_lib.escape(raw)
    low = text.lower()
    if low.startswith("impatto atteso"):
        return (
            "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' "
            "style='margin:0 0 18px'><tr>"
            "<td style='border-left:3px solid #D4AF37;background:#141414;padding:12px 16px;"
            "font-family:Arial,sans-serif;font-size:14px;line-height:1.55;color:#cccccc'>"
            f"<span style='display:block;letter-spacing:2px;font-size:10px;text-transform:uppercase;"
            f"color:#D4AF37;margin-bottom:6px'>Impatto atteso</span>{text.split(':', 1)[-1].strip()}"
            "</td></tr></table>"
        )
    if len(text) > 3 and text == text.upper():
        return f"<h2 style='font-size:16px;color:#ffffff;margin:26px 0 12px'>{text}</h2>"
    return f"<p style='margin:0 0 14px;line-height:1.6;color:#cccccc;font-size:15px'>{text}</p>"


def report_to_html(nome: str, report: str) -> str:
    body = "".join(_email_line(p) for p in report.split("\n") if p.strip())
    return f"""<div style="font-family:Arial,Helvetica,sans-serif;background:#000000;padding:32px 0">
<div style="max-width:620px;margin:0 auto;background:#0A0A0A;padding:36px;border:1px solid #333333">
<p style="letter-spacing:3px;font-size:11px;color:#D4AF37;margin:0 0 20px;text-transform:uppercase;font-weight:bold">CC Elevate — Instagram Audit</p>
<h1 style="font-size:24px;color:#ffffff;margin:0 0 8px">Il tuo Instagram Audit</h1>
<p style="color:#888888;font-size:14px;margin:0 0 24px">Ciao {html_lib.escape(nome)}, ecco il tuo audit personalizzato.</p>
{body}
<p style="margin:30px 0 0"><a href="{PUBLIC_APP_URL}/deep-audit" style="display:inline-block;background:#D4AF37;color:#000000;text-decoration:none;padding:12px 22px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold">Prenota una consulenza</a></p>
<p style="margin:28px 0 0;font-size:12px;color:#888888;line-height:1.5">Se questa email è finita nello spam, spostala in posta in arrivo per non perdere i prossimi contenuti.</p>
<p style="margin-top:20px;font-size:12px;color:#666666;text-align:center;letter-spacing:1px">CC-ELEVATE.COM &nbsp;&middot;&nbsp; &copy; 2026 CC ELEVATE</p>
</div></div>"""


def lead_to_html(data: AuditRequest, report: str) -> str:
    d = data.model_dump()
    rows = "".join(
        f"<tr><td style='padding:6px 10px;border:1px solid #ddd;font-weight:bold;width:38%'>{label}</td>"
        f"<td style='padding:6px 10px;border:1px solid #ddd'>{html_lib.escape(str(d.get(key) or '-'))}</td></tr>"
        for key, label in LABELS
    )
    newsletter = "Sì" if d.get("marketing_accepted") else "No"
    return f"""<div style="font-family:Arial,sans-serif;color:#222">
<h2>Nuovo lead Instagram Audit</h2>
<p><b>Nome:</b> {html_lib.escape(d['nome'])}<br><b>Email:</b> {html_lib.escape(d['email'])}<br><b>Newsletter:</b> {newsletter}</p>
<table style="border-collapse:collapse;font-size:13px;width:100%">{rows}</table>
<h3>Report generato</h3>
<pre style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:13px">{html_lib.escape(report)}</pre>
</div>"""


async def send_email(to: str, subject: str, html: str):
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL, "to": [to], "subject": subject, "html": html,
        })
        return True
    except Exception as e:
        logger.error(f"Resend failed for {to}: {e}")
        return False


@api_router.get("/")
async def root():
    return {"message": "CC Elevate Instagram Audit API"}


@api_router.post("/audit")
async def create_audit(data: AuditRequest):
    if not data.privacy_accepted:
        raise HTTPException(status_code=400, detail="Devi accettare la Privacy Policy")

    client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)

    try:
        message = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=SYSTEM_TEMPLATE.format(nome=data.nome),
            messages=[{"role": "user", "content": build_user_text(data)}],
        )
        report = message.content[0].text
    except Exception as e:
        logger.error(f"Anthropic error: {e}")
        raise HTTPException(status_code=502, detail="Generazione del report non riuscita. Riprova.")

    report = report if isinstance(report, str) else str(report)

    sent_user = await send_email(data.email, "Il tuo Instagram Audit - CC Elevate",
                                report_to_html(data.nome, report))
    sent_admin = await send_email(NOTIFY_EMAIL, f"Nuovo lead Instagram Audit: {data.nome}",
                                  lead_to_html(data, report))

    lead = Lead(answers=data.model_dump(), report=report, emails_sent=bool(sent_user and sent_admin))
    await db.leads.insert_one(lead.model_dump())

    if data.marketing_accepted:
        asyncio.create_task(hubspot_sync_lead(
            str(data.email), "Instagram Audit",
            {"firstname": data.nome},
        ))

    return {"id": lead.id, "report": report, "email_sent": sent_user}


@api_router.post("/admin/login")
async def admin_login(payload: dict):
    if payload.get("password") != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Password non valida")
    return {"ok": True}


@api_router.get("/admin/leads")
async def admin_leads(x_admin_password: str = Header(None)):
    if x_admin_password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Non autorizzato")
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return leads


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
