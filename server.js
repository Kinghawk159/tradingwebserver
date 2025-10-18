// server.js
import express from "express";

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

// === SELF-PING EVERY 10 MINUTES ===
const SELF_PING_INTERVAL = 10 * 60 * 1000; // 14 minutes
setInterval(async () => {
  try {
    const res = await fetch("https://tradingwebserver.onrender.com/");
    console.log("🔁 Self-ping sent:", res.status);
  } catch (err) {
    console.error("❌ Self-ping failed:", err.message);
  }
}, SELF_PING_INTERVAL);

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook listening on port ${PORT}`));
