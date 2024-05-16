const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC || '9cffa87f3b957e5c01e25b1c39363690',
    apiSecret: process.env.MJ_APIKEY_PRIVATE || 'b06889d65414eed77750d72d76953120'
  });

async function updateUserProperties(email, properties) {
    try {

        
        const response = await mailjet
            .put('contactdata', { 'version': 'v3' })
            .id(email)
            .request({
                'Data': properties.map(({Name, Value}) => ({Name, Value}))
            });

        console.log(response.body);
    } catch (error) {
        console.log(error)
        console.error(error.statusCode);
    } 
}

// Usage
updateUserProperties('mail@example.com', [
    { Name: 'telegram2', Value: 'value1' },
    { Name: 'twitter', Value: 'value2' }
]);