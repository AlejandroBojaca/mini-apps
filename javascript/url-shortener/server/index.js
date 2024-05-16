const express = require("express");
const morgan = require("morgan");
const yup = require("yup");
const { nanoid } = require("nanoid");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/url_shortener");
const app = express();

app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(express.json());

const urlValidationSchema = yup.object({
  url: yup.string().url().required(),
  slug: yup.string().matches(/^[\w\-]+$/i),
});

const urlSchema = mongoose.Schema({
  url: { type: String, required: true },
  slug: { type: String, required: true },
});

const Url = mongoose.model("urls", urlSchema);

app.post("/url", async (req, res, next) => {
  let { slug, url } = req.body;

  try {
    await urlValidationSchema.validate({ slug, url });

    if (slug === "") {
      slug = nanoid(5);
    }

    const newUrl = new Url({ slug, url });
    newUrl.save();

    res.json({
      slug,
      url,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/:id", async (req, res, next) => {
  const { id: slug } = req.params;
  const url = await Url.findOne({ slug });
  if (url !== null) {
    res.redirect(url.url);
  } else {
    next(new Error("No such slug found"));
  }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: error.stack,
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
