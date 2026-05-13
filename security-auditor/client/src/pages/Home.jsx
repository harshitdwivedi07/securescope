import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import styles from "./Home.module.css";

const API = import.meta.env.VITE_API_URL || "";

const SAMPLE = `// Sample vulnerable Node.js code
const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',      // hardcoded credential
  database: 'users'
});

app.get('/user', (req, res) => {
  const id = req.query.id;
  // SQL Injection vulnerability
  const query = \`SELECT * FROM users WHERE id = \${id}\`;
  db.query(query, (err, results) => {
    res.json(results);
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // XSS vulnerability — reflecting unsanitized input
  res.send(\`<h1>Welcome \${username}</h1>\`);
});

app.listen(3000);`;

export default function Home({ onReport }) {
  const [code, setCode] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target.result);
      setFilename(file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Please paste some code or upload a file.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/audit`, { code, filename });
      onReport({ ...data.result, filename: data.filename });
    } catch (e) {
      setError(e.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.logo}>SECURESCOPE</div>
        <div className={styles.version}>// v1.0.0 · OWASP AUDITOR</div>
      </div>

      <main className={styles.main}>
        <div className={styles.editorCard}>
          <div className={styles.editorHeader}>
            <span className={styles.filenameTag}>{filename}</span>
            <div className={styles.editorActions}>
              <button className={styles.ghostBtn}
                onClick={() => { setCode(SAMPLE); setFilename("exploit.js"); }}>
                load sample
              </button>
              <button className={styles.ghostBtn} onClick={() => fileRef.current.click()}>
                upload
              </button>
              <input ref={fileRef} type="file"
                accept=".js,.ts,.jsx,.tsx,.py,.php,.java,.go,.rb,.cs,.cpp,.c,.sql,.sh,.bash,.yaml,.yml,.env"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          </div>

          <div className={`${styles.editorWrap} ${dragOver ? styles.dragOver : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
            {dragOver && <div className={styles.dropOverlay}>drop file to load</div>}
            <Editor
              height="340px"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              beforeMount={(monaco) => {
                monaco.editor.defineTheme("securescope", {
                  base: "vs-dark",
                  inherit: true,
                  rules: [
                    { token: "", foreground: "e8d0d0", background: "0d0000" },
                    { token: "comment", foreground: "5a2020", fontStyle: "italic" },
                    { token: "string", foreground: "ff6b6b" },
                    { token: "number", foreground: "ff8800" },
                    { token: "keyword", foreground: "ff2020" },
                    { token: "identifier", foreground: "cc8888" },
                  ],
                  colors: {
                    "editor.background": "#0d0000",
                    "editor.foreground": "#e8d0d0",
                    "editor.lineHighlightBackground": "#1a0000",
                    "editor.selectionBackground": "#3a0000",
                    "editorLineNumber.foreground": "#3a1515",
                    "editorLineNumber.activeForeground": "#7a4040",
                    "editorCursor.foreground": "#ff1a1a",
                    "editor.findMatchBackground": "#ff1a1a44",
                    "editorGutter.background": "#0d0000",
                    "scrollbarSlider.background": "#2a0a0a",
                    "scrollbarSlider.hoverBackground": "#4a1010",
                  },
                });
              }}
              onMount={(editor) => editor.updateOptions({ theme: "securescope" })}
              options={{
                fontSize: 13,
                fontFamily: "Share Tech Mono, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbersMinChars: 3,
              }}
            />
          </div>

          {error && <p className={styles.error}>// ⚠ {error}</p>}

          <div className={styles.footer}>
            <span className={styles.hint}>// supports js, ts, python, php, java, go, sql, bash, yaml and more</span>
            <button className={styles.auditBtn} onClick={handleSubmit} disabled={loading}>
              {loading ? <><span className={styles.spinner} />AUDITING...</> : <>RUN AUDIT →</>}
            </button>
          </div>
        </div>

        <div className={styles.owaspBadges}>
          {["A01 Broken Access", "A02 Crypto Failures", "A03 Injection", "A04 Insecure Design",
            "A05 Misconfig", "A06 Outdated Components", "A07 Auth Failures",
            "A08 Integrity Failures", "A09 Logging Gaps", "A10 SSRF"].map((label, i) => (
              <span key={i} className={styles.badge}>{label}</span>
            ))}
        </div>
      </main>
    </div>
  );
}