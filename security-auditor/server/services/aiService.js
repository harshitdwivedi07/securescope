const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert security auditor specializing in OWASP Top 10 vulnerabilities.
Analyze the provided code and return ONLY a JSON object — no markdown, no explanation outside the JSON.
{
  "language": "detected language",
  "summary": "2-3 sentence overall security assessment",
  "riskScore": <number 0-100, higher = more risky>,
  "findings": [
    {
      "id": "FIND-001",
      "type": "vulnerability type",
      "owasp": "e.g. A03:2021 - Injection",
      "severity": "Critical | High | Medium | Low | Info",
      "line": <line number or null>,
      "title": "short title",
      "description": "what it is and why it is dangerous",
      "vulnerable_code": "the vulnerable snippet",
      "fix": "how to fix it with example",
      "reference": "https://owasp.org/..."
    }
  ]
}
Return ONLY raw JSON. No markdown. No extra text.`;

async function auditCode(code, filename) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Audit this code.\nFilename: ${filename}\n\n${code}` }
    ],
    max_tokens: 4096,
  });

  const raw = response.choices[0].message.content;
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

module.exports = { auditCode };