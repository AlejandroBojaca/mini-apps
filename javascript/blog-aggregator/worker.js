const { getNextFeedsToFetch, markFeedFetched, saveToDB } = require('./queries')
const scrappe  = require('./scrapper')
const { v4 : uuidv4 } = require('uuid')

function worker() {
    setInterval(async () => {
        console.log('Start fetching xml file ...')
        const result = await getNextFeedsToFetch()
        if (result.length === 0) {
            console.log('No feeds to fetch')
            return 
        }
        const next = result[0];
        const now = Date.now();
        const xml = await scrappe(next.url);
        const id = uuidv4();
        await markFeedFetched(next.id);
        await saveToDB({
            text: `INSERT INTO posts(id, created_at, updated_at, title, url, description, feed_id) VALUES($1, to_timestamp($2 / 1000.0), to_timestamp($3 / 1000.0), $4, $5, $6, $7)`,
            values: [id, now, now, next.name, next.url, xml, next.id]
        });
        console.log('Successfully fetched xml')
    }, 10000)
}

module.exports = worker