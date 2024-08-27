const express = require('express');
const cors = require('cors');
const pg = require('pg');
const { v4 : uuidv4 } = require('uuid')
const { createHash } = require('crypto')
const worker = require('./worker')
require("dotenv").config();

const app = express();

const { Client } = pg

app.use(cors());
app.use(express.json());

app.post('/v1/users', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).send("name is missing")
    }

    const id = uuidv4();
    const now = Date.now();
    const apiKey = createHash('sha256').update(uuidv4()).digest('hex');

    const query = {
        text: 'INSERT INTO users(id, created_at, updated_at, name, api_key) VALUES($1, to_timestamp($2 / 1000.0), to_timestamp($3 / 1000.0), $4, $5)',
        values: [id, now, now, name, apiKey],
    }

    const client = new Client();

    try {
        await client.connect();
        await client.query(query);
        res.status(200).send({
            id,
            "created_at": new Date(now),
            "updated_at": new Date(now),
            name,
            "api_key": apiKey
        });
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.end();
    }
});

app.get("/v1/feeds", async(req, res) => {
    const query = {
        text: 'SELECT * FROM feeds',
    }

    const client = new Client();

    try {
        await client.connect();
        const resp = await client.query(query);
        res.status(200).send(resp.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.end();
    }
})

//auth middleware
app.use(async (req, res, next) => {
    const apiKey = req.headers['authorization'];

    if (!apiKey) {
        return res.status(400).send("Missing APIKEY")
    }

    const query = {
        text: 'SELECT * FROM users WHERE api_key = $1',
        values: [apiKey]
    }

    const client = new Client();

    try {
        await client.connect();
        const resp = await client.query(query);
        if (resp.rows.length === 0) {
            return res.status(401).send("Invalid apiKey")
        }
        req.user = resp.rows[0];
        next();
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.end();
    }
})

app.get('/v1/users', async (req, res) => {
    return res.status(200).send(req.user)
})

app.post('/v1/feeds', async (req, res) => {
    const { name, url } = req.body;

    if (!name || !url) {
        return res.status(400).send("Missing parameters")
    }

    const { id: user_id } = req.user;
    const id = uuidv4();
    const now = Date.now();

    const client = new Client();

    try {
        await client.connect();
        const queryFeeds = {
            text: 'INSERT INTO feeds(id, created_at, updated_at, name, url, user_id) VALUES($1, to_timestamp($2 / 1000.0), to_timestamp($3 / 1000.0), $4, $5, $6)',
            values: [id, now, now, name, url, user_id]
        }
        await client.query(queryFeeds);

        const followId = uuidv4();
        const queryFeedFollows = {
            text: 'INSERT INTO feed_follows(id, created_at, updated_at, feed_id, user_id) VALUES($1, to_timestamp($2 / 1000.0), to_timestamp($3 / 1000.0), $4, $5)',
            values: [followId, now, now, id, user_id]
        }
        await client.query(queryFeedFollows);
        return res.status(200).send({
            id,
            "created_at": new Date(now),
            "updated_at": new Date(now),
            name,
            url,
            user_id
        })
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.end();
    }
})

app.post('/v1/feed_follows', async (req, res) => {
    const feed_id = req.body['feed_id'];

    if (!feed_id) {
        return res.status(400).send('Feed id not provided');
    }

    const { id: user_id } = req.user;
    const id = uuidv4();
    const now = Date.now();

    const client = new Client();

    try {
        const selectQuery = {
            text: 'SELECT * FROM feeds WHERE id = $1',
            values: [feed_id]
        }
        await client.connect();
        const resp = await client.query(selectQuery);

        if (resp.rows.length === 0) {
            return res.status(400).send("This feed does not exist")
        }

        const Insertquery = {
            text: 'INSERT INTO feed_follows(id, created_at, updated_at, feed_id, user_id) VALUES($1, to_timestamp($2 / 1000.0), to_timestamp($3 / 1000.0), $4, $5)',
            values: [id, now, now, feed_id, user_id]
        }
        await client.query(Insertquery);

        return res.status(200).send({
            id,
            feed_id,
            user_id,
            created_at: new Date(now),
            updated_at: new Date(now)
        })
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.end();
    }
})

app.get('/v1/feed_follows', async (req, res) => {
    const { id: user_id } = req.user;
    const client = new Client();

    try {
        await client.connect();
        const query = {
            text: 'SELECT * FROM feed_follows WHERE user_id = $1',
            values: [user_id],
        };
        const result = await client.query(query);

        res.status(200).send(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.end();
    }
})

app.delete('/v1/feed_follows/:feed_id', async (req, res) => {
    const { feed_id } = req.params;
    const user_id = req.user.id;

    if (!feed_id) {
        return res.status(400).send('Feed id not provided');
    }

    const query = {
        text: 'DELETE FROM feed_follows WHERE feed_id = $1 AND user_id = $2',
        values: [feed_id, user_id],
    };

    const client = new Client();

    try {
        await client.connect();
        const result = await client.query(query);

        if (result.rowCount === 0) {
            return res.status(404).send('Feed follow not found or not owned by user');
        }

        res.status(200).send('Feed unfollowed successfully');
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.end();
    }
});

app.use((req, res, next) => {
    res.status(404).send('Not found');
})

app.listen(8080, () => {
    console.log("Listening on port 8080")
})

worker();

