const { Account } = require("../models");

exports.getAllAccount = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const accounts = await Account.findAll({
      where: {
        userId,
      },
    });
    res.status(200).json(accounts);
  } catch (err) {
    console.error("Error fetching accounts:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch accounts", error: err.message });
  }
};

exports.getAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.status(200).json(account);
  } catch (err) {
    console.error("Error fetching account:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch account", error: err.message });
  }
};

exports.createAccount = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const account = await Account.create({ ...req.body, userId });
    res.status(201).json(account);
  } catch (err) {
    console.error("Error creating account:", err);
    res
      .status(500)
      .json({ message: "Failed to create account", error: err.message });
  }
};

exports.updateAccount = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  if (req.body.name) updateData.name = req.body.name;
  if (req.body.type) updateData.type = req.body.type;
  if (req.body.currency) updateData.currency = req.body.currency;
  if (req.body.balance) updateData.balance = req.body.balance;
  if (req.body.isAnalyticsIncluded !== undefined)
    updateData.isAnalyticsIncluded = req.body.isAnalyticsIncluded;
  if (req.body.isCommissionsIncluded !== undefined)
    updateData.isCommissionsIncluded = req.body.isCommissionsIncluded;

  try {
    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    await account.update(updateData);
    res.status(200).json(account);
  } catch (err) {
    console.error("Error updating account:", err);
    res
      .status(500)
      .json({ message: "Failed to update account", error: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const account = await Account.findByPk(id);
    
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    await account.destroy();
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res
      .status(500)
      .json({ message: "Failed to delete account", error: err.message });
  }
};
