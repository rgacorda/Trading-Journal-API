const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { generateToken } = require("../utils/jwt");
const cookieConfig = require("../config/cookie");

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
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
  

    // Detect if request is from web (user-agent check) - optional
    const isWeb =
      req.headers["user-agent"]?.includes("Mozilla") ||
      req.query.platform === "web";

    if (isWeb) {
      // For web clients, send token in HTTP-only cookie
      res.cookie("token", token, cookieConfig);
      return res.status(200).json({ message: "Login successful" });
    }

    // For mobile or other clients, send token in response body (to store manually)
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", cookieConfig);
  return res.status(200).json({ message: "Logged out successfully" });
};
