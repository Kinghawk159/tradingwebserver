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
