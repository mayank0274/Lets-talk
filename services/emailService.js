const nodemailer = require("nodemailer");

const sendEmail = (to, subject, link, purpose) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.outlook.com",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let html;
  if (purpose == "registration") {
    html = `
    <h1> Let's Talk Account verification </h1>
    <br>
    <a href=${link}>Click here to verify your account</a>`;
  } else {
    html = `
    <h1> Let's Talk Reset Password </h1>
    <br>
    <a href=${link}>Click here to reset password</a>`;
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
  };

  transporter
    .sendMail(mailOptions)
    .then((data) => {
      // console.log(data);
    })
    .catch((err) => {
      //  console.log(err);
    });
};

module.exports = sendEmail;
