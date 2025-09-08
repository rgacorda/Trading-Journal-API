const bcrypt = require("bcryptjs");
const { User, RefreshToken } = require("../models");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
} = require("../config/cookie");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
require("dotenv").config();

const createRefreshToken = async (user) => {
  await RefreshToken.destroy({ where: { userId: user.id } });

  const token = generateRefreshToken(user);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    await RefreshToken.create({
      token,
      expiresAt,
      userId: user.id,
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return await createRefreshToken(user);
    }
    throw err;
  }

  return token;
};

// Reusable function for sending verification email
const sendVerificationEmail = async (user) => {
  const verificationToken =
    user.verificationToken || crypto.randomBytes(32).toString("hex");
  user.verificationToken = verificationToken;
  await user.save();

  const verifyUrl = `${process.env.FRONTEND_URL_HTTPS}/verify-email?token=${verificationToken}`;
  await sendMail({
    to: user.email,
    subject: "Verify your email - Trade2Learn",
    html: `
      <div style="background: #f6f8fa; padding: 32px; border-radius: 12px; max-width: 420px; margin: auto; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
        <h2 style="color: #2e6c80; margin-bottom: 16px;">Email Verification</h2>
        <p style="font-size: 16px;">Hello ${user.firstname || "User"},</p>
        <p style="font-size: 16px; margin: 16px 0;">
          Please verify your email by clicking the button below:
        </p>
        <a href="${verifyUrl}" style="display: inline-block; background: #1565c0; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 17px; font-weight: 500; box-shadow: 0 2px 8px rgba(21,101,192,0.08); transition: background 0.2s;">
          Verify Email
        </a>
        <p style="font-size: 13px; color: #888; margin-top: 28px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  });
};

exports.register = async (req, res) => {
  const { email, password, firstname, lastname, middlename, phone } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      if (!existingUser.isVerified) {
        await sendVerificationEmail(existingUser);
        return res.status(409).json({
          message:
            "Email already registered but not verified. Verification email resent.",
        });
      } else {
        return res.status(409).json({ message: "Email already exists." });
      }
    }

    // Proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const userData = {
      email,
      password: hashedPassword,
      firstname,
      lastname,
      middlename,
      role: "free",
      isVerified: false,
      verificationToken,
    };
    if (phone) userData.phone = phone; // Only add phone if provided

    const user = await User.create(userData);

    await sendVerificationEmail(user);

    return res.status(201).json({
      message:
        "Registered successfully. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(400)
      .json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      attributes: [
        "firstname",
        "lastname",
        "middlename",
        "email",
        "phone",
        "password",
        "id",
        "role",
        "isVerified",
        "verificationToken",
      ],
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      await sendVerificationEmail(user);
      return res.status(403).json({
        message:
          "Account not verified. Verification email resent. Please check your email.",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await createRefreshToken(user);

    res.cookie("token", accessToken, accessTokenCookieConfig);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

    return res.status(200).json({
      message: "Login successful",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await RefreshToken.destroy({ where: { token: refreshToken } });
  }
  res.clearCookie("token", accessTokenCookieConfig);
  res.clearCookie("refreshToken", refreshTokenCookieConfig);
  return res.status(200).json({ message: "Logged out successfully" });
};

exports.refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const storedToken = await RefreshToken.findOne({ where: { token } });
    if (!storedToken) {
      return res.status(403).json({ message: "Refresh token not found" });
    }
    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) await storedToken.destroy();
      return res.status(403).json({ message: "Refresh token expired" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    // Token rotation (optional but good): delete old and issue new refresh token
    await storedToken.destroy();
    const newRefreshToken = await createRefreshToken(user);
    const newAccessToken = generateAccessToken(user);

    res.cookie("token", newAccessToken, accessTokenCookieConfig);
    res.cookie("refreshToken", newRefreshToken, refreshTokenCookieConfig);

    return res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    console.error("Refresh error:", err);
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

exports.checkAuth = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    res.status(200).json({ message: "Token valid", userId: payload.id });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({
        message: "If an account exists, a reset email has been sent.",
      });
    }

    const tempPassword = crypto.randomBytes(6).toString("base64").slice(0, 10);

    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    user.password = hashedPassword;
    await user.save();

    try {
      await sendMail({
        to: user.email,
        subject: "Password Reset - Trade2Learn",
        html: `
          <div style="background: #f6f8fa; padding: 32px; border-radius: 12px; max-width: 420px; margin: auto; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
            <h2 style="color: #2e6c80; margin-bottom: 16px;">Password Reset</h2>
            <p style="font-size: 16px;">Hello ${user.firstname || "User"},</p>
            <p style="font-size: 16px; margin: 16px 0;">
              Your temporary password is:<br>
              <span style="display: inline-block; background: #e3f2fd; color: #1565c0; font-weight: bold; padding: 8px 16px; border-radius: 6px; font-size: 18px; letter-spacing: 1px;">
                ${tempPassword}
              </span>
            </p>
            <p style="font-size: 15px; color: #555;">
              Please log in and change your password immediately for security.
            </p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
            <p style="font-size: 13px; color: #888;">
              If you did not request this, please ignore this email or contact support.
            </p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error("Failed to send reset email:", mailErr);
      return res.status(500).json({ message: "Failed to send reset email." });
    }

    return res.json({
      message: "If an account exists, a reset email has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  const token = req.body.token;

  if (!token) return res.status(400).json({ message: "Invalid token" });

  try {
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Verification failed" });
  }
};
