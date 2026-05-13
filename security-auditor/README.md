# ⬡ SecureScope — AI Security Code Auditor

An AI-powered security auditor that analyzes code for OWASP Top 10 vulnerabilities and generates structured penetration-testing-style reports.

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Monaco Editor |
| Backend | Node.js + Express |
| AI | Anthropic Claude (claude-sonnet) |
| Charts | Recharts |
| Deploy (Frontend) | Vercel |
| Deploy (Backend) | Render |

---

## 📁 Project Structure

```
security-auditor/
├── client/         # React frontend
└── server/         # Node.js + Express backend
```

---

## 🚀 Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/security-auditor.git
cd security-auditor
```

### 2. Setup the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
CLIENT_URL=http://localhost:5173
PORT=5000
```

Start the server:
```bash
npm run dev
```

### 3. Setup the frontend

```bash
cd ../client
npm install
cp .env.example .env
```

`.env` should contain:
```
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ☁️ Deployment (Free)

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo, select the `server/` folder as root
4. Set environment variables:
   - `ANTHROPIC_API_KEY` = your key
   - `CLIENT_URL` = your Vercel frontend URL (add after frontend deploy)
5. Build command: `npm install`
6. Start command: `node index.js`
7. Deploy → copy the Render URL (e.g. `https://security-auditor.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set root directory to `client/`
3. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
4. Deploy → done!

> ⚠️ Render free tier spins down after 15 min inactivity. First request may take ~30s to wake up.

---

## ✨ Features

- **Monaco Editor** — VS Code-like code editor in the browser
- **File Upload** — drag & drop or upload `.js`, `.py`, `.php`, `.sql`, `.sh`, `.yaml` and more
- **AI Audit** — Claude analyzes for OWASP Top 10 vulnerabilities
- **Structured Report** — severity levels (Critical / High / Medium / Low / Info)
- **Risk Score** — 0-100 overall risk rating
- **Pie Chart** — visual breakdown by severity
- **Export** — download report as `.txt`
- **Sample Code** — load a pre-built vulnerable example to demo instantly

---

## 🔒 OWASP Coverage

- A01 Broken Access Control
- A02 Cryptographic Failures
- A03 Injection (SQL, XSS, Command)
- A04 Insecure Design
- A05 Security Misconfiguration
- A06 Vulnerable & Outdated Components
- A07 Identification & Authentication Failures
- A08 Software & Data Integrity Failures
- A09 Security Logging & Monitoring Failures
- A10 Server-Side Request Forgery (SSRF)

---

## 📸 How It Works

1. Paste code or upload a file
2. Click **run security audit**
3. Claude analyzes the code and returns structured JSON findings
4. UI renders a full report with severity breakdown, inline code snippets, and fix suggestions
