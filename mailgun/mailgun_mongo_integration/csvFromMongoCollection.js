const { MongoClient } = require('mongodb');
const fs = require('fs');

async function run() {
    // const uri = "mongodb://localhost:27777/?readPreference=primary&directConnection=true&ssl=false";
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const dbName = "tradelink-dev";
        const collectionName = "users";
        const db = client.db(dbName);
        const collection = db.collection(collectionName); 

        const count = await collection.countDocuments();
        console.log(`Connected to database "${dbName}", collection "${collectionName}", ${count} documents found`);

        const cursor = collection.find({}, { projection: { email: 1, name: 1, tgBroadcastChannel:1, socials: 1, _id: 0 } });

        let csvData = 'name,email,telegram(broadcast),telegram(personal),twitter,website\n'; 
        let emailSet = new Set();

        await cursor.forEach(doc => {
            console.log(`Processing document: ${JSON.stringify(doc)}`);
            const tgBroadcastChannel = doc.tgBroadcastChannel || "";
            let socials = doc.socials || {};
            let name = doc.name.replace(/"/g, '""');
            let email = doc.email.replace(/"/g, '""');
            let telegramBroadcastChannel = tgBroadcastChannel.replace(/"/g, '""')?.split('/').pop() || "";
            telegramBroadcastChannel = telegramBroadcastChannel.startsWith('@') ? tgBroadcastChannel.slice(1) : tgBroadcastChannel;
            telegramBroadcastChannel = telegramBroadcastChannel !== '' ? `https://t.me/${telegramBroadcastChannel}` : telegramBroadcastChannel;
            let telegram = socials.tg?.split('/').pop() || "";
            telegram = telegram.startsWith('@') ? telegram.slice(1) : telegram;
            telegram = telegram !== '' ? `https://t.me/${telegram}` : telegram;
            let twitter = socials.tw?.split('/').pop() || "";
            twitter = twitter.startsWith('@') ? twitter.slice(1) : twitter;
            twitter = twitter !== '' ? `https://twitter.com/${twitter}` : twitter;
            let website = socials.link || '';
            console.log(website)

            // Use a regular expression to validate the email format
            let emailIsValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);

            if (!emailIsValid) {
                console.log(`Skipping document due to invalid email format: ${email}`);
                return;
            }

            // Check if the email has already been seen
            let emailLower = email.toLowerCase();

            // Check if the email has already been seen
            if (emailSet.has(emailLower)) {
                console.log(`Skipping document due to duplicate email: ${email}`);
                return;
            }

            // Add the email to the set of seen emails
            emailSet.add(emailLower);

            // console.log({name,email,telegramBroadcastChannel,telegram,twitter,website})

            csvData += `"${name}","${email}","${telegramBroadcastChannel}","${telegram}","${twitter}","${website}"\n`;
        });

        fs.writeFileSync('emails.csv', csvData);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);