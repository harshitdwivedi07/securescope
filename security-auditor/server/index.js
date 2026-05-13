require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auditRoutes = require("./routes/audit");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/audit", auditRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
