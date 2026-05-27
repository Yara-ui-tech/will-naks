import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory Email registry to view sent emails in real-time inside the Admin panel
interface EmailLog {
  id: string;
  timestamp: string;
  to: string;
  subject: string;
  html: string;
  status: "delivered" | "failed" | "simulated";
  error?: string;
}

const emailLogs: EmailLog[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add standard JSON parsing middleware
  app.use(express.json());

  // Dedicated health check endpoint for proxy / platform pings
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Fetch full email logs registry
  app.get("/api/logs/emails", (req, res) => {
    res.status(200).json(emailLogs);
  });

  // Post new receipt email dispatch requests
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: "Missing required fields (to, subject, html)" });
    }

    const logId = "EML-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const timestamp = new Date().toISOString();
    let status: "delivered" | "failed" | "simulated" = "simulated";
    let deliveryError: string | undefined = undefined;

    // Standard high-performance Resend integration if API key is provided
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const fromEmail = process.env.EMAIL_FROM || "Will-Naks Foundation <info@will-naksfoundation.org>";
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [to],
            subject: subject,
            html: html
          })
        });

        if (response.ok) {
          status = "delivered";
          console.log(`[Email Service] Live email successfully dispatched to ${to} via Resend.`);
        } else {
          status = "failed";
          deliveryError = await response.text();
          console.error(`[Email Service] Resend API error: ${deliveryError}`);
        }
      } catch (err: any) {
        status = "failed";
        deliveryError = err.message || String(err);
        console.error(`[Email Service] Network or runtime error sending email: ${deliveryError}`);
      }
    } else {
      console.log(`[Email Service] Simulated email logged: To: ${to}, Subject: "${subject}". Run with RESEND_API_KEY in security settings to trigger live inbox delivery.`);
    }

    const logEntry: EmailLog = {
      id: logId,
      timestamp,
      to,
      subject,
      html,
      status,
      error: deliveryError
    };

    emailLogs.unshift(logEntry);
    res.status(200).json({ success: status !== "failed", log: logEntry });
  });

  // Vite middleware for development (or as a fallback if the built files are missing)
  const distPath = path.join(process.cwd(), "dist");
  const hasBuild = fs.existsSync(path.join(distPath, "index.html"));
  const isProd = process.env.NODE_ENV === "production" && hasBuild;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for general requests/pings that escape the normal Vite SPA filter
    app.get("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const htmlPath = path.resolve(process.cwd(), "index.html");
        if (fs.existsSync(htmlPath)) {
          let html = fs.readFileSync(htmlPath, "utf-8");
          // Compile and transform Vite components/scripts
          html = await vite.transformIndexHtml(url, html);
          res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } else {
          res.status(404).send("index.html not found");
        }
      } catch (e) {
        next(e);
      }
    });
  } else {
    // Serve static files in production
    app.use(express.static(distPath));
    
    // SPA fallback: send index.html for all non-file requests
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
