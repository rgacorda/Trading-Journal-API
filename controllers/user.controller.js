const { User } = require("../models");

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

