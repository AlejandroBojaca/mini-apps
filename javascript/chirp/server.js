const express = require('express');
const fs = require('node:fs/promises');
const path = require('path');
const app = express();
const { Mutex } = require('async-mutex');

const bannedWords = [
  'kerfuffle',
  'sharbert',
  'fornax'
];

// Mutex for synchronizing file access
const dbMutex = new Mutex();

const dbPath = path.join(__dirname, 'database.json');

// Define the stateful struct to track file server hits
const apiConfig = {
  fileserverHits: 0,
};

app.use(express.json());

// Middleware to increment the file server hit counter
function middlewareMetricsInc(req, res, next) {
  apiConfig.fileserverHits++;
  next();
}

// Serve static files and apply the middleware
app.use('/app', middlewareMetricsInc, express.static(path.join(__dirname, 'app')));

// Handler to return the number of hits (only allow GET)
app.get('/api/metrics', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(`Hits: ${apiConfig.fileserverHits}`);
});

app.get('/api/admin/metrics', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`
    <html>
    <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${apiConfig.fileserverHits} times!</p>
    </body>
    </html>
  `);
});

// Handler to reset the number of hits (only allow GET)
app.get('/api/reset', (req, res) => {
  apiConfig.fileserverHits = 0;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send('Hits reset to 0');
});

// Handler for /healthz (only allow GET)
app.get('/api/healthz', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send('OK');
});

// Class to handle chirp database operations
class ChirpDB {
  constructor(path) {
    this.path = path;
  }

  async ensureDB() {
    try {
      await fs.access(this.path);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await this.writeDB({ chirps: {}, users: {} });
      } else {
        throw err;
      }
    }
  }

  async loadDB() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async writeDB(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createChirp(body) {
    await dbMutex.runExclusive(async () => {
      await this.ensureDB();
      const db = await this.loadDB();

      const newId = Object.keys(db.chirps).length + 1;
      const chirp = { id: newId, body };

      db.chirps[newId] = chirp;
      await this.writeDB(db);

      return chirp;
    });
  }

  async getChirps() {
    const db = await this.loadDB();
    const chirps = Object.values(db.chirps);
    chirps.sort((a, b) => a.id - b.id);
    return chirps;
  }

  async getChirpById(id) {
    await dbMutex.runExclusive(async () => {
      await this.ensureDB();
      const db = await this.loadDB();

      return db.chirps[id];
    });
  }

  async createUser(email) {
    await dbMutex.runExclusive(async () => {
      await this.ensureDB();
      const db = await this.loadDB();

      const newId = Object.keys(db.users).length + 1;
      const user = { id: newId, email };

      db.users[newId] = user;
      await this.writeDB(db);

      return user;
    });
  }
}

const chirpDB = new ChirpDB(dbPath);

// Endpoint to create a new chirp
app.post('/api/chirps', async (req, res) => {
  const { body: chirpBody } = req.body;

  if (chirpBody.length > 140) {
    return res.status(400).send('Chirp is too long');
  }

  let cleanChirp = chirpBody.split(' ').map(word => 
    bannedWords.includes(word.toLowerCase()) ? '****' : word
  ).join(' ');

  try {
    const chirp = await chirpDB.createChirp(cleanChirp);
    res.status(201).json(chirp);
  } catch (error) {
    res.status(500).send('Failed to create chirp');
  }
});

// Endpoint to retrieve all chirps
app.get('/api/chirps', async (req, res) => {
  try {
    const chirps = await chirpDB.getChirps();
    res.status(200).json(chirps);
  } catch (error) {
    res.status(500).send('Failed to retrieve chirps');
  }
});

// Endpoint to retrieve a single chirp by ID
app.get('/api/chirps/:id', async (req, res) => {
  const chirpId = parseInt(req.params.id, 10);

  try {
    const chirp = await chirpDB.getChirpById(chirpId);

    if (chirp) {
      res.status(200).json(chirp);
    } else {
      res.status(404).send('Chirp not found');
    }
  } catch (error) {
    res.status(500).send('Failed to retrieve chirp');
  }
});

// Endpoint to create a new user
app.post('/api/users', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await chirpDB.createUser(email);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send('Failed to create user');
  }
});

// Handle 404 for other routes
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Start the server
app.listen(8080, () => {
  console.log('Server running at http://localhost:8080/');
});
