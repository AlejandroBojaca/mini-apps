const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet  = require('helmet');
const mongoose = require('mongoose');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));


// app.get('/:id', (req, res) => {
//     // redirect to url
// })

mongoose.connect("mongodb://localhost:27017/urls", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection Successful!");
});

const schema = mongoose.Schema({
  longUrl: String,
  shortUrl: String
});

const Model = mongoose.model("model", schema, "url-paring");

var doc1 = new Model({ longUrl: "https://www.youtube.com/watch?v=gq5yubc1u18", shortUrl: 'hello' });

async function saveDoc() {
  try {
    const doc = await doc1.save();
    console.log("Document inserted successfully!");
  } catch(err) {
    console.error(err);
  }
}

app.get('/url', async (req, res) => {
    console.log('Please paste your url');
    // create short url
    saveDoc();
})

app.get('/url/:id', (req, res) => {
    // create short url
})

const port = process.env.PORT || 1234;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})