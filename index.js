require("dotenv").config();
const express = require("express");
const { Client, middleware } = require("@line/bot-sdk");
const helloTestRouter = require("./routes/hello");
const app = express();

// Line Bot configuration
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// Create a new line client
const client = new Client(config);

// Middleware for validating requests from Line platform
app.post("/webhook", middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// Test route for make sure server is live
app.use("/hello", helloTestRouter);

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  // Create a response message
  const echo = { type: "text", text: event.message.text };

  // Use Line client to reply to the user
  return client.replyMessage(event.replyToken, echo);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
