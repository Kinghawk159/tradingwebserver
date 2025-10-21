import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// --- Webhook endpoint ---
app.post("/webhook", (req, res) => {
  console.log("Alert received:", req.body);

  const { signal, ticker, price } = req.body;

  if (!signal) {
    console.log("⚠️ No signal in request.");
    return res.status(400).send("Missing signal");
  }

  const normalized = signal.toLowerCase();

  // --- Simulated trade logic ---
  if (normalized.includes("long") || normalized.includes("buy")) {
    console.log(`🟢 Simulated LONG / BUY trade for ${ticker || "?"} at ${price || "?"}`);
    // PLACE YOUR REAL TRADE LOGIC HERE (for example, API call to broker)
  } else if (normalized.includes("short") || normalized.includes("sell")) {
    console.log(`🔴 Simulated SHORT / SELL trade for ${ticker || "?"} at ${price || "?"}`);
    // PLACE YOUR REAL TRADE LOGIC HERE
  } else if (normalized.includes("exit") || normalized.includes("close")) {
    console.log(`⚪ Simulated EXIT trade for ${ticker || "?"} at ${price || "?"}`);
    // PLACE YOUR CLOSE LOGIC HERE
  } else {
    console.log(`⚠️ Unknown signal: ${signal}`);
  }

  res.status(200).send("OK");
});

// --- Keep-alive ping every 14 minutes to prevent Render sleep ---
const SELF_URL = "https://tradingwebserver.onrender.com";
setInterval(async () => {
  try {
    const response = await fetch(SELF_URL);
    console.log(`🔁 Self-ping sent: ${response.status}`);
  } catch (err) {
    console.error("❌ Self-ping failed:", err.message);
  }
}, 10 * 60 * 1000); // 14 minutes

app.get("/", (req, res) => {
  res.send("✅ Trading Webhook Server is running!");
});

app.listen(3000, () => console.log("🚀 Webhook listening on port 3000"));
