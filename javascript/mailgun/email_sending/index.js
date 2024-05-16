require("dotenv").config();

// console.log(process.env.PRIVATE_MG_API || "key-yourkeyhere");
// const formData = require("form-data");
// const Mailgun = require("mailgun-js");
// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({
//   username: "api",
//   key: process.env.PRIVATE_MG_API || "key-yourkeyhere",
// });

// mg.messages
//   .create("sandbox-123.mailgun.org", {
//     from: "Excited User <mailgun@sandbox-123.mailgun.org>",
//     to: ["davidbojaca1@gmail.com"],
//     subject: "Hello",
//     text: "Testing some Mailgun awesomeness!",
//     html: "<h1>Testing some Mailgun awesomeness!</h1>",
//   })
//   .then((msg) => console.log(msg)) // logs response data
//   .catch((err) => console.log(err));

const mailgun = require("mailgun-js");
const DOMAIN = "sandboxca09e86942e349da91bdd55395a9f588.mailgun.org";
const mg = mailgun({
  apiKey: process.env.PRIVATE_MG_API,
  domain: DOMAIN,
});
const data = {
  from: `Mailgun Sandbox <postmaster${DOMAIN}>`,
  to: "alejandrobojaca1@gmail.com",
  subject: "Hello",
  template: "test",
  "h:X-Mailgun-Variables": JSON.stringify({
    test: "test",
    mail: "davidbojaca1@gmail.com",
    otp: "9c1d9cdc3107a1d7d91f3bde95c8350bc0da0d91e6c8cfd16a2f31060096bf6e",
    usr: "8992f481-11ca-4daf-b5d5-71a3b278c4b9",
  }),
};
mg.messages().send(data, function (error, body) {
  if (error) {
    console.log("error", error);
  }
  console.log(body);
});
