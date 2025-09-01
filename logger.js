const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, "visitors.log");

// Middleware pour log chaque visite
app.use((req, res, next) => {
  const logEntry = [
    `[${new Date().toISOString()}]`,
    `IP: ${req.headers["x-forwarded-for"] || req.socket.remoteAddress}`,
    `Agent: ${req.headers["user-agent"]}`,
    `URL: ${req.originalUrl}`
  ].join(" | ");

  fs.appendFileSync(LOG_FILE, logEntry + "\n");
  console.log(logEntry);
  next();
});

// Page d’accueil
app.get("/", (req, res) => {
  res.send("<h1>✅ Site en ligne</h1><p>Les visites sont loggées.</p>");
});

// Voir les logs (protégé avec un mot de passe)
app.get("/logs", (req, res) => {
  const pass = req.query.pass;
  if (pass !== "secret123") {
    return res.status(403).send("⛔ Accès refusé");
  }

  const logs = fs.readFileSync(LOG_FILE, "utf-8");
  res.type("text").send(logs);
});

app.listen(PORT, () => {
  console.log(`🚀 Logger actif sur http://localhost:${PORT}`);
});
