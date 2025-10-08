const { User, RefreshToken } = require("../models");
const bcrypt = require("bcryptjs");
const {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
} = require("../config/cookie");

exports.getUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id', 'phone'] }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.user;
  const { firstname, lastname, middlename, email, phone } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    // Update only provided fields
    if (firstname !== undefined) user.firstname = firstname;
    if (lastname !== undefined) user.lastname = lastname;
    if (middlename !== undefined) user.middlename = middlename;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id', 'verificationToken'] }
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res
      .status(500)
      .json({ message: "Failed to update user", error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { id } = req.user;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required (currentPassword, newPassword, confirmPassword)"
      });
    }

    // Validate new password matches confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match"
      });
    }

    // Validate new password is different from current
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password"
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res
      .status(500)
      .json({ message: "Failed to change password", error: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all refresh tokens associated with this user
    await RefreshToken.destroy({ where: { userId: id } });

    // Delete the user
    await user.destroy();

    // Clear cookies
    res.clearCookie("token", accessTokenCookieConfig);
    res.clearCookie("refreshToken", refreshTokenCookieConfig);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res
      .status(500)
      .json({ message: "Failed to delete account", error: err.message });
  }
};

