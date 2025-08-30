const { Trade } = require("../models");

exports.getAllTrades = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const trades = await Trade.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: require("../models").Account,
          as: "Account",
          where: {
            isAnalyticsIncluded: true,
          },
          attributes: [], 
        },
      ],
    });
    const sortedTrades = trades.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json(sortedTrades);
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
  const { ticker, side, quantity, entry, exit, accountId, realized, time, date, grade, planId, mistakes, fees } =
    req.body;

  const updateData = {};

  if (ticker) updateData.ticker = ticker;
  if (side) updateData.side = side;
  if (quantity) updateData.quantity = quantity;
  if (entry) updateData.entry = entry;
  if (exit) updateData.exit = exit;
  if (accountId) updateData.accountId = accountId;
  if (realized) updateData.realized = realized;
  if (time) updateData.time = time;
  if (date) updateData.date = date;
  if (grade) updateData.grade = grade;
  if (planId) updateData.planId = planId;
  if (mistakes) updateData.mistakes = mistakes;
  if (fees) updateData.fees = fees;


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
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No trade IDs provided" });
  }

  try {
    const deletedCount = await Trade.destroy({
      where: {
        id: ids,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "No matching trades found" });
    }

    res.status(200).json({
      message: `${deletedCount} trade(s) deleted successfully`,
    });
  } catch (err) {
    console.error("Error deleting trade:", err);
    res
      .status(500)
      .json({ message: "Failed to delete trade", error: err.message });
  }
};
