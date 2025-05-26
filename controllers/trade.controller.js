const { Trade } = require("../models");

exports.getAllTrades = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const trades = await Trade.findAll({
      where: {
        userId,
      },
    })
    res.status(200).json(trades);
  } catch (err) {
    console.error("Error fetching trades:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch trades", error: err.message });
  }
};

exports.getTrade = async (req, res) => {
  const { id } = req.params;
  try {
    const trade = await Trade.findByPk(id);
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }
    res.status(200).json(trade);
  } catch (err) {
    console.error("Error fetching trade:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch trade", error: err.message });
  }
};

exports.createTrade = async (req, res) => {
  const { ticker, side, quantity, entry, exit, account, realized, time, date } =
    req.body;

  if (!ticker || !side || !quantity || !entry || !exit || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const trade = await Trade.create({
      ...(req.body || {
        ticker,
        side,
        quantity,
        entry,
        exit,
        account,
        realized,
        time,
        date,
        userId: req.body.id,
      }),
    });
    res.status(201).json(trade);
  } catch (err) {
    console.error("Error creating trade:", err);
    res
      .status(500)
      .json({ message: "Failed to create trade", error: err.message });
  }
};

exports.updateTrade = async (req, res) => {
  const { id } = req.params;
  const { ticker, side, quantity, entry, exit, account, realized, time, date } =
    req.body;

  const updateData = {};

  if (ticker) updateData.ticker = ticker;
  if (side) updateData.side = side;
  if (quantity) updateData.quantity = quantity;
  if (entry) updateData.entry = entry;
  if (exit) updateData.exit = exit;
  if (account) updateData.account = account;
  if (realized) updateData.realized = realized;
  if (time) updateData.time = time;
  if (date) updateData.date = date;

  try {
    const trade = await Trade.findByPk(id);
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    await trade.update(updateData);
    res.status(200).json(trade);
  } catch (err) {
    console.error("Error updating trade:", err);
    res
      .status(500)
      .json({ message: "Failed to update trade", error: err.message });
  }
};

exports.deleteTrade = async (req, res) => {
  const { id } = req.params;

  try {
    const trade = await Trade.findByPk(id);
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    await trade.destroy();
    res.status(200).json({ message: "Trade deleted successfully" });
  } catch (err) {
    console.error("Error deleting trade:", err);
    res
      .status(500)
      .json({ message: "Failed to delete trade", error: err.message });
  }
};
