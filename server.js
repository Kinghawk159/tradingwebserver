import express from "express";

const app = express();
app.use(express.json());

// Webhook endpoint
app.post("/webhook", (req, res) => {
  console.log("Alert received:", req.body);

  // Simulate paper trade logic here
  const { signal, ticker, price } = req.body;
  if (signal === "buy") {
    console.log(`Simulated BUY for ${ticker} at ${price}`);
  } else if (signal === "sell") {
    console.log(`Simulated SELL for ${ticker} at ${price}`);
  }

  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook listening on port ${PORT}`));
