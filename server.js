import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Support both JSON and plain text alerts
app.use(express.text({ type: "*/*" }));
app.use(express.json());

// --- Webhook endpoint ---
app.post("/webhook", async (req, res) => {
  try {
    let data = req.body;

    // Parse JSON if sent as string
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        data = { signal: data.trim() };
      }
    }

    console.log("Alert received:", data);

    const { signal, ticker, price } = data;

    if (!signal) {
      console.log("⚠️ Unknown signal received:", data);
      return res.status(400).send("Invalid alert format");
    }

    // --- Example trading logic ---
    if (signal.toLowerCase() === "buy") {
      console.log(`🟢 BUY signal received for ${ticker || "unknown"} at ${price || "?"}`);
      // TODO: Add actual trade logic here
    } else if (signal.toLowerCase() === "sell") {
      console.log(`🔴 SELL signal received for ${ticker || "unknown"} at ${price || "?"}`);
      // TODO: Add actual trade logic here
    } else {
      console.log("⚠️ Unknown signal:", signal);
    }

    res.status(200).send("Alert processed");
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    res.status(500).send("Server error");
  }
});

// --- Keep server alive (Render self-ping) ---
setInterval(async () => {
  try {
    const response = await fetch("https://tradingwebserver.onrender.com");
    console.log("🔁 Self-ping sent:", response.status);
  } catch (err) {
    console.error("❌ Self-ping failed:", err.message);
  }
}, 14 * 60 * 1000); // every 14 minutes

// --- Root route ---
app.get("/", (req, res) => {
  res.send("TradingView Webhook Server is running ✅");
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
