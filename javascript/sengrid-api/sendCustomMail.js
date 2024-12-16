require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "davidbojaca1@gmail.com",
  from: {
    name: "DevTest Innovations",
    email: process.env.FROM_ADRESS,
  },
  subject: "Sending test email with Twilio SendGrid",
  text: "Sending a test email with sengrid",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

const sendMail = async () => {
  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

sendMail();
