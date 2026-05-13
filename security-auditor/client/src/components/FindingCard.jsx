import styles from "./FindingCard.module.css";

const SEVERITY_COLORS = {
  Critical: "var(--critical)",
  High: "var(--high)",
  Medium: "var(--medium)",
  Low: "var(--low)",
  Info: "var(--info)",
};

const SEVERITY_BG = {
  Critical: "var(--critical-bg)",
  High: "var(--high-bg)",
  Medium: "var(--medium-bg)",
  Low: "var(--low-bg)",
  Info: "var(--info-bg)",
};

export default function FindingCard({ finding, expanded, onToggle }) {
  const color = SEVERITY_COLORS[finding.severity] || "var(--info)";
  const bg = SEVERITY_BG[finding.severity] || "var(--info-bg)";

  return (
    <div
      className={`${styles.card} ${expanded ? styles.expanded : ""}`}
      style={{ "--f-color": color, "--f-bg": bg }}
    >
      <button className={styles.header} onClick={onToggle}>
        <div className={styles.headerLeft}>
          <span className={styles.severityBadge}>{finding.severity}</span>
          <div className={styles.titleGroup}>
            <span className={styles.title}>{finding.title}</span>
            <span className={styles.owasp}>{finding.owasp}</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          {finding.line && (
            <span className={styles.lineTag}>line {finding.line}</span>
          )}
          <span className={styles.findingId}>{finding.id}</span>
          <span className={styles.chevron}>{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.sectionLabel}>description</div>
            <p className={styles.sectionText}>{finding.description}</p>
          </div>

          {finding.vulnerable_code && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>vulnerable code</div>
              <pre className={`${styles.codeBlock} ${styles.vulnerable}`}>
                <code>{finding.vulnerable_code}</code>
              </pre>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionLabel}>recommended fix</div>
            <p className={styles.sectionText}>{finding.fix}</p>
          </div>

          {finding.reference && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>reference</div>
              <a
                href={finding.reference}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.refLink}
              >
                {finding.reference} ↗
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
