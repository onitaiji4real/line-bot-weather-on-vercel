const express = require("express");
const { client, middleware } = require("@line/bot-sdk");
const app = express();

//Line Bot configuration
const config = {
  channalAccessToken: "CHANNEL_ACCESS_TOKEN",
  channalSecret: "CHANNEL_SECRET",
};

//Create a new line client
const client = new Client(config);

//Middleware for validating request from line platform
app.use(middleware(config));

app.post("/webhook", (req, res) => {
  Promise.all(req.body.event.map(handleEvent)).then((result) =>
    res.json(result).catch((err) => {
      console.error(err);
      res.status(500).end();
    })
  );
});

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text")
    return Promise.resolve(null);

  //create a response message
  const echo = {
    type: "text",
    text: event.message.text,
  };

  //use line client to reply to the user
  return client.replyMessage(event.replyToken, echo);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
