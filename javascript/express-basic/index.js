const path = require("node:path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const upload = multer();

mongoose.connect("mongodb://127.0.0.1:27017/test");

app = express();

app.use("/public", express.static("public"));
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
});

const ExerciseSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: Date,
});

const UrlSchema = mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);
const Url = mongoose.model("Url", UrlSchema);
const Exercise = mongoose.model("Exercise", ExerciseSchema);

app.get("/timestamp", (req, res) => {
  res.sendFile(path.join(__dirname, "views/timestamp.html"));
});

app.get("/api/date/:date?", (req, res) => {
  let { date } = req.params;

  if (!date) {
    const currentDate = new Date();
    return res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString(),
    });
  }

  if (!isNaN(Number(date))) {
    date = Number(date);
  }

  const newDate = new Date(date);
  if (newDate.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  const unixDate = newDate.getTime();
  const utcDate = newDate.toUTCString();
  res.json({ unix: unixDate, utc: utcDate });
});

app.get("/api/whoami", (req, res) => {
  const language = req.headers["accept-language"] || "no language";
  const software = req.headers["user-agent"] || "no software";
  res.json({ ipaddress: req.ip, language, software });
});

app
  .route("/api/shorturl")
  .get(async (req, res) => {
    res.sendFile(path.join(__dirname, "/views/urlShortener.html"));
  })
  .post(async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.send(401, "Add a url");
    }

    try {
      new URL(url);
    } catch (err) {
      console.log(err.message);
      return res.json({ error: "invalid url" });
    }

    const shortUrl = nanoid(5);
    const existantUrl = await Url.findOne({ originalUrl: url });
    if (existantUrl) {
      return res.json({
        original_url: existantUrl.originalUrl,
        short_url: existantUrl.shortUrl,
      });
    }

    const doc = new Url({ originalUrl: url, shortUrl });
    await doc.save();
    res.json({ original_url: url, short_url: shortUrl });
  });

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id: userId } = req.params;
  const { description, duration } = req.body;
  let { date } = req.body;
  if (!userId || !ObjectId.isValid(userId)) {
    return res.json({ error: "Add a valid id" });
  }
  if (!description || !duration) {
    return res.json({ error: "Missing fields" });
  }
  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }
  const user = await User.findById(ObjectId.createFromHexString(userId));
  if (!user) {
    return res.json({ error: "User not found" });
  }
  const exercise = new Exercise({ userId, description, duration, date });
  try {
    await exercise.save();
  } catch (err) {
    console.log(err.message);
    return res.json({ error: "Could not create exercise" });
  }

  const obj = {
    _id: user._id,
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: new Date(exercise.date).toDateString(),
  };
  res.json(obj);
});

app
  .route("/api/users")
  .get(async (req, res) => {
    const users = await User.find();
    res.json(users);
  })
  .post(async (req, res) => {
    const { username } = req.body;
    const user = new User({ username });
    try {
      await user.save();
    } catch (err) {
      console.log(err.message);
      return res.json({ error: "Internal Error" });
    }
    res.json(user);
  });

app.get("/api/shorturl/:short_url", async (req, res) => {
  const { short_url } = req.params;
  const doc = await Url.findOne({ shortUrl: short_url });
  if (!doc) {
    return res.json({ error: "Associated url not found" });
  }
  res.redirect(doc.originalUrl);
});

app.get("/api/tracker", (req, res) => {
  res.sendFile(path.join(__dirname, "views/excerciseTracker.html"));
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id: userId } = req.params;
  const { from, to, limit } = req.query;
  if (!userId || !ObjectId.isValid(userId)) {
    return res.json({ error: "Add a valid id" });
  }
  const user = await User.findById(ObjectId.createFromHexString(userId));
  if (!user) {
    return res.json({ error: "User not found" });
  }
  const query = Exercise.find({
    userId: ObjectId.createFromHexString(userId),
  });
  if (from && to) {
    query.find({
      $and: [
        { date: { $gte: new Date(from) } },
        { date: { $lte: new Date(to) } },
      ],
    });
  }
  if (!isNaN(limit)) {
    query.limit(limit);
  }
  const exercices = await query.exec();

  res.json({ log: exercices, ...user._doc, count: exercices.length });
});

app
  .route("/api/fileanalyse")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "/views/fileMetadata.html"));
  })
  .post(upload.single("upfile"), (req, res) => {
    file = req.file;
    if (!file) {
      return res.json({ error: "Could not open file" });
    }
    const { originalname, mimetype, size } = file;
    res.json({ name: originalname, type: mimetype, size });
  });

app.use((req, res, next) => {
  res.send("404 Not found");
  next();
});

app.listen(3000, () => console.log("Listening on port 3000"));
