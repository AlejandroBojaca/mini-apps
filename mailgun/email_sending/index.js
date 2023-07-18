require("dotenv").config();
const mailgun = require("mailgun-js");
const DOMAIN = "sandboxca09e86942e349da91bdd55395a9f588.mailgun.org";
const mg = mailgun({
  apiKey: process.env.PRIVATE_MG_API,
  domain: DOMAIN,
});
const data = {
  from: `Mailgun Sandbox <postmaster${DOMAIN}>`,
  to: "mail@gmail.com",
  subject: "Hello",
  template: "test",
  "h:X-Mailgun-Variables": JSON.stringify({
    test: "test",
    mail: "davidbojaca2@gmail.com",
  }),
};
mg.messages().send(data, function (error, body) {
  if (error) {
    console.log("error", error);
  }
  console.log(body);
});
