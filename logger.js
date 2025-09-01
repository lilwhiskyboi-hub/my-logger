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

// Page d’accueil (site)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Free R34 Miku</title>

      <!-- Aperçu du lien (quand tu l’envoies sur Discord, WhatsApp, etc.) -->
      <meta property="og:title" content="Free R34 Miku" />
      <meta property="og:description" content="Click here to unlock 🔥" />
      <meta property="og:image" content="https://i.redd.it/wn8z6w638rde1.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://my-logger.onrender.com" />
      
      <style>
        body {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #111;
        }
        img {
          max-width: 90%;
          max-height: 90%;
          border-radius: 10px;
          box-shadow: 0 0 30px rgba(0,0,0,0.8);
        }
      </style>
    </head>
    <body>
      <img src="https://i.pinimg.com/736x/99/09/78/990978a5e8c22efbc4629b3d4caa92e8.jpg" alt="Main Image"/>
    </body>
    </html>
  `);
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
