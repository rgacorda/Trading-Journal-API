const bcrypt = require("bcryptjs");
const { User, RefreshToken } = require("../models");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
} = require("../config/cookie");
const jwt = require("jsonwebtoken");

const createRefreshToken = async (userId) => {
  await RefreshToken.destroy({ where: { userId } });

  const generateToken = () =>
    jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    await RefreshToken.create({
      token,
      expiresAt,
      userId
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return await createRefreshToken(userId);
    }
    throw err;
  }

  return token;
};

exports.register = async (req, res) => {
  const { email, password, firstname, lastname, middlename, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      middlename,
      phone,
      role: "free",
    });

    return res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    if (
      err.name === "SequelizeUniqueConstraintError" &&
      err.errors[0].path === "email"
    ) {
      return res.status(409).json({ message: "Email already exists." });
    }
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
      ],
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await createRefreshToken(user.id);

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
  // res.clearCookie("token", accessTokenCookieConfig);
  res.clearCookie("refreshToken", refreshTokenCookieConfig);
  res.clearCookie("token", accessTokenCookieConfig);
  
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
    const newRefreshToken = await createRefreshToken(user.id);
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
