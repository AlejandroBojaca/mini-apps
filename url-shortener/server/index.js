const express = require("express");
const mongoose = require("mongoose");
const Url = require("./models/Url");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/url_shortener");

app.get("/", (req, res) => {
  console.log("HERE");
  const { shortenedUrl } = req.body;
  const resp = Url.find({ shortenedUrl });

  if (resp !== null) {
    console.log({ resp, shortenedUrl });
    res.redirect(resp.url);
  }

  res.json({
    error: "Could not find url",
  });
});

app.post("/", async (req, res) => {
  //check url
  try {
    const { url } = req.body;
    new URL(url);
    const newUrl = new Url({ url, shortenedUrl: "123" });
    await newUrl.save();
    res.redirect("/");
  } catch (e) {
    console.error(e);
    res.json({
      error: e,
    });
  }
});

app.listen(3000, () => console.log("Express server listening on port 3000"));
