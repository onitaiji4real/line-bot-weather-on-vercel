"use strict";
require("dotenv").config();
const line = require("@line/bot-sdk");
const express = require("express");
const helloRouter = require("./routes/hello");

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

const app = express();

app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status.end();
    });
});

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text")
    return Promise.resolve(null);

  const echo = { type: "text", text: event.message.text };

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
}

//for test
app.use("/hello", helloRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
