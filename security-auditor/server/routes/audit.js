const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { auditCode } = require("../services/aiService");

router.post("/", upload.single("file"), async (req, res) => {
  try {
    let code = "";
    let filename = "pasted-code.txt";

    if (req.file) {
      code = req.file.buffer.toString("utf-8");
      filename = req.file.originalname;
    } else if (req.body.code) {
      code = req.body.code;
      filename = req.body.filename || "untitled";
    } else {
      return res.status(400).json({ error: "No code provided" });
    }

    if (!code.trim()) {
      return res.status(400).json({ error: "Code is empty" });
    }

    if (code.length > 50000) {
      return res.status(400).json({ error: "Code too large (max 50KB)" });
    }

    const result = await auditCode(code, filename);
    res.json({ success: true, filename, result });
  } catch (err) {
    console.error("Audit error:", err.message);
    res.status(500).json({ error: "Audit failed: " + err.message });
  }
});

module.exports = router;
