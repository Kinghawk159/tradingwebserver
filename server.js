// server.js
import express from "express";
import fetch from "node-fetch"; // Make sure it's in package.json dependencies

const app = express();
app.use(express.json());

// === WEBHOOK ENDPOINT ===
app.post("/webhook", (req, res) => {
  console.log("Alert received:", req.body);

  const { signal, ticker, price } = req.body;

  if (signal === "buy") {
    console.log(`🟢 Simulated BUY for ${ticker} at ${price}`);
  } else if (signal === "sell") {
    console.log(`🔴 Simulated SELL for ${ticker} at ${price}`);
  } else if (signal === "ping") {
    console.log("📡 Heartbeat ping received from TradingView");
  } else {
    console.log("⚠️ Unknown signal received:", req.body);
  }

  res.status(200).send("OK");
});

// === HEALTH ENDPOINT ===
app.get("/", (req, res) => {
  res.send("✅ Trading Webhook Server is alive and running.");
});

// === SELF-PING EVERY 14 MINUTES ===
const SELF_PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in ms
setInterval(async () => {
  try {
    const response = await fetch("https://tradingwebserver.onrender.com/");
    console.log("🔁 Self-ping sent:", response.status);
  } catch (err) {
    console.error("❌ Self-ping failed:", err.message);
  }
}, SELF_PING_INTERVAL);

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook listening on port ${PORT}`));
