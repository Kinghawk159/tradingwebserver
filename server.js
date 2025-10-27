import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Accept both JSON and text-based webhooks
app.use(express.text({ type: "*/*" }));
app.use(express.json());

// --- Webhook endpoint ---
app.post("/webhook", async (req, res) => {
  try {
    let data = req.body;

    // Parse JSON if it’s a stringified object
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        data = { signal: data.trim() };
      }
    }

    console.log("📩 Alert received:", data);

    const signal = data.signal?.toUpperCase() || "";
    const ticker = data.ticker || "UNKNOWN";
    const price = data.price || "N/A";

    if (!signal) {
      console.log("⚠️ No signal in alert:", data);
      return res.status(400).send("Invalid alert");
    }

    // === TRADE HANDLER ===
    if (signal.includes("LONG")) {
      console.log(`🟢 LONG ENTRY triggered for ${ticker} at ${price}`);
      // 👉 TODO: Place long order here
      // await executeTrade("buy", ticker, price);
    } 
    else if (signal.includes("SHORT")) {
      console.log(`🔴 SHORT ENTRY triggered for ${ticker} at ${price}`);
      // 👉 TODO: Place short order here
      // await executeTrade("sell", ticker, price);
    } 
    else if (signal.includes("EXIT")) {
      console.log(`⚪ EXIT signal triggered for ${ticker} at ${price}`);
      // 👉 TODO: Close open positions here
      // await executeTrade("close", ticker, price);
    } 
    else {
      console.log(`⚠️ Unknown signal: ${signal}`);
    }

    res.status(200).send("✅ Alert processed successfully");
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).send("Server error");
  }
});

// --- Self-ping for Render uptime ---
setInterval(async () => {
  try {
    const res = await fetch("https://tradingwebserver.onrender.com");
    console.log("🔁 Self-ping sent:", res.status);
  } catch (err) {
    console.error("❌ Self-ping failed:", err.message);
  }
}, 14 * 60 * 1000); // every 14 min

// --- Root route ---
app.get("/", (req, res) => {
  res.send("✅ TradingView Webhook Server is running.");
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
