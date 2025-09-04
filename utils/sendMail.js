const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_OAUTH_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("Error connecting to Gmail:", err);
  } else {
    console.log("Mailer ready ✅");
  }
});

async function sendMail({ to, subject, text, html }) {
  const from = `Trade2Learn Support <${process.env.GMAIL_OAUTH_USER}>`;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  console.log("Email sent:", info.messageId);
  return info;
}

module.exports = sendMail;
