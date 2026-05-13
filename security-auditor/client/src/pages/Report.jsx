import jsPDF from "jspdf";
import { useState } from "react";
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import FindingCard from "../components/FindingCard";
import styles from "./Report.module.css";

const SEVERITY_ORDER = ["Critical", "High", "Medium", "Low", "Info"];
const SEVERITY_COLORS = {
  Critical: "var(--critical)",
  High: "var(--high)",
  Medium: "var(--medium)",
  Low: "var(--low)",
  Info: "var(--info)",
};

function getRiskLabel(score) {
  if (score >= 80) return { label: "Critical Risk", color: "var(--critical)" };
  if (score >= 60) return { label: "High Risk", color: "var(--high)" };
  if (score >= 40) return { label: "Medium Risk", color: "var(--medium)" };
  if (score >= 20) return { label: "Low Risk", color: "var(--low)" };
  return { label: "Minimal Risk", color: "var(--accent)" };
}

export default function Report({ report, onBack }) {
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const findings = report.findings || [];
  const { label: riskLabel, color: riskColor } = getRiskLabel(report.riskScore || 0);

  const counts = SEVERITY_ORDER.reduce((acc, s) => {
    acc[s] = findings.filter((f) => f.severity === s).length;
    return acc;
  }, {});

  const pieData = SEVERITY_ORDER.filter((s) => counts[s] > 0).map((s) => ({
    name: s,
    value: counts[s],
    color: SEVERITY_COLORS[s],
  }));

  const filtered = filter === "All" ? findings : findings.filter((f) => f.severity === filter);
  const sorted = [...filtered].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );
  const handleExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Security Audit Report", 14, y);
    y += 8;

    doc.setDrawColor(0, 0, 0);
    doc.line(14, y, pageWidth - 14, y);
    y += 8;

    // Meta
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`File: ${report.filename || "unknown"}`, 14, y);
    doc.text(`Language: ${report.language || "unknown"}`, 14, y + 6);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, y + 12);
    doc.text(`Risk Score: ${report.riskScore}/100 — ${riskLabel}`, 14, y + 18);
    y += 30;

    // Summary
    doc.line(14, y, pageWidth - 14, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Summary", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(report.summary || "", pageWidth - 28);
    doc.text(summaryLines, 14, y);
    y += summaryLines.length * 5 + 10;

    // Findings
    doc.line(14, y, pageWidth - 14, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Findings (${findings.length} total)`, 14, y);
    y += 8;

    findings.forEach((f, i) => {
      if (y > 255) { doc.addPage(); y = 20; }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${i + 1}. ${f.title} [${f.severity}]`, 14, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`${f.owasp}${f.line ? `   |   Line: ${f.line}` : ""}`, 14, y);
      y += 6;

      const descLines = doc.splitTextToSize(`Description: ${f.description}`, pageWidth - 28);
      doc.text(descLines, 14, y);
      y += descLines.length * 4 + 4;

      const fixLines = doc.splitTextToSize(`Fix: ${f.fix}`, pageWidth - 28);
      doc.text(fixLines, 14, y);
      y += fixLines.length * 4 + 4;

      doc.text(`Reference: ${f.reference}`, 14, y);
      y += 4;

      doc.setDrawColor(180, 180, 180);
      doc.line(14, y + 2, pageWidth - 14, y + 2);
      y += 10;
    });

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(`SecureScope — OWASP Security Audit`, 14, 290);
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - 14, 290, { align: "right" });
    }

    doc.save(`securescope-report-${Date.now()}.pdf`);
  };
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>← new audit</button>
        <div className={styles.logo}>
          <span style={{ color: "var(--accent)" }}>⬡</span>
          <span className={styles.logoText}>SecureScope</span>
        </div>
        <button className={styles.exportBtn} onClick={handleExport}>EXPORT PDF ↓</button>
      </header>

      <main className={styles.main}>
        <div className={styles.topRow}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreLabel}>risk score</div>
            <div className={styles.scoreValue} style={{ color: riskColor }}>
              {report.riskScore}
              <span className={styles.scoreMax}>/100</span>
            </div>
            <div className={styles.riskLabel} style={{ color: riskColor }}>{riskLabel}</div>
            <div className={styles.scoreMeta}>
              <span>{report.language || "unknown"}</span>
              <span className={styles.dot}>·</span>
              <span>{findings.length} finding{findings.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardLabel}>assessment</div>
            <p className={styles.summaryText}>{report.summary}</p>

            <div className={styles.severityCounts}>
              {SEVERITY_ORDER.map((s) => counts[s] > 0 && (
                <div
                  key={s}
                  className={`${styles.severityChip} ${filter === s ? styles.active : ""}`}
                  style={{ "--chip-color": SEVERITY_COLORS[s] }}
                  onClick={() => setFilter(filter === s ? "All" : s)}
                >
                  <span className={styles.chipDot} />
                  <span>{counts[s]}</span>
                  <span className={styles.chipLabel}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {pieData.length > 0 && (
            <div className={styles.chartCard}>
              <div className={styles.cardLabel}>breakdown</div>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      fontSize: 12,
                      fontFamily: "DM Mono, monospace",
                    }}
                    itemStyle={{ color: "var(--text)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.legendRow}>
                {pieData.map((d) => (
                  <span key={d.name} style={{ color: d.color, fontSize: 11 }}>
                    ● {d.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.findingsSection}>
          <div className={styles.findingsHeader}>
            <span className={styles.findingsTitle}>
              {filter === "All" ? "all findings" : `${filter.toLowerCase()} findings`}
            </span>
            <div className={styles.filterRow}>
              {["All", ...SEVERITY_ORDER.filter((s) => counts[s] > 0)].map((s) => (
                <button
                  key={s}
                  className={`${styles.filterBtn} ${filter === s ? styles.filterActive : ""}`}
                  onClick={() => setFilter(s)}
                  style={filter === s && s !== "All" ? { borderColor: SEVERITY_COLORS[s], color: SEVERITY_COLORS[s] } : {}}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className={styles.empty}>
              {findings.length === 0
                ? "✓ No security issues found. Code looks clean!"
                : `No ${filter} severity findings.`}
            </div>
          ) : (
            <div className={styles.findingsList}>
              {sorted.map((f) => (
                <FindingCard
                  key={f.id}
                  finding={f}
                  expanded={expanded === f.id}
                  onToggle={() => setExpanded(expanded === f.id ? null : f.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
