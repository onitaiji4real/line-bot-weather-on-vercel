require("dotenv").config();
const express = require("express");
const { Client, middleware } = require("@line/bot-sdk");
const helloTestRouter = require("./routes/hello");
const app = express();

app.use(express.json());

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
  res.status(200).end(); // 回傳 200 OK 給 Line 平台
});

// Test route for make sure server is live
app.use("/hello", helloTestRouter);

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  try {
    // Create a response message
    const echo = { type: "text", text: event.message.text };

    // Use Line client to reply to the user
    await client.replyMessage(event.replyToken, echo);
  } catch (err) {
    console.error("Error handling event:", err);
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
