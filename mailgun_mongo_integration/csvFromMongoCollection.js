const { MongoClient } = require('mongodb');
const fs = require('fs');

async function run() {
    const uri = "";
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const dbName = "";
        const collectionName = "";
        const db = client.db(dbName);
        const collection = db.collection(collectionName); 

        const count = await collection.countDocuments();
        console.log(`Connected to database "${dbName}", collection "${collectionName}", ${count} documents found`);

        const cursor = collection.find({}, { projection: { email: 1, name: 1, _id: 0 } });

        let csvData = 'name,email\n'; 
        let emailSet = new Set();

        await cursor.forEach(doc => {
            console.log(`Processing document: ${JSON.stringify(doc)}`);
            let name = doc.name.replace(/"/g, '""');
            let email = doc.email.replace(/"/g, '""');

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

            csvData += `"${name}","${email}"\n`;
        });

        fs.writeFileSync('emails.csv', csvData);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);