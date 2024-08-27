const { getNextFeedsToFetch, markFeedFetched, saveToDB } = require('./queries')
const scrappe  = require('./scrapper')

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
        await markFeedFetched(next.id);
        // await saveToDB({
        //     text: `INSERT INTO 
        //         SET updated_at = to_timestamp($1 / 1000.0),
        //             last_fetched_at = to_timestamp($2 / 1000.0)
        //         WHERE id = $3
        //         `,
        //     values: [now, now, next.id]
        // });
        console.log('Successfully fetched xml')
    }, 10000)
}

module.exports = worker