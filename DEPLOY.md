# CC Elevate — Instagram Audit · Guida al deploy

App a stack proprietario: **Netlify** (frontend React) + **Render** (backend FastAPI) + **MongoDB Atlas** (database).
Audit generato dall'AI di **Anthropic** (Claude). Stesso metodo delle altre app CC Elevate.

## 0. GitHub
1. Crea un repo privato **`cc-elevate-instagram-audit`** nell'org `carmelacarullibi-tech`.
2. Da questa cartella:
   ```
   git init
   git add .
   git commit -m "Instagram Audit — versione iniziale"
   git branch -M main
   git remote add origin https://github.com/carmelacarullibi-tech/cc-elevate-instagram-audit.git
   git push -u origin main
   ```
   (La cartella `_to_delete/` puoi cancellarla: contiene i residui rimossi dalla duplicazione.)

## 1. Backend su Render
- New → **Web Service** → collega il repo → **Root Directory: `backend`**
- Build: `pip install -r requirements.txt` · Start: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- Variabili d'ambiente (vedi `backend/.env.example`):
  - `MONGO_URL` = stessa stringa delle altre app (utente `quiz_leader_user`)
  - `DB_NAME` = **`cc_instagram_audit`** (nuovo, separa i dati dalle altre app)
  - `ANTHROPIC_API_KEY` = la tua chiave Anthropic (pay-per-use)
  - `RESEND_API_KEY`, `SENDER_EMAIL` = `CC Elevate <noreply@notifiche.cc-elevate.com>`, `NOTIFY_EMAIL` = `sales@cc-elevate.com`
  - `ADMIN_PASSWORD` = una password a tua scelta (per la dashboard `/admin`)
  - `PUBLIC_APP_URL` = `https://instagram-audit.cc-elevate.com`
  - `CORS_ORIGINS` = `https://instagram-audit.cc-elevate.com` (+ l'URL Netlify durante i test)
- Deploy → verifica che `https://<servizio>.onrender.com/api/` risponda.

## 2. Frontend su Netlify
- New site → collega il repo → **Base directory: `frontend`** (build e publish sono già in `netlify.toml`).
- Variabile d'ambiente: `REACT_APP_BACKEND_URL` = URL del backend Render.
- Deploy.

## 3. Dominio
- Su Hostinger, CNAME `instagram-audit` → `<sito>.netlify.app`.
- Certificato HTTPS automatico via Netlify/Let's Encrypt.
- **Non toccare** i record MX/email di `cc-elevate.com`.

## 4. Verifica end-to-end
Compila l'audit → il report AI viene generato e mostrato → email ricevuta → il lead compare in `/admin`
(password = `ADMIN_PASSWORD`) → i due consensi (privacy obbligatoria, newsletter facoltativa) salvati.
