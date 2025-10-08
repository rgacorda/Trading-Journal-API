const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();
const { User } = require("../models");

const isDev = process.env.NODE_ENV === "development";

let transporter;
if (!isDev) {
  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/oauth/callback" // Not used in production, but required
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  // Function to get fresh access token
  async function getAccessToken() {
    try {
      const { token } = await oauth2Client.getAccessToken();
      return token;
    } catch (error) {
      console.error("Error getting access token:", error);
      throw error;
    }
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_OAUTH_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: getAccessToken, // Function that returns promise
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
