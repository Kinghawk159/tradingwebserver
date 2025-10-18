import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TradingView Webhook Server is Running ✅");
});

app.post("/webhook", (req, res) => {
  console.log("Alert received:", req.body);

  const { signal, ticker, price } = req.body;

  if (signal === "buy") {
    console.log(`Simulated BUY for ${ticker} at ${price}`);
  } else if (signal === "sell") {
    console.log(`Simulated SELL for ${ticker} at ${price}`);
  } else {
    console.log("Unknown signal:", signal);
  }

  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("Alert received:", req.body);

  const { signal, ticker, price } = req.body;
  if (signal === "buy") console.log(`Simulated BUY for ${ticker} at ${price}`);
  else if (signal === "sell") console.log(`Simulated SELL for ${ticker} at ${price}`);
  else if (signal === "ping") console.log("Ping received from TradingView");

  res.status(200).send("OK");
});

// Self-ping every 14 minutes to keep Render alive
setInterval(async () => {
  try {
    const res = await fetch("https://tradingwebserver.onrender.com/");
    console.log("Self-ping sent:", res.status);
  } catch (err) {
    console.error("Self-ping failed:", err.message);
  }
}, 10 * 60 * 1000);

app.get("/", (req, res) => res.send("Server is alive ✅"));

app.listen(3000, () => console.log("Webhook listening on port 3000"));
