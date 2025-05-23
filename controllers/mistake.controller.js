const { Mistake } = require("../models");

exports.getAllMistakes = async (req, res) => {
  try {
    const mistakes = await Mistake.findAll();
    res.status(200).json(mistakes);
  } catch (err) {
    console.error("Error fetching mistakes:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch mistakes", error: err.message });
  }
};

exports.getMistake = async (req, res) => {
  const { id } = req.params;
  try {
    const mistake = await Mistake.findByPk(id);
    if (!mistake) {
      return res.status(404).json({ message: "Mistake not found" });
    }
    res.status(200).json(mistake);
  } catch (err) {
    console.error("Error fetching mistake:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch mistake", error: err.message });
  }
};

exports.createMistake = async (req, res) => {
  const { name } = req.body;

  try {
    const mistake = await Mistake.create({ name });
    res.status(201).json(mistake);
  } catch (err) {
    console.error("Error creating mistake:", err);
    res
      .status(500)
      .json({ message: "Failed to create mistake", error: err.message });
  }
};

exports.updateMistake = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const mistake = await Mistake.findByPk(id);
    if (!mistake) {
      return res.status(404).json({ message: "Mistake not found" });
    }

    mistake.name = name;
    await mistake.save();
    res.status(200).json(mistake);
  } catch (err) {
    console.error("Error updating mistake:", err);
    res
      .status(500)
      .json({ message: "Failed to update mistake", error: err.message });
  }
};

exports.deleteMistake = async (req, res) => {
  const { id } = req.params;

  try {
    const mistake = await Mistake.findByPk(id);
    if (!mistake) {
      return res.status(404).json({ message: "Mistake not found" });
    }

    await mistake.destroy();
    res.status(200).json({ message: "Mistake deleted successfully" });
  } catch (err) {
    console.error("Error deleting mistake:", err);
    res
      .status(500)
      .json({ message: "Failed to delete mistake", error: err.message });
  }
};
