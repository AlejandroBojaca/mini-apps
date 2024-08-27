const pg = require('pg');

const { Client } = pg

async function getNextFeedsToFetch() {
    const query = {
        text: `SELECT * FROM feeds
            ORDER BY last_fetched_at ASC NULLS FIRST
            LIMIT 1`,
    }

    const client = new Client();

    try {
        await client.connect();
        const result = await client.query(query);
        return result.rows
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

async function markFeedFetched(id) {
    console.log(id)
    const now = Date.now();
    const query = {
        text: `UPDATE feeds
            SET updated_at = to_timestamp($1 / 1000.0),
                last_fetched_at = to_timestamp($2 / 1000.0)
            WHERE id = $3
            `,
        values: [now, now, id]
    }

    const client = new Client();

    try {
        await client.connect();
        await client.query(query);
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

async function saveToDB(query) {
    const client = new Client();

    try {
        await client.connect();
        await client.query(query);
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

module.exports = {
    getNextFeedsToFetch,
    markFeedFetched,
    saveToDB,
}