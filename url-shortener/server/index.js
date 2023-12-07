const express = require("express");
const mongoose = require("mongoose");
const { object, string, url, date, InferType } = require("yup");
const { nanoid } = require("nanoid");

mongoose.connect("mongodb://localhost/url-shortener");

const UrlSchema = mongoose.Schema({
  url: String,
  slug: String,
});

const Url = new mongoose.model("urls", UrlSchema);

const morgan = require("morgan");

const app = express();
app.enable("trust proxy");

app.use(express.static("./public"));
app.use(express.json());
app.use(morgan("tiny"));

const urlSchema = object({
  url: string().trim().url().required(),
  slug: string()
    .trim()
    .matches(/^[\w\-]+$/i),
});

app.post("/url", async (req, res) => {
  console.log(req.body);
  let { url, slug } = req.body;
  console.log(url, slug);
  try {
    console.log(url, slug);
    await urlSchema.validate({ url, slug });

    if (slug === "") {
      slug = nanoid(5);
    }

    const url = new Url({ url, slug });

    res.json({
      msg: "OK",
      slug,
      url,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: e,
    });
  }
});

app.get("/:slug", (req, res) => {
  const { slug } = req.params;

  const url = Url.find({ slug });

  if (url !== null) {
    res.redirect(url.url);
  }
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
