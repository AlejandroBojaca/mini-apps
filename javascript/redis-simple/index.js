const express = require("express");
const { createClient } = require("redis");
const path = require("path");

const app = express();
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", async (req, res) => {
  const { value } = req.body;
  const client = createClient();
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();

  await client.set(value, 1);
  await client.disconnect();
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/check", async (req, res) => {
  const { value } = req.body;
  const client = createClient();
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();

  const isInCache = await client.get(value);
  if (isInCache) {
    res.send("<h2>Value is in cache<h2>");
  } else {
    res.send("<h2>Value is not in cache<h2>");
  }
});

app.listen(3000, () => console.log("Listening on port 3000"));
