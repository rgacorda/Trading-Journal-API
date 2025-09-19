const nodemailer = require("nodemailer");
require("dotenv").config();
const { User } = require("../models");

const isDev = process.env.NODE_ENV === "development";

let transporter;
if (!isDev) {
  transporter = nodemailer.createTransport({
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
}

async function sendMail({ to, subject, text, html, autoVerifyUser = false }) {
  if (isDev) {
    console.log(
      `[DEV MODE] Email not sent. Would send to: ${to}, subject: ${subject}`
    );
    // Auto-verify user in development mode
    if (autoVerifyUser) {
      // Uncomment and adjust this for your actual User model
      await User.updateOne({ email: to }, { $set: { verified: true } });
      console.log(`[DEV MODE] Auto-verified user: ${to}`);
    }
    return { messageId: null, dev: true };
  }

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
