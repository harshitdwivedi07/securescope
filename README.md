# SecureScope — AI-Powered OWASP Security Auditor

A security code auditing tool that analyzes code for OWASP Top 10 vulnerabilities and generates detailed reports.

##  Live Demo
[securescope-gules.vercel.app](https://securescope-gules.vercel.app)

##  Features
- AI-powered vulnerability detection using Groq
- Supports JS, TS, Python, PHP, Java, Go, SQL, Bash, YAML and more
- OWASP Top 10 vulnerability mapping
- Risk score (0-100) with severity breakdown
- Detailed findings with fix recommendations
- Export reports as PDF
- File upload or paste code directly

##  Tech Stack
**Frontend**
- React + Vite
- Monaco Editor
- CSS Modules

**Backend**
- Node.js + Express
- Groq API (LLM)

**Deployment**
- Frontend: Vercel
- Backend: Render

##  Run Locally

**Backend**
```bash
cd security-auditor/server
npm install
# create .env with GROQ_API_KEY=your_key
node index.js
```

**Frontend**
```bash
cd security-auditor/client
npm install
# create .env with VITE_API_URL=http://localhost:5000
npm run dev
```

##  Vulnerabilities Detected
- SQL Injection
- XSS (Cross-Site Scripting)
- Command Injection
- Path Traversal
- Hardcoded Credentials
- Weak Cryptography
- Insecure Deserialization
- And more...

##  License
MIT
