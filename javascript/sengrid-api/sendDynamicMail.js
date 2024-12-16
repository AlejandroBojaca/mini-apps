require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "davidbojaca1@gmail.com",
  from: {
    name: "DevTest Innovations",
    email: process.env.FROM_ADRESS,
  },
  templateId: process.env.TEMPLATE_ID,
  dynamicTemplateData: {
    name: "David",
  },
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
