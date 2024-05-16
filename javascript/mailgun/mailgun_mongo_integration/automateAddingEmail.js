const util = require('util');

const request = util.promisify(require('request'));

const BASE_URL = 'https://api.mailjet.com/v3/REST';

const auth = {
    user: '9cffa87f3b957e5c01e25b1c39363690',
    pass: 'b06889d65414eed77750d72d76953120'
}

async function addUserEmail(email) {
    try {
        const contact = await request({
            url: `${BASE_URL}/contact/${encodeURIComponent(email)}`,
            method: 'GET',
            json: true,
            auth,
        });

        const contactExists = contact.body.Count > 0;

        if (!contactExists) {
            await request({
                url: `${BASE_URL}/contact`,
                method: 'POST',
                json: { Email: email },
                auth,
            });
        }

        const listID = '10313100';

        await request({
            url: `${BASE_URL}/listrecipient`,
            method: 'POST',
            json: {
                ContactAlt: email,
                ListID: listID,
                IsUnsubscribed: false
            }, 
            auth,
        });
    } catch (error) {
        console.error(error);
    }
}

addUserEmail('user5@example.com');


// const Mailjet = require('node-mailjet');

// const mailjet = new Mailjet({
//     apiKey: process.env.MJ_APIKEY_PUBLIC || '9cffa87f3b957e5c01e25b1c39363690',
//     apiSecret: process.env.MJ_APIKEY_PRIVATE || 'b06889d65414eed77750d72d76953120'
//   });

// async function addUserEmail(email) {
//     try {
//         const response = await mailjet
//             .post('contact', { 'version': 'v3' })
//             .request({ 'Email': email });

//         const contact = await mailjet
//             .get('contact', { 'version': 'v3' })
//             .id(email)
//             .request();

//         const contactExists = contact.body.Count > 0;

//         console.log(contactExists);

//         const contactID = response.body.Data[0].ID;

//         console.log(contactID);
//         const listID = '10313100';

//         const response2 = await mailjet
//             .post('listrecipient', { 'version': 'v3' })
//             .request({
//                 'ContactAlt': email,
//                 'ListID': listID,
//                 'IsUnsubscribed': false
//             });

//     } catch (error) {
//         console.error(error.statusText);
//     }
// }

// addUserEmail('user3@example.com');


// async function addUserEmail(email) {
//     try {
//         // Check if the contact already exists
//         const contact = await mailjet
//             .get('contact', { 'version': 'v3' })
//             .id(email)
//             .request();

//         const contactExists = contact.body.Count > 0;

//         console.log(contactExists);


//         if (!contactExists) {
//             // If the contact doesn't exist, create it
//             await mailjet
//                 .post('contact', { 'version': 'v3' })
//                 .request({ 'Email': email });
//         }

//         const listID = '10312613'; // Replace with your actual list ID

//         // Add the contact to the list
//         const response2 = await mailjet
//             .post('listrecipient', { 'version': 'v3' })
//             .request({
//                 'ContactAlt': email,
//                 'ListID': listID,
//                 'IsUnsubscribed': false
//             });

//         console.log(response2.body);
//     } catch (error) {
//         console.error(error);
//     }
// }

// addUserEmail('user@example.com');